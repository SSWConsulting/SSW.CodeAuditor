#build the image
docker build -t sswconsulting/codeauditor .
docker build -f DockerfileLight -t sswconsulting/codeauditor:light .
#tag and push
docker push sswconsulting/codeauditor
docker push sswconsulting/codeauditor:light
#Get Usage
docker run sswconsulting/codeauditor --help
#run scan (output in CSV)
docker run sswconsulting/codeauditor --url https://www.ssw.com.au/people/
docker run -v "C:/AnthonyNguyenData/source/people.ssw.com.au/src:/home/lhci/app/src" sswconsulting/codeauditor --url https://www.ssw.com.au/people/
docker run -v "C:\AnthonyNguyenData\source\personal\url-checker\sswcodeauditor:/home/lhci/app/src" sswconsulting/codeauditor --url https://azuregems.io/
docker run -v "C:\AnthonyNguyenData\source\personal\url-checker\sswcodeauditor:/home/lhci/app/src" sswconsulting/codeauditor --url https://azuregems.io/ --token bbf65654-23d5-4d87-8f68-34d68c30d2e4
docker run -v "C:\AnthonyNguyenData\source\people.ssw.com.au:/home/lhci/app/src" sswconsulting/codeauditor --url https://azuregems.io/ --token bbf65654-23d5-4d87-8f68-34d68c30d2e4
docker run -v "C:\AnthonyNguyenData\source\people.ssw.com.au:/home/lhci/app/src" sswconsulting/codeauditor --url http://staging.sugarlearning.com/ 

## sugarlearning
docker run sswconsulting/codeauditor --url http://staging.sugarlearning.com/ --token bbf65654-23d5-4d87-8f68-34d68c30d2e4
docker container run --rm --cap-add=SYS_ADMIN sswconsulting/codeauditor --url http://staging.sugarlearning.com/ --lighthouse --token bbf65654-23d5-4d87-8f68-34d68c30d2e4
docker container run -v "C:\AnthonyNguyenData\source\ssw\SSW.Induction:/home/lhci/app/src" --rm --cap-add=SYS_ADMIN sswconsulting/codeauditor --url http://staging.sugarlearning.com/ --lighthouse --token bbf65654-23d5-4d87-8f68-34d68c30d2e4 --ignorefile .gitignore_ca



docker run -v sswconsulting/codeauditor --url http://staging.sugarlearning.com/ 
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
docker container run --rm --cap-add=SYS_ADMIN -v "C:\AnthonyNguyenData\source\people.ssw.com.au\src:/home/lhci/app/src" sswconsulting/codeauditor:lhci --url https://azuregems.io/ --lighthouse --token bbf65654-23d5-4d87-8f68-34d68c30d2e4