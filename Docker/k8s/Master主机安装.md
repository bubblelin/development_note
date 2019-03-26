# Master 安装配置


### ETCD安装

##### 拷贝etcd和etcdctl二进制文件到/usr/bin目录：

```shell
$ cp etcd etcdctl /usr/bin/
```

###### 添加etcd.service启动文件

```shell
$ sudo vim /usr/lib/systemd/system/etcd.service

[Unit]
Description=etcd.service
 
[Service]
Type=notify
TimeoutStartSec=0
Restart=always
WorkingDirectory=/var/lib/etcd
EnvironmentFile=-/etc/etcd/etcd.conf
ExecStart=/usr/bin/etcd
 
[Install]
WantedBy=multi-user.target
```

###### 创建etcd.conf配置文件

```shell
$ sudo vim /etc/etcd/etcd.conf
ETCD_NAME=ETCD Server
ETCD_DATA_DIR="/var/lib/etcd/"
ETCD_LISTEN_CLIENT_URLS=http://0.0.0.0:2379
ETCD_ADVERTISE_CLIENT_URLS="http://192.168.0.160:2379"
```

###### 启动etcd，输入etcdctl命令查看状态

```shell
$ sudo systemctl daemon-reload
$ sudo systemctl start etcd.service

$ etcdctl cluster-health
member 8e9e05c52164694d is healthy: got healthy result from http://192.168.0.101:2379
cluster is healthy
```


### kube安装

###### 拷贝 kube-apiserver  kube-controller-manager  kube-scheduler文件到 /usr/bin

``` shell
$ sudo cp kube-apiserver kube-controller kube-scheduler /usr/bin/
```

###### 添加kube-apiserver.service启动文件
``` shell
$ sudo vim /usr/lib/systemd/system/kube-apiserver.service
[Unit]
Description=Kubernetes API Server
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=etcd.service
Wants=etcd.service
 
[Service]
EnvironmentFile=/etc/kubernetes/apiserver
ExecStart=/usr/bin/kube-apiserver  \
        $KUBE_ETCD_SERVERS \
        $KUBE_API_ADDRESS \
        $KUBE_API_PORT \
        $KUBE_SERVICE_ADDRESSES \
        $KUBE_ADMISSION_CONTROL \
        $KUBE_API_LOG \
        $KUBE_API_ARGS
Restart=on-failure
Type=notify
LimitNOFILE=65536
 
[Install]
WantedBy=multi-user.target
```

###### 创建apiserver配置文件

``` shell
$ sudo mkdir /etc/kubernetes
$ sudo vim /etc/kubernetes/apiserver
KUBE_API_ADDRESS="--insecure-bind-address=0.0.0.0"
KUBE_API_PORT="--port=8080"
KUBELET_PORT="--kubelet-port=10250"
KUBE_ETCD_SERVERS="--etcd-servers=http://192.168.1.160:2379"
KUBE_SERVICE_ADDRESSES="--service-cluster-ip-range=10.0.0.0/24"
KUBE_ADMISSION_CONTROL="--admission-control=NamespaceLifecycle,NamespaceExists,LimitRanger,SecurityContextDeny,ResourceQuota"
KUBE_API_ARGS=""
```

###### 启动kube-apiserver, 查看状态
``` shell
$ sudo systemctl daemon-reload
$ sudo systemctl start kube-apiserver.service

$ sudo netstat -tnlp | grep kube
tcp6       0      0 :::6443                 :::*                    LISTEN      10144/kube-apiserve 
tcp6       0      0 :::8080                 :::*                    LISTEN      10144/kube-apiserve 
```

###### 添加kube-controller-manager.service启动文件
``` shell
$ sudo vim /usr/lib/systemd/system/kube-controller-manager.service
[Unit]
Description=Kubernetes Controller Manager
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=kube-apiserver.service
Requires=kube-apiserver.service
 
[Service]
EnvironmentFile=-/etc/kubernetes/controller-manager
ExecStart=/usr/bin/kube-controller-manager \
        $KUBE_MASTER \
        $KUBE_CONTROLLER_MANAGER_ARGS
Restart=on-failure
LimitNOFILE=65536
 
[Install]
WantedBy=multi-user.target
```

###### 创建controller-manager配置文件
``` shell
$ sudo vim /etc/kubernetes/controller-manager
KUBE_MASTER="--master=http://192.168.1.160:8080"
KUBE_CONTROLLER_MANAGER_ARGS=" "
```

###### 启动kube-controller-manager， 查看状态

``` shell
$ sudo systemctl daemon-reload
$ sudo systemctl start kube-controller-manager.service

$ sudo netstat -lntp | grep kube-controll
tcp6       0      0 :::10252                :::*                    LISTEN      10163/kube-controlle 
```

###### 添加kube-scheduler.service启动文件

``` shell
$ sudo vim /usr/lib/systemd/system/kube-scheduler.service
[Unit]
Description=Kubernetes Scheduler
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=kube-apiserver.service
Requires=kube-apiserver.service

[Service]
User=root
EnvironmentFile=/etc/kubernetes/scheduler
ExecStart=/usr/bin/kube-scheduler \
        $KUBE_MASTER \
        $KUBE_SCHEDULER_ARGS
Restart=on-failure
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
```

###### 创建scheduler 配置文件

``` shell
$ sudo vim /etc/kubernetes/scheduler
KUBE_MASTER="--master=http://192.168.1.160:8080"
KUBE_SCHEDULER_ARGS="--logtostderr=true --log-dir=/home/log/kubernetes --v=2"
```

###### 启动kube-scheduler, 查看状态

``` shell
$ sudo systemctl daemon-reload
$ sudo systemctl start kube-scheduler.service

$ sudo netstat -lntp | grep kube-schedule
tcp6       0      0 :::10251                :::*                    LISTEN      10179/kube-scheduler 
```


### 配置profile

``` shell
$ sudo sed -i '$a export PATH=$PATH:/root/kubernetes/server/bin/' /etc/profile
$ source /etc/profile
```


### 安装 kubectl ， 查看状态

``` shell
$ sudo cp /root/kubernetes/server/bin/kubectl /usr/bin/

$ kubectl get cs
NAME                 STATUS    MESSAGE             ERROR
etcd-0               Healthy   {"health":"true"}   
controller-manager   Healthy   ok                  
scheduler            Healthy   ok 
```


``` shell
for node_ip in ${NODE_IPS[@]}
  do
    echo ">>> ${node_ip}"
    ssh ${node_ip} "ping -c 1 172.30.102.0"
    ssh ${node_ip} "ping -c 1 172.30.31.0"
    ssh ${node_ip} "ping -c 1 172.30.23.0"
  done
```

``` shell
cat > haproxy.cfg <<EOF
global
    log /dev/log    local0
    log /dev/log    local1 notice
    chroot /var/lib/haproxy
    stats socket /var/run/haproxy-admin.sock mode 660 level admin
    stats timeout 30s
    user haproxy
    group haproxy
    daemon
    nbproc 1

defaults
    log     global
    timeout connect 5000
    timeout client  10m
    timeout server  10m

listen  admin_stats
    bind 0.0.0.0:10080
    mode http
    log 127.0.0.1 local0 err
    stats refresh 30s
    stats uri /status
    stats realm welcome login\ Haproxy
    stats auth admin:123456
    stats hide-version
    stats admin if TRUE

listen kube-master
    bind 0.0.0.0:8443
    mode tcp
    option tcplog
    balance source
    server 192.168.1.104 192.168.1.104:6443 check inter 2000 fall 2 rise 2 weight 1
    server 192.168.1.105 192.168.1.105:6443 check inter 2000 fall 2 rise 2 weight 1
    server 192.168.1.106 192.168.1.106:6443 check inter 2000 fall 2 rise 2 weight 1
EOF
```