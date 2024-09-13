############################
# STEP 1 build executable binary
############################
FROM golang:1.21.3-alpine AS builder
# Install git.
# Git is required for fetching the dependencies.
RUN apk update && apk add --no-cache git
WORKDIR $GOPATH/src/mypackage/myapp/
COPY *.go *.mod *.sum ./
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

# Install utilities
RUN apt-get update --fix-missing && apt-get -y upgrade && apt-get install -y git wget gnupg && apt-get clean

WORKDIR /home/lhci/app

# copy tools
COPY --from=builder /go/bin/sswlinkauditor /home/lhci/app/sswlinkauditor

# Install k6
RUN apt-get update && apt-get install -y wget gnupg
RUN wget -q https://dl.k6.io/key.gpg -O- | apt-key add -
RUN echo "deb https://dl.k6.io/deb stable main" | tee -a /etc/apt/sources.list
RUN apt-get update && apt-get install -y k6

# copy k6 scripts
COPY k6-scripts /home/lhci/app/k6-scripts

# main nodejs app
COPY --from=nodeBuilder /usr/src/app /home/lhci/app

ENTRYPOINT ["node","."]