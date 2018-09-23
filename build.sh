#!/bin/sh

set +e

echo '>>> Get old container id'

echo '${BUILD_NUMBER}'
echo %BUILD_NUMBER%

CID=$(docker ps | grep "preview_development_note" | awk '{print $1}')

echo $CID

docker build -t localhost:5000/development_note:%BUILD_NUMBER% .

docker push localhost:5000/development_note:%BUILD_NUMBER%

docker rm -f $(docker ps -a | grep $CID) || true

docker run --name $CID localhost:5000/development_note:%BUILD_NUMBER%

echo '>>> Starting new container: $CID'

exit