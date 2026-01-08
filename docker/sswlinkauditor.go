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
	"sync/atomic"
	"time"

	"golang.org/x/net/html"
)

// Pre-compiled regex patterns for performance
var (
	filenameRegex     = regexp.MustCompile(`(?P<file>\/[^\/]+\.[a-z0-9]+/*)$`)
	protocolRegex     = regexp.MustCompile(`^[a-z]+:[^\/\/]`)
	resourceFileRegex = regexp.MustCompile(`.*\.(mht|jpg|png|css|js|ico|gif|svg|mp3|ttf)`)
)

// Shared HTTP transport for connection pooling across all requests
var sharedTransport = &http.Transport{
	TLSNextProto: map[string]func(authority string, c *tls.Conn) http.RoundTripper{},
	DialContext: (&net.Dialer{
		Timeout:   30 * time.Second,
		KeepAlive: 30 * time.Second,
	}).DialContext,
	TLSHandshakeTimeout:   10 * time.Second,
	ResponseHeaderTimeout: 10 * time.Second,
	ExpectContinueTimeout: 1 * time.Second,
	MaxIdleConns:          100,
	MaxIdleConnsPerHost:   10,
	IdleConnTimeout:       90 * time.Second,
}

// Shared client
var (
	noRedirectsClient = &http.Client{
		Timeout:   1 * time.Minute,
		Transport: sharedTransport,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			return http.ErrUseLastResponse
		},
	}
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

func getRedirectLocation(url string, client *http.Client, visited map[string]bool, depth int) string {
	const maxRedirectDepth = 10
	
	if depth > maxRedirectDepth {
		fmt.Println("max redirect depth exceeded for:", url)
		return url
	}
	
	if visited[url] {
		fmt.Println("redirect loop detected:", url)
		return url
	}
	visited[url] = true
	
	resp, err := client.Get(url)
	if err != nil {
		fmt.Println("encountered error following redirect chain: ",url, err)
		return url
	}
	defer resp.Body.Close()
	
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
		return getRedirectLocation(resolvedURL.String(), client, visited, depth+1)
	}
	return url
}

func getRedirectChainFinalUrl(url string) string {
	visited := make(map[string]bool)
	return getRedirectLocation(url, noRedirectsClient, visited, 0)
}

func check(link Link, linkch chan LinkStatus, number int) {
	fmt.Println("CHEC", number, link.url)

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

	// Use noRedirectsClient to report actual status codes (301/302) instead of following redirects
	resp, err := noRedirectsClient.Do(r)

	if err != nil {
		fmt.Println("error: ", err)
		if errors.As(err, &dnsErr) {
			linkch <- LinkStatus{link.url, link.srcUrl, "Host error", 0, link.anchor}
		} else {
			linkch <- LinkStatus{link.url, link.srcUrl, "Unknown error", -1, link.anchor}
		}
		return
	}
	
	defer resp.Body.Close()
	
	// Report the actual status code (including redirects)
	linkch <- LinkStatus{link.url, link.srcUrl, resp.Status, resp.StatusCode, link.anchor}
	
	// If it's a redirect, verify the destination isn't broken
	if isRedirect(resp) {
		finalUrl := getRedirectChainFinalUrl(link.url)
		
		// Check if redirect destination is accessible
		destResp, destErr := noRedirectsClient.Get(finalUrl)
		if destErr != nil {
			fmt.Printf("Warning: %s redirects to broken destination %s\n", link.url, finalUrl)
		} else {
			destResp.Body.Close()
			// If destination is also a redirect or error, log it
			if destResp.StatusCode >= 400 {
				fmt.Printf("Warning: %s redirects to %s which returns %d\n", link.url, finalUrl, destResp.StatusCode)
			}
		}
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
	resp, err := noRedirectsClient.Get(link.url)
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

        // check if the final page 404s or not
		newResp, newErr := noRedirectsClient.Get(finalUrl)

		if newErr == nil {
			defer newResp.Body.Close()
			// use the response from the end of the redirect chain to determine if the current link
			// is valid
			resp = newResp
			err = newErr

			// Scrape links from redirect destination to catch broken links on redirected pages
			// This handles same-origin redirects without re-queuing them
			if isSameOrigin(link.url, finalUrl) {
				scrapeLinksFromHtml(ch, finalUrl, newResp.Body)
			}
			return
		}
		return
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
		if len(filenameRegex.FindStringSubmatch(UrlPath)) > 0 {
			fileName := filenameRegex.FindStringSubmatch(UrlPath)[0]
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
	if len(protocolRegex.FindStringSubmatch(url)) > 0 {
		return true
	}
	return false
}

func isResourceFile(url string) bool {
	if len(resourceFileRegex.FindStringSubmatch(url)) > 0 {
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
	var allUrlsMutex sync.Mutex
	startUrl := Link{os.Args[1], "", "a", ""}
	maxThreadCount := -1
	concurrentGoroutines := make(chan struct{}, 1)
	if len(os.Args) > 2 {
		maxThreadCount, _ = strconv.Atoi(os.Args[2])
		fmt.Println("Start with max concurrent routines of", maxThreadCount)
		concurrentGoroutines = make(chan struct{}, maxThreadCount)
	}

	var wg sync.WaitGroup
	var crawling int64 = 1
	var max int64 = 1

	start := time.Now()

	chUrls := make(chan Link, 100)
	chAllUrls := make(chan LinkStatus, 100)

	go crawl(startUrl, chUrls, chAllUrls, int(atomic.LoadInt64(&crawling)))

	for atomic.LoadInt64(&crawling) >= 1 {
		select {
		case link := <-chUrls:

			if isProtocolUrl(link.url) ||
				strings.HasPrefix(link.url, "#") ||
				strings.HasPrefix(link.url, "?") ||
				link.url == "" {
				continue
			}

			link.url = parseUrl(link.srcUrl, link.url)
			
			allUrlsMutex.Lock()
			_, crawled := allUrls[link.url]

			if !crawled {
				allUrls[link.url] = LinkStatus{link.url, link.srcUrl, "", 0, link.anchor}
				allUrlsMutex.Unlock()
				
				current := atomic.AddInt64(&crawling, 1)
				for {
					currentMax := atomic.LoadInt64(&max)
					if current <= currentMax || atomic.CompareAndSwapInt64(&max, currentMax, current) {
						break
					}
				}

				if maxThreadCount != -1 {
					wg.Add(1)
					go func(l Link, count int) {
						defer wg.Done()
						concurrentGoroutines <- struct{}{}

						if isSameOriginAndPath(startUrl.url, l.url) && l.linkType == "a" && !isResourceFile(l.url) {
							crawl(l, chUrls, chAllUrls, count)
						} else {
							check(l, chAllUrls, count)
						}

						<-concurrentGoroutines
					}(link, int(current))
				} else {
					// no limit
					if isSameOriginAndPath(startUrl.url, link.url) && link.linkType == "a" && !isResourceFile(link.url) {
						go crawl(link, chUrls, chAllUrls, int(current))
					} else {
						go check(link, chAllUrls, int(current))
					}
				}

			} else {
				allUrlsMutex.Unlock()
			}

		case status := <-chAllUrls:
			current := atomic.AddInt64(&crawling, -1)
			fmt.Println("DONE", current, status.url)
			allUrlsMutex.Lock()
			allUrls[status.url] = status
			allUrlsMutex.Unlock()
		}

		// Pause for 3 milliseconds before each job completes
		time.Sleep(3 * time.Millisecond)

	}

	// Wait for all goroutines to complete if using thread limit
	if maxThreadCount != -1 {
		wg.Wait()
	}

	elapse := time.Since(start)
	fmt.Printf("\n Took %v, Checked %v URLs, max goroutines %v\n", elapse, len(allUrls), atomic.LoadInt64(&max))

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
