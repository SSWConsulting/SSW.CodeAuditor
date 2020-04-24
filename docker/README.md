# check for broken links 
-   build the image
    `docker build -t sswlinkauditor .`
-   Get Usage
    `docker run sswlinkauditor --help`
-   run scan (output in CSV)
    `docker run sswlinkauditor --url https://www.ssw.com.au/people/`
    `docker run sswlinkauditor --url https://sswcovid19alert.firebaseapp.com/`
    `docker run sswlinkauditor --url https://sswcovid19alert.firebaseapp.com/ --token bbf65654-23d5-4d87-8f68-34d68c30d2e4`
-   run scan in debug mode
    `docker run sswlinkauditor --url https://www.ssw.com.au/people/ --debug`
-   run scan (output in JSON)
    `docker run sswlinkauditor --url https://www.ssw.com.au/people/ --format json`
k-   run scan in debug mode
    `docker run sswlinkauditor --url https://www.ssw.com.au/people/ --debug`
