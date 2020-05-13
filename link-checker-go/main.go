package main

import (
	"fmt"
	"io"
	"net/http"
	urlP "net/url"
	"os"
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

func crawl(link Link, ch chan Link, linkch chan LinkStatus, checkOnly bool) {
	fmt.Println("checking...", link.url)
	resp, err := http.Get(link.url)

	defer func() {
		if err != nil {
			linkch <- LinkStatus{link.url, link.srcUrl, "Empty Response", 0}
		} else {
			linkch <- LinkStatus{link.url, link.srcUrl, resp.Status, resp.StatusCode}
		}
	}()

	if err != nil || checkOnly {
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
			if err != io.EOF {
				fmt.Println("Error parsing HTML", err)
			}
			return

		case tt == html.StartTagToken || tt == html.SelfClosingTagToken:
			t := z.Token()

			if t.Data == "a" || t.Data == "img" || t.Data == "link" {
				ok, newUrl := getHref(t)
				if !ok {
					continue
				}

				ch <- Link{newUrl, link.url, t.Data}
			}
		}
	}
}

func parseUrl(startUrl string, url string) string {
	if strings.HasPrefix(url, "/") {
		u, _ := urlP.Parse(startUrl)
		url = "https://" + u.Hostname() + url
	} else if strings.HasPrefix(url, "http") {
	} else {
		url = "https://" + url
	}
	return url
}

func main() {
	allUrls := make(map[string]LinkStatus)
	startUrl := Link{os.Args[1], "", "a"}
	start := time.Now()

	chUrls := make(chan Link)
	chAllUrls := make(chan LinkStatus)

	crawling := 1
	go crawl(startUrl, chUrls, chAllUrls, false)

	for crawling >= 1 {
		select {
		case link := <-chUrls:
			if strings.HasPrefix(link.url, "#") || link.url == "" {
				continue
			}

			link.url = parseUrl(startUrl.url, link.url)
			_, crawled := allUrls[link.url]

			if !crawled {
				allUrls[link.url] = LinkStatus{link.url, link.srcUrl, "", 0}
				crawling++
				if strings.Index(link.url, startUrl.url) == 0 && link.linkType == "a" {
					go crawl(link, chUrls, chAllUrls, false)
				} else {
					go crawl(link, chUrls, chAllUrls, true)
				}
			}

		case status := <-chAllUrls:
			crawling = crawling - 1
			allUrls[status.url] = status
		}
	}

	elapse := time.Since(start)
	fmt.Printf("\n Took %v, Checked %v URLs\n", elapse, len(allUrls))

	fmt.Printf("\n Broken links: \n")
	for _, v := range allUrls {
		if v.statusCode < 200 || v.statusCode > 399 {
			fmt.Printf("\n%v -> %v (%v)", v.srcUrl, v.url, strconv.Itoa(v.statusCode))
		}
	}
	fmt.Println("")

	close(chUrls)
}
