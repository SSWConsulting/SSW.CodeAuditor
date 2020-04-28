# check for broken links

-   build the image
    `docker build -t sswconsulting/sswlinkauditor .`
-   tag and push
    `docker push sswconsulting/sswlinkauditor`
-   Get Usage
    `docker run sswlinkauditor --help`
-   run scan (output in CSV)
    `docker run sswlinkauditor --url https://www.ssw.com.au/people/`
    `docker run sswlinkauditor --url https://www.ssw.com.au/people/`
    `docker run sswlinkauditor --url https://sswcovid19alert.firebaseapp.com/`
    `docker run sswlinkauditor --url https://sswcovid19alert.firebaseapp.com/ --token bbf65654-23d5-4d87-8f68-34d68c30d2e4`
    `docker run sswlinkauditor --url https://sswcovid19alert.firebaseapp.com/ --token bbf65654-23d5-4d87-8f68-34d68c30d2e4 --buildId 3333`
    `node . --url https://sswcovid19alert.firebaseapp.com/ --token bbf65654-23d5-4d87-8f68-34d68c30d2e4 --buildId 3333`
    `docker run sswlinkauditor --url https://azuregems.io/ --token bbf65654-23d5-4d87-8f68-34d68c30d2e4 --buildId 3333`
    `docker run sswlinkauditor --url https://www.ssw.com.au/people/ --token bbf65654-23d5-4d87-8f68-34d68c30d2e4 --buildId 8833`
    `docker run sswlinkauditor --url https://azuregems.io/`
-   run scan in debug mode
    `docker run sswlinkauditor --url https://www.ssw.com.au/people/ --debug`
-   run scan (output in JSON)
    `docker run sswlinkauditor --url https://www.ssw.com.au/people/ --format json`
-   run scan in debug mode
    `docker run sswlinkauditor --url https://www.ssw.com.au/people/ --debug`

docker container run --cap-add=SYS_ADMIN -v "C:/output:/home/lhci/reports/.lighthouseci" lighthousedocker lhci collect --url="https://google.com" -n 1
docker run --cap-add=SYS_ADMIN -v "C:/output:/home/lhci/reports/.lighthouseci" lighthousedocker lhci collect --url="https://google.com" -n 1
docker run --cap-add=SYS_ADMIN -v lighthousedocker lhci collect --url="https://google.com" -n 1
docker run --cap-add=SYS_ADMIN lighthousedocker lhci collect --url="https://google.com" -n 1


docker container run --cap-add=SYS_ADMIN lighthousedocker lhci collect --url="https://google.com" -n 1
lhci upload --token 85cad775-0528-4116-b2bb-f9510f55a9e3 --serverBaseUrl http://localhost:9000

docker build -t lighthousedocker .
docker container run -it --rm lighthousedocker "/\bin\bash"
docker container run -it --rm sswlinkauditor "/\bin\bash"

docker container run --cap-add=SYS_ADMIN lighthousedocker lhci collect --url="https://google.com" -n 1

docker container run --cap-add=SYS_ADMIN sswlinkauditor lhci collect --url="https://google.com" -n 1
docker container run --cap-add=SYS_ADMIN sswlinkauditor lhci collect --url "https://google.com" -n 1
docker container run --cap-add=SYS_ADMIN sswlinkauditor collect --url "https://google.com" -n 1
docker container run --cap-add=SYS_ADMIN sswlinkauditor --entrypoint "lhci" --help
lhci upload --token 85cad775-0528-4116-b2bb-f9510f55a9e3 --serverBaseUrl http://localhost:9000
n
docker container run --rm --cap-add=SYS_ADMIN sswlinkauditor --url "https://www.ssw.com.au/people/" --lighthouse -n 1 --debug
docker container run --rm --cap-add=SYS_ADMIN sswlinkauditor --url "https://sswcovid19alert.firebaseapp.com/" --lighthouse --debug

# run with lighthouse , no token

docker container run --rm --cap-add=SYS_ADMIN sswlinkauditor --url "https://azuregems.io" --lighthouse

# run with lighthouse , with token

docker container run --rm --cap-add=SYS_ADMIN sswlinkauditor --url "https://azuregems.io" --lighthouse --token bbf65654-23d5-4d87-8f68-34d68c30d2e4

# no lighthouse, no token

docker container run --rm sswlinkauditor --url "https://azuregems.io"
docker run --rm sswlinkauditor --url "https://azuregems.io"

# no lighthouse, with token

docker container run --rm sswlinkauditor --url "https://azuregems.io" --token bbf65654-23d5-4d87-8f68-34d68c30d2e4

docker container run --cap-add=SYS_ADMIN -v "C:\output:/home/lhci/src/.lighthouseci" lighthousedocker lhci upload --token 85cad775-0528-4116-b2bb-f9510f55a9e3 --serverBaseUrl http://localhost:8081

docker container run --cap-add=SYS_ADMIN \
 -v "\C:\output:/home/lhci/reports/.lighthouseci" \
 patrickhulce/lhci-client \
 lhci collect --url="https://example.com"
lhci upload --token 85cad775-0528-4116-b2bb-f9510f55a9e3 --serverBaseUrl http://localhost:9000
n
