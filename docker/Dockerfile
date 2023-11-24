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
COPY constants ./constants

FROM node:16-bullseye-slim

# Install utilities
RUN apt-get update --fix-missing && apt-get -y upgrade && apt-get install -y git wget gnupg && apt-get clean

WORKDIR /home/lhci/app

# copy tools
COPY --from=builder /go/bin/sswlinkauditor /home/lhci/app/sswlinkauditor

# main nodejs app
COPY --from=nodeBuilder /usr/src/app /home/lhci/app

ENTRYPOINT ["node","."]