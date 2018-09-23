#!/bin/sh

set +e

CNAME="test_development_note"

docker build -t localhost:5000/development_note:v${BUILD_NUMBER} .

docker push localhost:5000/development_note:v${BUILD_NUMBER}

docker rm -f $(docker ps -a | grep $CNAME) || true

docker run --name $CNAME localhost:5000/development_note:v${BUILD_NUMBER}

echo '>>> Starting new container: $CNAME'

exit