From ubuntu:16.04

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app
