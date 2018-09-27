# Harbor：搭建Docker私有仓库HTTPS认证

### 1、系统环境



### 2、安装Docker



### 3、安装docker-compose



### 4、下载离线包harbor-offline-installer-v1.5.0.tgz



### 5、生成访问harbor时的密钥证书

```shell
# mkdir /opt/harbor/cert /opt/harbor/data

# cd /opt/harbor/cert

生成私钥
# openssl genrsa -out private_key.pem 4096

生成证书
# openssl req -new -x509 -key private_key.pem -out root.crt -days 3650
-----
Country Name (2 letter code) [XX]:CN  (国家)
State or Province Name (full name) []:Beijing  (州或省名称)
Locality Name (eg, city) [Default City]:Beijing  (城市)
Organization Name (eg, company) [Default Company Ltd]:harbor  (机构名称)
Organizational Unit Name (eg, section) []:harbor  (组织单位名称)
Common Name (eg, your name or your server hostname) []:req.yourdomain.com  (访问时用的域名)
Email Address []:yourmail@yourdomain.com  (邮箱)

# cp /opt/harbor/cert/private_key.pem /opt/harbor/common/config/ui/private_key.pem
# cp /opt/harbor/cert/root.crt /opt/harbor/common/config/registry/root.crt
```



### 6、配置https

```shell
# cd /opt/harbor/cert

1)
# openssl req -newkey rsa:4096 -nodes -sha256 -keyout ca.key -x509 -days 365 -out ca.crt
-----
Country Name (2 letter code) [XX]:CN  (国家)
State or Province Name (full name) []:Beijing  (州或省名称)
Locality Name (eg, city) [Default City]:Beijing  (城市)
Organization Name (eg, company) [Default Company Ltd]:harbor  (机构名称)
Organizational Unit Name (eg, section) []:harbor  (组织单位名称)
Common Name (eg, your name or your server hostname) []:req.yourdomain.com  (访问时用的域名)
Email Address []:yourmail@yourdomain.com  (邮箱)

# ll
total 20
-rw-r--r--. 1 root root 2082 May 11 15:30 ca.crt
-rw-r--r--. 1 root root 3272 May 11 15:30 ca.key

2)  
# openssl req -newkey rsa:4096 -nodes -sha256 -keyout req.yourdomain.com.key -out req.yourdomain.com.csr
-----
Country Name (2 letter code) [XX]:CN  (国家)
State or Province Name (full name) []:Beijing  (州或省名称)
Locality Name (eg, city) [Default City]:Beijing  (城市)
Organization Name (eg, company) [Default Company Ltd]:harbor  (机构名称)
Organizational Unit Name (eg, section) []:harbor  (组织单位名称)
Common Name (eg, your name or your server hostname) []:req.yourdomain.com  (访问时用的域名)
Email Address []:yourmail@yourdomain.com  (邮箱)

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:******
An optional company name []:req.yourdomain.com

3)
# openssl x509 -req -days 365 -in req.yourdomain.com.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out req.yourdomain.com.crt

4)
# echo subjectAltName = IP:54.200.9.23 > extfile.cnf

# openssl genrsa -out private_key.pem 4096

# openssl req -new -x509 -key private_key.pem -out root.crt -days 3650
-----
Country Name (2 letter code) [XX]:CN  (国家)
State or Province Name (full name) []:Beijing  (州或省名称)
Locality Name (eg, city) [Default City]:Beijing  (城市)
Organization Name (eg, company) [Default Company Ltd]:harbor  (机构名称)
Organizational Unit Name (eg, section) []:harbor  (组织单位名称)
Common Name (eg, your name or your server's hostname) []:req.yourdomain.com  (访问时用的域名)
Email Address []:yourmail@yourdomain.com  (邮箱)
```



### 7、修改harbor配置文件

```shell
# vim /opt/harbor/harbor.cfg

hostname = req.yourdomain.com

ui_url_protocol = https

ssl_cert = /opt/harbor/cert/req.yourdomain.com.crt

ssl_cert_key = /opt/harbor/cert/req.yourdomain.com.key

secretkey_path = /opt/harbor/data

```



### 8、修改docker-compose.yml

```shell
自己安装的时候手贱，直接修改了harbor.cfg中的secretkey_path参数，导致/data/secretkey一直挂载不上，adminserver容器起不来，如果不修改这个参数，应该也不用修改docker-compose.yml文件

# vim /opt/harbor/docker-compose.yml

services:adminserver:volumes

- /opt/harbor/common/config:/etc/adminserver/config/:z
- /opt/harbor/data/secretkey:/etc/adminserver/key:z
- /opt/harbor/data/:/data/:z
```



### 9、启动安装

```shell
9、启动harbor
# ./prepare
# ./install.sh
```



### 10、验证

```shell
打开浏览器访问：https://yourdomain.com

# [ ! -d /etc/docker/certs.d/reg.yourdomain.com ] && mkdir -p /etc/docker/certs.d/reg.yourdomain.com

# cp /opt/harbor/cert/ca.crt /etc/docker/certs.d/reg.yourdomain.com

# docker login reg.yourdomain.com
Username: admin
Password:   (默认密码为：Harbor12345，可在harbor.cfg文件中修改)
WARNING! Your password will be stored unencrypted in /root/.docker/config.json.
Configure a credential helper to remove this warning. See
https://docs.docker.com/engine/reference/commandline/login/#credentials-store
Login Succeeded
```

