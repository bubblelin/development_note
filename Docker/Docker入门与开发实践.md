## 初识Docker

查看当前系统kernel版本

``` shell
$ uname -r
```

### Ubuntu安装docker

在APT安装之前，更新国内Ubuntu源，先更新仓库，并确保HTTPS和CA证书模块已安装到系统中，以便定制Docker安装源

``` shell
$ /etc/apt/sources.list.d/docker.list
$ deb http://mirrors.163.com/ubuntu/ trusty main
$ sudo apt-get update
$ sudp apt-get install apt-transport-https ca-certificates
```

接着通过apt-key录入安装Docker所需的GPG key

``` shell
$ sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
```

之后将Docker的安装源提供给apt仓库
...

选择符合当前系统的源地址，编写一个源地址文件并写入其中

``` shell
/etc/apt/sources.list.d/docker.list
deb http://mirrors.163.com/ubuntu/ trusty main
```

添加安装源后，，，再次进行apt仓库更新，卸载旧版docker

``` shell
$ sudo apt-get update
$ sudo apt-get purge lxc-docker
$ apt-cache policy docker-engine
```

安装docker

``` shell
$ sudo apt-get install docker-engine

$ sudo service docker stat
```

---



### Centos安装docker

更新包管理工具yum

```shell
# yum update
```

添加仓库

```shell
# vim /etc/yum.repos.d/ghostcloud.repo
name=Docker Repository
baseurl=https://yum.dockerproject.org/repo/main/centos/$releasever/
enabled=1
gpgcheck=1
gpgkey=https://yum.dockerproject.org/gpg
```



正式安装

```shell
# yum install docker-engine=

# service docker start

# systemctl enable docker
```



## 镜像与仓库

> 镜像名称主要分为三部分Namespace、Repository、Tag

获取镜像的详细信息

``` shell
$ sudo docker inspect mysql:latest
$ sudo docker inspect -f {{".Size"}} mysql:latest
```

镜像的迁移，`docker save`命令是把镜像写到输出流中，可通过 `-o`或`--output`参数将导出的镜像数据写入到指定的文件

``` shell
$ sudo docker save -o mysql.tar mysql:latest
$ sudo docker save mysql:latest >mysql.tar
$ sudo docker save -o images.tar mysql:latest mongo:latest
```

镜像的导入， `docker load`命令从输入流中读取镜像，可通过 `-i`或`--input`参数将指定的文件传入镜像

``` shell
$ sudo docker load -i mysql.tar
$ sudo docker load <mysql.tar
```

镜像仓库登录

``` shell
$ sudo docker login -u <username> -p <password> <server>
```

部署私有仓库

``` shell
$ sudo docker run -d --name private-registry -hostname localhost \
  -v /opt/docker/distribution:/var/lib/registry/docker/registry-v2 \
  -p 5000:5000 registry:2.0
```

推送镜像
``` shell
$ sudo docker push localhost:5000/youmingdot/redis:latest
```

使用Nginx反向代理，开启HTTPS安全协议
1.  首先通过openssl工具生成一份密钥和证书

``` shell
$ openssl genrsa -out https.key 4096
$ openssl req -newkey rsa:4096 -nodes -keyout https.key -x509 -days 3650 \
  -out https.crt -subj "/C=CN/ST=zj/L=hz/O=ymd/OU=localhost"
```

2. 在Nginx的主机配置中加入HTTPS配置

``` shell
server {
  ssl on;
  ssl_certificate ~/https.crt;
  ssl_certificate_key ~/https.key;
  ...
}
```

1. 然后在配置中加入反向代理的配置

``` shell
server {
  ...
  location / {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-By $server_addr:$server_port;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxt_pas: http://registry:5000;
  }
}
```

---

## 管理和使用容器

运行并进入交互模式，`-t`或`--tty`参数为容器分配伪终端，`-i``--interactive`则打开交互模式

``` shell
$ sudo docker run -i -t mysql:latest /bin/bash
```

---

## 数据卷与网络

#### 容器连接

设置容器间通信，通过创建容器时使用`--link` 参数实现，只需要指定被连接的容器，而不需要指明被连接的容器端口（不需要指明`-p`或`-P`参数），如此保证被连接容器端口只在容器间，而不被外部访问

``` shell
$ sudo docker run -d --name mysql mysql
$ sudo docker run -d -p 80:80 -p 443:443 --name web --link mysql nginx
```

此时可以在`--env`参数设置自定义环境变量，亦可以在容器中使用该命令查看到与容器连接的环境变量信息，除此之外，可以通过查看nginx容器的/etc/hosts文件能看到

``` shell
$ cat /etc/hosts
127.0.0.1 localhost
172.17.0.2 db 56465451212 mysql
...

```

#### 文件卷标加载

>通过参数 -v 把主机的文件映射到Container中,--rm=true表示这个容器运行结束后自动删除

``` shell
#把本机的/etc目录挂载到Container里的/opt/etc下面，并且打印Container的/opt/etc目录
$ docker run --rm=true -i -t --name=ls-volume -v /etc/:/opt/etc/ centos ls /opt/etc
#挂载后的文件是只读的
$ docker run -i -t --name=ls-volume -v /etc/:/opt/etc/:ro centos
```

>挂载已经存在Container中的文件系统，使用 --volumes-from 参数

``` shell
# 先创建一个Container，它共享/etc目录给其他Container
$ docker run -i -t --name=etc_share -v /etc/ centos mkdir /etc/my_share 
  && /bin/sh -C "while true; do echo hello world; sleep 1; done"
# 然后启动一个ls_etc的Container来挂载并打印etc_share共享的目录
$ docker run --rm=true -i -t --volumes-from etc_share --name=ls_etc centos ls /etc
```

---

## 制作镜像

---

## SSH服务

---

##  网络进阶

#### 网络模型

Docker 的网络部分，CNM（Container Network Model），容器网络模型
1. Sandbox  ：网络沙盒，容器中隔离网络配置的虚拟环境，每个网络都拥有独立的网络配置。
2. Endpoint ：端点， 进行网络数据传递的通道入口，依附于网络沙盒之上，实现网络沙盒与外界连接。
3. Network  ：网络，由一组端点组成，在同一网络中的端点之间可以相互通信，而不同网络之间完全隔离。 

通过 `docker network ls` 获得当前Docker中所有网络：bridge 、 host、 none 三者都是Docker的默认实现。
1. bridge网络是Docker容器中默认使用的网络。在宿主机的网络中，对应着：docker0
如果想要改变容器使用的网络，则使用 --network参数修改

``` shell
$ sudo docker run -it --name nonenetwork --network none ubuntu /bin/bash
$ sudo docker network inspect bridge #查看容器网络详细信息
```

2. --network none网络表示不使用网络，通过一个无连接的网络让容器与外界网络环境完全隔离。

3. host网络直接使用宿主机的网络环境，其他与宿主机同在一个子网的机器也能发现容器的存在。

#### 自定义网络

如果没有为容器选定网络，则Docker会将新创建的容器连接到bridge默认网络上。

然而，对于一个由数个容器所组成的一个小模块，须要做到为这几个容器单独分配网络，以隔绝其他网络的连接

``` shell
$ sudo docker network create --driver bridge isolated
```

--driver 或 -d 参数用来指定网络所基于的网络驱动，可以通过docker network ls 列出创建的网络


#### 容器与外部通信

容器数据 -> 容器网络 -> docker0网络 或 其他宿主机上虚拟网卡 -> 转发 -> 其他的宿主机网卡 -> 网络访问

使容器与外部正常通信，保证 IP forward 功能正常启用。
当Docker daemon 启动时，可以通过--ip-forward 参数控制Docker是否使用 IP forward, 默认配置是开启使用。
如果此时仍然无法连接外部网络，则检查宿主机系统中的 IP forward是否禁用

``` shell
$ sudo sysctl net.ipv4.conf.all.forwarding
net.ipv4.conf.all.forwarding=0

$ sudo sysctl net.ipv4.conf.all.forwarding=1
```

0表示禁用状态


实现外部与容器通信的端口映射方案，是基于Iptables（DNAT， 目标地址转换）这个防火墙的，
当启动容器时，传递的-P或-p参数使容器内的端口映射到宿主机上时，Docker会在Iptables中增加一条通过容器网络连接到容器上的DNAT，在Iptables的规则中：

``` shell
$ sudo iptables -t nat -L -n

tatget  prop opt source  destination
...     ...              ...
```

宿主机系统可以被分配的端口会出现在 “/proc/sys/net/ipv4/ip_local_port_range”这个文件中，Docker正式从中找出端口进行映射。查看该文件

``` shell
$ sudo more /proc/sys/net/ipv4/ip_local_port_range
范围在32768～67000
```

---


docker run 
-d 
--name "nodeCountAccess" 
-p 8000:8000 
-v /var/node/docker_node:/var/node/docker_node 
-v /var/log/pm2:/root/.pm2/logs/ 
--link redis-server:redis 
-w /var/node/docker_node/ 
bubblelin/node_pm2 
pm2 start app.js