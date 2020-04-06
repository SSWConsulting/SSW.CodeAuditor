# check for broken links 
-   build the image
    `docker build -t sswlinkauditor .`
-   Get Usage
    `docker run sswlinkauditor --help`
-   run scan (output in CSV)
    `docker run sswlinkauditor --url https://www.ssw.com.au/people/`
-   run scan in debug mode
    `docker run sswlinkauditor --url https://www.ssw.com.au/people/ --debug`
-   run scan (output in JSON)
    `docker run sswlinkauditor --url https://www.ssw.com.au/people/ --format json`
-   run scan in debug mode
    `docker run sswlinkauditor --url https://www.ssw.com.au/people/ --debug`
