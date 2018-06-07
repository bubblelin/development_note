## 初识Docker

查看当前系统kernel版本
``` shell
$ uname -r
```

在APT安装之前，先更新仓库，并确保HTTPS和CA证书模块已安装到系统中，以便定制Docker安装源
``` shell
$ sudo apt-get update
$ sudp apt-get install apt-transport-https ca-certificates
```

接着通过apt-key录入安装Docker所需的GPG key
``` shell
$ sudo apt-key --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
```

之后将Docker的安装源提供给apt仓库
...

选择符合当前系统的源地址，编写一个源地址文件并写入其中
``` shell
/etc/apt/sources.list.d/docker.list
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

容器连接
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

---

## 制作镜像


---

## SSH服务
