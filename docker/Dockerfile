# nodejs app
FROM node:12 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN node -v
COPY *.js ./

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

# Install lighthouse
# RUN apt-get update --fix-missing && apt-get -y upgrade


# Install latest chrome stable package.
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update
RUN apt-get install -y google-chrome-stable --no-install-recommends

# Install Lighthouse CI
RUN npm install -g @lhci/cli@0.3.13
RUN npm install -g lighthouse
RUN npm install -g cloc
RUN npm install -g htmlhint

# Install cloc

# Setup a user to avoid doing everything as root
RUN groupadd --system lhci && \
  useradd --system --create-home --gid lhci lhci && \
  mkdir --parents /home/lhci/src && \
  mkdir --parents /home/lhci/src/root && \
  chown --recursive lhci:lhci /home/lhci

# give lhci user access to /root/.ScreamingFrogSEOSpider folder

USER lhci

WORKDIR /home/lhci/src
COPY spider.config /home/lhci/.ScreamingFrogSEOSpider/spider.config
COPY licence.txt /home/lhci/.ScreamingFrogSEOSpider/licence.txt
COPY spa.seospiderconfig /home/lhci/spa.seospiderconfig

# RUN ls /home/lhci/.ScreamingFrogSEOSpider

COPY --from=builder /usr/src/app /home/lhci/src
# RUN ls /home/lhci/src/node_modules

ENTRYPOINT ["node","."]
# ENTRYPOINT ["lhci"]
# ENTRYPOINT ["/usr/bin/screamingfrogseospider","--output-folder", "/home/crawls", "--headless", "--bulk-export", "All Inlinks"]
# ENTRYPOINT ["node",".","--url","https://ssw.com.au/people/","--token", "bbf65654-23d5-4d87-8f68-34d68c30d2e4","--buildId","azure","--debug"]
# ENTRYPOINT ["lhci"]