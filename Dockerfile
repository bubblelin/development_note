From ubuntu:16.04

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN echo "Asia/Shanghai" > /etc/timezone

RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

echo "Suceessfully" >> ./README.md