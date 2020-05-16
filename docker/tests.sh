#build the image
docker build -t sswconsulting/sswauditor .
docker build -f DockerfileLighthouse -t sswconsulting/sswauditor:lhci .
#tag and push
docker push sswconsulting/sswauditor
docker push sswconsulting/sswauditor:lhci
#Get Usage
docker run sswconsulting/sswauditor --help
#run scan (output in CSV)
docker run sswconsulting/sswauditor --url https://www.ssw.com.au/people/
docker run -v "C:/AnthonyNguyenData/source/people.ssw.com.au/src:/home/lhci/src/root" sswconsulting/sswauditor --url https://www.ssw.com.au/people/ --cloc
docker run sswconsulting/sswauditor --url https://www.ssw.com.au/people/
docker run sswconsulting/sswauditor --url https://sswcovid19alert.firebaseapp.com/
docker run sswconsulting/sswauditor --url https://sswcovid19alert.firebaseapp.com/
docker run sswconsulting/sswauditor --url https://sswpeoplestaging.firebaseapp.com/people/ --htmlhint
docker run sswconsulting/sswauditor --url https://sswcovid19alert.firebaseapp.com/ --buildId 3333
node . --url https://sswcovid19alert.firebaseapp.com/ --buildId 3333
docker run sswconsulting/sswauditor --url https://azuregems.io/ --buildId 3333
docker run sswconsulting/sswauditor --url https://www.ssw.com.au/people/ --buildId 8833
docker run sswconsulting/sswauditor --url https://azuregems.io/
docker run sswconsulting/sswauditor --url https://sswpeoplestaging.firebaseapp.com/people/ --htmlhint false --debug
docker run sswconsulting/sswauditor --url https://azuregems.io/ --htmlhint --debug
docker run sswconsulting/sswauditor --url https://azuregems.io/ --debug
docker container run --rm --cap-add=SYS_ADMIN sswconsulting/sswauditor --url https://azuregems.io/ --lighthouse --debug
docker container run --rm --cap-add=SYS_ADMIN sswconsulting/sswauditor:lhci --url https://azuregems.io/ --lighthouse --debug
