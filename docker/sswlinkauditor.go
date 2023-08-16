package main

import (
	"fmt"
	"io"
	"net/http"

	urlP "net/url"
	"os"
	"path"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"

	"golang.org/x/net/html"
)

type LinkStatus struct {
	url        string
	srcUrl     string
	status     string
	statusCode int
	anchor     string
}

type Link struct {
	url      string
	srcUrl   string
	linkType string
	anchor   string
}

func getHref(t html.Token) (ok bool, href string) {
	for _, a := range t.Attr {
		if a.Key == "href" || a.Key == "src" {
			href = a.Val
			ok = true
		}
	}
	return
}

func check(link Link, linkch chan LinkStatus, number int) {
	fmt.Println("CHEC", number, link.url)

	client := &http.Client{}
	method := "HEAD"


	if isLinkUnscannable(link.url) {
		method = "GET"
	}

	r, e := http.NewRequest(method, link.url, nil)

	if e != nil {
		linkch <- LinkStatus{link.url, link.srcUrl, "Link Invalid", 0, link.anchor}
		return
	}

	resp, error := client.Do(r)

	if error != nil {
		linkch <- LinkStatus{link.url, link.srcUrl, "Empty Response", 0, link.anchor}
	} else {
		linkch <- LinkStatus{link.url, link.srcUrl, resp.Status, resp.StatusCode, link.anchor}
	}
}

func crawl(link Link, ch chan Link, linkch chan LinkStatus, number int) {
	fmt.Println("CRAW", number, link.url)
	resp, err := http.Get(link.url)

	defer func() {
		if err != nil {
			fmt.Println("error:", err)
			linkch <- LinkStatus{link.url, link.srcUrl, "Empty Response", 0, link.anchor}
		} else {
			linkch <- LinkStatus{link.url, link.srcUrl, resp.Status, resp.StatusCode, link.anchor}
		}
	}()

	if err != nil {
		return
	}

	b := resp.Body
	defer b.Close()

	z := html.NewTokenizer(b)

	depth := 0
	var linkUrl string
	for {
		tt := z.Next()
		switch tt {
		case html.ErrorToken:
			err := z.Err()
			if err == io.EOF {
				return
			}
			fmt.Println("Error with tokenizer", err)
			return

		case html.TextToken:
			if depth > 0 {
				text := strings.TrimSpace(string(z.Text()))
				ch <- Link{linkUrl, link.url, "a", text}
			}
		case html.StartTagToken, html.SelfClosingTagToken, html.EndTagToken:
			t := z.Token()

			if t.Data == "a" || t.Data == "img" || t.Data == "link" || t.Data == "iframe" {
				_, newUrl := getHref(t)
				if t.Data == "a" {
					linkUrl = newUrl
					if tt == html.StartTagToken {
						depth++
					} else if tt == html.EndTagToken {
						depth--
					}
				} else {
					ch <- Link{newUrl, link.url, t.Data, ""}
				}
			}

		}
	}
}

func parseUrl(startUrl string, url string) string {
	url = strings.TrimSpace(url)

	if strings.Index(url, "#") > 0 {
		url = strings.Split(url, "#")[0]
	}

	if strings.HasPrefix(url, "http") {
		return url
	}

	sUrl, _ := urlP.Parse(startUrl)

	if strings.HasPrefix(url, "//") {
		return sUrl.Scheme + ":" + url
	} else if strings.HasPrefix(url, "/") {
		u, _ := urlP.Parse(startUrl)
		return sUrl.Scheme + "://" + u.Hostname() + url
	} else {

		UrlPath := sUrl.Path
		// strip out the filename (e.g. .aspx  or .asp or .php) because .Join() method doesn't handle this correctly
		r := regexp.MustCompile(`(?P<file>\/[^\/]+\.[a-z0-9]+/*)$`)

		if len(r.FindStringSubmatch(UrlPath)) > 0 {
			fileName := r.FindStringSubmatch(UrlPath)[0]
			UrlPath = strings.ReplaceAll(UrlPath, fileName, "")
		}

		baseUrl := sUrl.Scheme + "://" + sUrl.Hostname() + UrlPath
		if !strings.HasSuffix(baseUrl, "/") {
			baseUrl = baseUrl + "/"
		}

		u, _ := urlP.Parse(baseUrl)
		u.Path = path.Join(u.Path, url)
		return u.String()
	}
}

func isProtocolUrl(url string) bool {
	r := regexp.MustCompile(`^[a-z]+:[^\/\/]`)
	if len(r.FindStringSubmatch(url)) > 0 {
		return true
	}
	return false
}

func isResourceFile(url string) bool {
	r := regexp.MustCompile(`.*\.(mht|jpg|png|css|js|ico|gif|svg|mp3|ttf)`)
	if len(r.FindStringSubmatch(url)) > 0 {
		return true
	}
	return false
}

func writeResultFile(allUrls map[string]LinkStatus) {
	if _, err := os.Stat("all_links.csv"); os.IsExist(err) {
		os.Remove("all_links.csv")
	}

	f, err := os.Create("all_links.csv")
	if err != nil {
		fmt.Println("Can't create output file", err)
		return
	}

	f.WriteString("Source" + "\t" + "Destination" + "\t" + "Status" + "\t" + "StatusCode" + "\t" + "Anchor" + "\n")
	for _, v := range allUrls {
		f.WriteString(v.srcUrl + "\t" + v.url + "\t" + v.status + "\t" + strconv.Itoa(v.statusCode) + "\t" + strings.ReplaceAll(v.anchor,"\"","") + "\n")
	}

	f.Close()
}

func isLinkUnscannable(a string) bool {
	unscannableLinks := []string{
		"https://learn.microsoft.com/en-us/",
        "https://support.google.com/",
        "https://twitter.com/",
        "https://marketplace.visualstudio.com/",
        "https://www.nuget.org/",
        "https://make.powerautomate.com",
        "https://www.microsoft.com/",
        "http://www.microsoft.com/",
        "https://answers.microsoft.com/",
        "https://admin.microsoft.com/",
        "https://ngrx.io",
        "https://twitter.com",
        "https://marketplace",
        "https://www.nuget.org/",
        "http://nuget.org",
        "https://t.co",
        "https://support.google.com",
        "https://playwright.dev",
        "https://www.theurlist.com/xamarinstreamers",
        "https://dev.botframework.com",
        "https://www.ssw.com.au/rules/rules-to-better-research-and-development/",
        "https://www.ato.gov.au/Business/Research-and-development-tax-incentive/",
        "https://learn.microsoft.com/en-us/assessments/?mode=home/",
	}

    for _, b := range unscannableLinks {
        if strings.HasPrefix(strings.ToLower(a), strings.ToLower(b)) {
            return true
        }
    }
    return false
}

func main() {
	allUrls := make(map[string]LinkStatus)
	startUrl := Link{os.Args[1], "", "a", ""}
	maxThreadCount := -1
	concurrentGoroutines := make(chan struct{}, 1)
	if len(os.Args) > 2 {
		maxThreadCount, _ = strconv.Atoi(os.Args[2])
		fmt.Println("Start with max concurrent routines of", maxThreadCount)
		concurrentGoroutines = make(chan struct{}, maxThreadCount)
	}

	var wg sync.WaitGroup

	start := time.Now()

	chUrls := make(chan Link)
	chAllUrls := make(chan LinkStatus)

	max := 1
	crawling := 1
	go crawl(startUrl, chUrls, chAllUrls, crawling)

	for crawling >= 1 {
		select {
		case link := <-chUrls:

			if isProtocolUrl(link.url) ||
				strings.HasPrefix(link.url, "#") ||
				strings.HasPrefix(link.url, "?") ||
				link.url == "" {
				continue
			}

			link.url = parseUrl(link.srcUrl, link.url)
			_, crawled := allUrls[link.url]

			if !crawled {
				allUrls[link.url] = LinkStatus{link.url, link.srcUrl, "", 0, link.anchor}
				crawling++
				if crawling > max {
					max = crawling
				}

				if maxThreadCount != -1 {
					wg.Add(1)
					go func() {
						defer wg.Done()
						concurrentGoroutines <- struct{}{}

						if strings.Index(link.url, startUrl.url) == 0 && link.linkType == "a" && !isResourceFile(link.url) {
							crawl(link, chUrls, chAllUrls, crawling)
						} else {
							check(link, chAllUrls, crawling)
						}

						<-concurrentGoroutines
					}()
				} else {
					// no limit
					if strings.Index(link.url, startUrl.url) == 0 && link.linkType == "a" && !isResourceFile(link.url) {
						go crawl(link, chUrls, chAllUrls, crawling)
					} else {
						go check(link, chAllUrls, crawling)
					}
				}

			}

		case status := <-chAllUrls:
			crawling = crawling - 1
			fmt.Println("DONE", crawling, status.url)
			allUrls[status.url] = status
		}

	}

	elapse := time.Since(start)
	fmt.Printf("\n Took %v, Checked %v URLs, max goroutines %v\n", elapse, len(allUrls), max)

	fmt.Printf("\n Broken links: \n")

	for _, v := range allUrls {
		if v.statusCode < 200 || v.statusCode > 399 {
			fmt.Printf("%v -> %v (%v)\n", v.srcUrl, v.url, strconv.Itoa(v.statusCode))
		}
	}

	writeResultFile(allUrls)

	fmt.Println("wrote result to all_links.csv")

	close(chUrls)
}
