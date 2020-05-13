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
	"time"

	"golang.org/x/net/html"
)

type LinkStatus struct {
	url        string
	srcUrl     string
	status     string
	statusCode int
}

type Link struct {
	url      string
	srcUrl   string
	linkType string
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

func test() {
	client := &http.Client{}
	r, e := http.NewRequest("HEAD", "https://skype:adamcogan?call", nil)

	if e != nil {
		fmt.Println("error", e)
		return
	}
	resp, error := client.Do(r)

	if error != nil {
		fmt.Println("error", error)
	} else {
		fmt.Println("ok", resp.Status)
	}
}

func check(link Link, linkch chan LinkStatus, number int) {
	fmt.Println("CHECK", number, ":", link.url)

	client := &http.Client{}
	r, e := http.NewRequest("HEAD", link.url, nil)

	if e != nil {
		linkch <- LinkStatus{link.url, link.srcUrl, "Link Invalid", 0}
		return
	}

	resp, error := client.Do(r)

	if error != nil {
		linkch <- LinkStatus{link.url, link.srcUrl, "Empty Response", 0}
	} else {
		linkch <- LinkStatus{link.url, link.srcUrl, resp.Status, resp.StatusCode}
	}
}

func crawl(link Link, ch chan Link, linkch chan LinkStatus, number int) {
	fmt.Println("CRAWL", number, ":", link.url)
	resp, err := http.Get(link.url)

	defer func() {
		if err != nil {
			linkch <- LinkStatus{link.url, link.srcUrl, "Empty Response", 0}
		} else {
			linkch <- LinkStatus{link.url, link.srcUrl, resp.Status, resp.StatusCode}
		}
	}()

	if err != nil {
		return
	}

	b := resp.Body
	defer b.Close()

	z := html.NewTokenizer(b)

	for {
		tt := z.Next()
		switch {
		case tt == html.ErrorToken:
			err := z.Err()
			if err == io.EOF {
				return
			}
			fmt.Println("Error with tokenizer", err)
			return

		case tt == html.StartTagToken || tt == html.SelfClosingTagToken:
			t := z.Token()

			if t.Data == "a" || t.Data == "img" || t.Data == "link" {
				_, newUrl := getHref(t)
				ch <- Link{newUrl, link.url, t.Data}
			}
		}
	}
}

func parseUrl(startUrl string, url string) string {
	url = strings.TrimSpace(url)

	if strings.Index(url, "#") > 0 {
		url = strings.Split(url, "#")[0]
	}

	if strings.Index(url, "?") > 0 {
		url = strings.Split(url, "?")[0]
	}

	if strings.HasPrefix(url, "http") {
		// already a fully formed url
		return url
	}

	sUrl, _ := urlP.Parse(startUrl)

	if strings.HasPrefix(url, "//") {
		// fmt.Println(url, "1.becomes", "https:"+url)
		return sUrl.Scheme + "://" + url
	} else if strings.HasPrefix(url, "/") {
		// start with / => this is related to the full path
		u, _ := urlP.Parse(startUrl)
		// fmt.Println(url, "2.becomes", protocol+u.Hostname()+url)
		return sUrl.Scheme + "://" + u.Hostname() + url
	} else {

		UrlPath := sUrl.Path
		// strip out the filename (e.g. .aspx  or .asp or .php)
		r := regexp.MustCompile(`(?P<file>\/[^\/]+\.[a-z0-9]+/*)$`)

		// check if the path is ASPX or PHP
		if len(r.FindStringSubmatch(UrlPath)) > 0 {
			// fmt.Println(startUrl, "path is a file (e.g. php/aspx)")
			fileName := r.FindStringSubmatch(UrlPath)[0]
			UrlPath = strings.ReplaceAll(UrlPath, fileName, "")
		}

		baseUrl := sUrl.Scheme + "://" + sUrl.Hostname() + UrlPath
		if !strings.HasSuffix(baseUrl, "/") {
			baseUrl = baseUrl + "/"
		}

		u, _ := urlP.Parse(baseUrl)
		u.Path = path.Join(u.Path, url)
		// fmt.Println("base", startUrl, "dest", url, "new URL", u.String())
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

func main() {
	allUrls := make(map[string]LinkStatus)
	startUrl := Link{os.Args[1], "", "a"}
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

			// fmt.Println("original url is", link.url, "on", link.srcUrl)
			link.url = parseUrl(link.srcUrl, link.url)
			_, crawled := allUrls[link.url]
			// fmt.Println("parsed url is", link.url)

			if !crawled {
				allUrls[link.url] = LinkStatus{link.url, link.srcUrl, "", 0}
				crawling++
				if crawling > max {
					max = crawling
				}
				if strings.Index(link.url, startUrl.url) == 0 && link.linkType == "a" && !isResourceFile(link.url) {
					go crawl(link, chUrls, chAllUrls, crawling)
				} else {
					go check(link, chAllUrls, crawling)
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
			fmt.Printf("\n%v -> %v (%v)", v.srcUrl, v.url, strconv.Itoa(v.statusCode))
		}
	}
	fmt.Println("")

	close(chUrls)
}
