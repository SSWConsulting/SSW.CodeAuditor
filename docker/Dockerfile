############################
# STEP 1 build executable binary
############################
FROM golang:alpine AS builder
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
FROM node:12 AS nodeBuilder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN node -v
COPY *.js ./

############################
# Build smallest image from node
############################
# FROM astefanutti/scratch-node
FROM node:12-alpine

# install perl for cloc
RUN apk update && apk add perl
RUN mkdir usr/app
RUN mkdir usr/app/src

WORKDIR /usr/app

# USER la
# copy tools
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /go/bin/sswlinkauditor /usr/app/sswlinkauditor

# main nodejs app
COPY --from=nodeBuilder /usr/src/app /usr/app


# ENTRYPOINT ["./sswlinkauditor"]
# ENTRYPOINT ["./node_modules/.bin/lhci"]
# ENTRYPOINT ["./node_modules/.bin/cloc"]
ENTRYPOINT ["node","."]