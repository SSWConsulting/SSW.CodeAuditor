# check for broken links 
-   build the image
    `docker build -t sswlinkauditor .`
-   tag and push
    `docker tag sswlinkauditor nvhoanganh1909/sswlinkauditor`
    `docker push nvhoanganh1909/sswlinkauditor`
-   Get Usage
    `docker run sswlinkauditor --help`
-   run scan (output in CSV)
    `docker run sswlinkauditor --url https://www.ssw.com.au/people/`
    `docker run sswlinkauditor --url https://sswcovid19alert.firebaseapp.com/`
    `docker run sswlinkauditor --url https://sswcovid19alert.firebaseapp.com/ --token bbf65654-23d5-4d87-8f68-34d68c30d2e4`
    `docker run sswlinkauditor --url https://sswcovid19alert.firebaseapp.com/ --token bbf65654-23d5-4d87-8f68-34d68c30d2e4 --buildId 3333`
    `node . --url https://sswcovid19alert.firebaseapp.com/ --token bbf65654-23d5-4d87-8f68-34d68c30d2e4 --buildId 3333`
    `docker run sswlinkauditor --url https://azuregems.io/ --token bbf65654-23d5-4d87-8f68-34d68c30d2e4 --buildId 3333`
    `docker run sswlinkauditor --url https://www.ssw.com.au/people/ --token bbf65654-23d5-4d87-8f68-34d68c30d2e4 --buildId 99`
-   run scan in debug mode
    `docker run sswlinkauditor --url https://www.ssw.com.au/people/ --debug`
-   run scan (output in JSON)
    `docker run sswlinkauditor --url https://www.ssw.com.au/people/ --format json`
-   run scan in debug mode
    `docker run sswlinkauditor --url https://www.ssw.com.au/people/ --debug`
