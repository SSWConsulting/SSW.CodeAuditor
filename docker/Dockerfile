# nodejs app
FROM node:12 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN node -v
COPY index.js ./

# base image for screaming frog
FROM softonic/screamingfrog:12.6

# install node
RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_12.x  | bash -
RUN apt-get -y install nodejs
RUN node -v

COPY spider.config /root/.ScreamingFrogSEOSpider/spider.config
COPY spa.seospiderconfig /usr/bin/spa.seospiderconfig
COPY licence.txt /root/.ScreamingFrogSEOSpider/licence.txt

RUN mkdir /home/crawls
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .

ENTRYPOINT ["node","."]
# ENTRYPOINT ["/usr/bin/screamingfrogseospider","--output-folder", "/home/crawls", "--headless", "--bulk-export", "All Inlinks"]
# ENTRYPOINT ["node",".","--url","https://ssw.com.au/people/","--token", "bbf65654-23d5-4d87-8f68-34d68c30d2e4","--buildId","azure","--debug"]