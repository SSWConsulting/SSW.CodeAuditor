#build the image
docker build -t sswconsulting/codeauditor .
docker build -f DockerfileLighthouse -t sswconsulting/codeauditor:lhci .
#tag and push
docker push sswconsulting/codeauditor
docker push sswconsulting/codeauditor:lhci
#Get Usage
docker run sswconsulting/codeauditor --help
#run scan (output in CSV)
docker run sswconsulting/codeauditor --url https://www.ssw.com.au/people/
docker run -v "C:/AnthonyNguyenData/source/people.ssw.com.au/src:/home/lhci/src/root" sswconsulting/codeauditor --url https://www.ssw.com.au/people/ --cloc
docker run sswconsulting/codeauditor --url https://www.ssw.com.au/people/
docker run sswconsulting/codeauditor --url https://sswcovid19alert.firebaseapp.com/
docker run sswconsulting/codeauditor --url https://sswcovid19alert.firebaseapp.com/
docker run sswconsulting/codeauditor --url https://sswpeoplestaging.firebaseapp.com/people/ --htmlhint
docker run sswconsulting/codeauditor --url https://sswcovid19alert.firebaseapp.com/ --buildId 3333
node . --url https://sswcovid19alert.firebaseapp.com/ --buildId 3333
docker run sswconsulting/codeauditor --url https://azuregems.io/ --buildId 3333
docker run sswconsulting/codeauditor --url https://www.ssw.com.au/people/ --buildId 8833
docker run sswconsulting/codeauditor --url https://azuregems.io/
docker run sswconsulting/codeauditor --url https://sswpeoplestaging.firebaseapp.com/people/ --htmlhint false --debug
docker run sswconsulting/codeauditor --url https://azuregems.io/ --htmlhint --debug
docker run sswconsulting/codeauditor --url https://azuregems.io/ --debug
docker container run --rm --cap-add=SYS_ADMIN sswconsulting/codeauditor --url https://azuregems.io/ --lighthouse --debug
docker container run --rm --cap-add=SYS_ADMIN sswconsulting/codeauditor:lhci --url https://azuregems.io/ --lighthouse --debug
