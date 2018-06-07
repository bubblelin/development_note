### 设置固定ip
步骤1: 创建自定义网络，并且指定网段：172.18.0.0/16
➜  ~ docker network create --subnet=172.18.0.0/16 mynetwork
➜  ~ docker network ls
NETWORK ID          NAME                DRIVER              SCOPE
9781b1f585ae        bridge              bridge              local
1252da701e55        host                host                local
4f11ae9c85de        mynetwork           bridge              local

步骤2: 创建Docker容器
➜  ~ docker run -itd --name networkTest1 --network mynetwork --ip 172.18.0.2 centos:latest /bin/bash
