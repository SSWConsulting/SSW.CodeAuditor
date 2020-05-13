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

func check(link Link, linkch chan LinkStatus) {
	fmt.Println("checking...", link.url)

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

func crawl(link Link, ch chan Link, linkch chan LinkStatus) {
	fmt.Println("crawling...", link.url)
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
	if !strings.HasPrefix(url, "http") {
		// strip out the filename (e.g. .aspx  or .asp or .php)
		r := regexp.MustCompile(`(?P<file>[^\/]*.[a-z]{2,})$`)
		if len(r.FindStringSubmatch(startUrl)) > 0 {
			fileName := r.FindStringSubmatch(startUrl)[0]
			startUrl = strings.ReplaceAll(startUrl, fileName, "")
		}
		u, _ := urlP.Parse(startUrl)
		u.Path = path.Join(u.Path, url)
		url = u.String()
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
	go crawl(startUrl, chUrls, chAllUrls)

	for crawling >= 1 {
		select {
		case link := <-chUrls:
			if strings.HasPrefix(link.url, "skype:") || strings.HasPrefix(link.url, "javascript:") || strings.HasPrefix(link.url, "#") || link.url == "" {
				continue
			}

			link.url = parseUrl(link.srcUrl, link.url)
			_, crawled := allUrls[link.url]

			if !crawled {
				allUrls[link.url] = LinkStatus{link.url, link.srcUrl, "", 0}
				crawling++
				if strings.Index(link.url, startUrl.url) >= 0 && link.linkType == "a" {
					go crawl(link, chUrls, chAllUrls)
				} else {
					go check(link, chAllUrls)
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
