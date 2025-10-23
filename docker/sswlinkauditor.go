package main

import (
	"context"
	"crypto/tls"
	"errors"
	"fmt"
	"io"
	"net"
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

func getClient() *http.Client {
	return &http.Client{
		Timeout: 1 * time.Minute,
		Transport: &http.Transport{
			TLSNextProto: map[string]func(authority string, c *tls.Conn) http.RoundTripper{},
			Dial: (&net.Dialer{
                Timeout:   30 * time.Second,
                KeepAlive: 30 * time.Second,
        	}).Dial,
			TLSHandshakeTimeout:   10 * time.Second,
			ResponseHeaderTimeout: 10 * time.Second,
			ExpectContinueTimeout: 1 * time.Second,
		},
	}
}

func addClientHeaders(r *http.Request) {
	if r != nil {
		r.Header.Add("User-Agent", "Mozilla/5.0 (compatible; SSWCodeAuditor; +https://codeauditor.com/)")
		r.Header.Set("Cache-Control", "no-cache")
		r.Header.Set("Connection", "keep-alive")
		r.Header.Set("Accept-Encoding", "*")
	}
}

func isRedirect(resp *http.Response) bool{
	return (resp.StatusCode > 300 && resp.StatusCode < 400)
}

func getRedirectLocation(url string, client *http.Client) string { 
	resp, err := client.Get(url)
	if err != nil {
		fmt.Println("encountered error following redirect chain: ",url, err)
		return url
	}
	if isRedirect(resp) {
		var redirectLocation = resp.Header.Get("Location")
		// Resolve relative URLs against the current URL
		baseURL, err := urlP.Parse(url)
		if err != nil {
			fmt.Println("error parsing base URL:", url, err)
			return url
		}
		resolvedURL, err := baseURL.Parse(redirectLocation)
		if err != nil {
			fmt.Println("error resolving redirect URL:", redirectLocation, err)
			return url
		}
		return getRedirectLocation(resolvedURL.String(), client)
	}
	return url
}

func getRedirectChainFinalUrl(url string) string {
	client := &http.Client{
		// prevents the client from following redirects
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
		Timeout: 1 * time.Minute,
	}
	return getRedirectLocation(url, client)
}

func check(link Link, linkch chan LinkStatus, number int) {
	fmt.Println("CHEC", number, link.url)

	client := getClient()
	defer client.CloseIdleConnections()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	r, e := http.NewRequestWithContext(ctx, "GET", link.url, nil)
	if r != nil {
		addClientHeaders(r)
		r.Header.Add("Accept", "*/*")
	}
	dnsErr := new(net.DNSError)

	if e != nil {
		linkch <- LinkStatus{link.url, link.srcUrl, "Link Invalid", 0, link.anchor}
		return
	}

	resp, err := client.Do(r)

	if err != nil {
		fmt.Println("error: ", err)
		if errors.As(err, &dnsErr) {
			linkch <- LinkStatus{link.url, link.srcUrl, "Host error", 0, link.anchor}
		} else {
			linkch <- LinkStatus{link.url, link.srcUrl, "Unknown error", -1, link.anchor}
		}
	} else {
		defer resp.Body.Close()
		linkch <- LinkStatus{link.url, link.srcUrl, resp.Status, resp.StatusCode, link.anchor}
	}
}

func isSameOrigin(url1 string, url2 string) bool {
	url1Parsed, _ := urlP.Parse(url1)
	url2Parsed, _ := urlP.Parse(url2)
	return url1Parsed.Host == url2Parsed.Host
}

func isSameOriginAndPath(baseUrl string, targetUrl string) bool {
	// Normalize URLs by ensuring they have trailing slashes for comparison
	normalizedBase := strings.TrimRight(baseUrl, "/") + "/"
	normalizedTarget := strings.TrimRight(targetUrl, "/") + "/"
	
	return strings.Index(normalizedTarget, normalizedBase) == 0
}

func crawl(link Link, ch chan Link, linkch chan LinkStatus, number int) {
	fmt.Println("CRAW", number, link.url)
	client := &http.Client{
		// prevents the client from following redirects to end of chain
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
		Timeout: 1 * time.Minute,
	}
	resp, err := client.Get(link.url)
	dnsErr := new(net.DNSError)

	defer func() {
		if err != nil {
			fmt.Println("error: ", err)
			if errors.As(err, &dnsErr) {
				linkch <- LinkStatus{link.url, link.srcUrl, "Host error", 0, link.anchor}
			} else {
				linkch <- LinkStatus{link.url, link.srcUrl, "Unknown error", -1, link.anchor}
			}
		} else {
			linkch <- LinkStatus{link.url, link.srcUrl, resp.Status, resp.StatusCode, link.anchor}
		}
	}()

	if err != nil {
		return
	}

	b := resp.Body
	defer b.Close()

	// check whether the response was a redirect
	if isRedirect(resp) {
		finalUrl := getRedirectChainFinalUrl(link.url)

		if isSameOrigin(link.url, finalUrl) {
			// if the url is on the same origin, add it to the channel to be scraped
			ch <- Link{finalUrl, link.url, "a", link.anchor + " (redirected)"}
		}

        // check if the final page 404s or not
		newResp, newErr := client.Get(finalUrl)

		if newErr == nil {
			// use the response from the end of the redirect chain to determine if the current link
			// is valid
			resp = newResp
			err = newErr

			// return prematurely to skip scraping the HTML from redirect urls
			// if the destination of the redirect is on the same origin it will be scraped later
			return 
		}
	}
	scrapeLinksFromHtml(ch, link.url, b)
}

func scrapeLinksFromHtml(ch chan Link, pageFound string, htmlString io.ReadCloser) {
	z := html.NewTokenizer(htmlString)
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
					ch <- Link{linkUrl, pageFound, "a", text}
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
						ch <- Link{newUrl, pageFound, t.Data, ""}
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
		f.WriteString(sanitizeString(v.srcUrl) + "\t" + sanitizeString(v.url) + "\t" + sanitizeString(v.status) + "\t" + strconv.Itoa(v.statusCode) + "\t" + sanitizeString(v.anchor) + "\n")
	}

	f.Close()
}

func sanitizeString(s string) string {
	replacer := strings.NewReplacer(
		"\"", "",
		"\t", " ",
		"\r\n", "",
		"\n", "",
	);

	return replacer.Replace(s);
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

						if isSameOriginAndPath(startUrl.url, link.url) && link.linkType == "a" && !isResourceFile(link.url) {
							crawl(link, chUrls, chAllUrls, crawling)
						} else {
							check(link, chAllUrls, crawling)
						}

						<-concurrentGoroutines
					}()
				} else {
					// no limit
					if isSameOriginAndPath(startUrl.url, link.url) && link.linkType == "a" && !isResourceFile(link.url) {
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

		// Pause for 3 milliseconds before each job completes
		time.Sleep(3 * time.Millisecond)

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
