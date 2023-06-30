############################
# STEP 1 build executable binary
############################
FROM golang:1.14.15-alpine3.12 AS builder
# Install git.
# Git is required for fetching the dependencies.
RUN apk update && apk add --no-cache git
WORKDIR $GOPATH/src/mypackage/myapp/
COPY *.go .
# Fetch dependencies.
# Using go get.
RUN go get -d -v
# Build the binary.
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /go/bin/sswlinkauditor

############################
# Build the nodejs app
############################
FROM node:16-bullseye AS nodeBuilder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN node -v
COPY *.js ./

FROM node:16-bullseye-slim

# Set variable so puppeteer will not try to download chromium
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Install utilities
RUN apt-get update --fix-missing && apt-get -y upgrade && apt-get install -y git wget gnupg && apt-get clean

# Install Chromium for lighthouse
RUN apt-get update \
    && apt-get install -y chromium --no-install-recommends \
    && apt-get clean

# Install Lighthouse CI
RUN npm install -g @lhci/cli@0.12.0
RUN npm install -g lighthouse

# Install puppeteer
RUN npm install -g puppeteer

# Setup a user to avoid doing everything as root
RUN groupadd --system lhci && \
  useradd --system --create-home --gid lhci lhci && \
  mkdir --parents /home/lhci/reports && \
  chown --recursive lhci:lhci /home/lhci

RUN cd /home/lhci/reports && npm link puppeteer
USER lhci

WORKDIR /home/lhci/app

# copy tools
COPY --from=builder /go/bin/sswlinkauditor /home/lhci/app/sswlinkauditor

# main nodejs app
COPY --from=nodeBuilder /usr/src/app /home/lhci/app

CMD [ "lhci", "--help" ]

ENTRYPOINT ["node","."]
