# Cluster-248 Node 安装配置

### 安装 kubelet  kube-proxy

``` shell
$ sudo cp kubelet kube-proxy /usr/bin/
```

###### 添加kube-proxy.service启动文件

``` shell
$ sudo vim /usr/lib/systemd/system/kube-proxy.service
[Unit]
Description=Kubernetes Kube-Proxy Server
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=network.target
Requires=network.service

[Service]
EnvironmentFile=/etc/kubernetes/proxy
ExecStart=/usr/bin/kube-proxy \
            $KUBE_LOGTOSTDERR \
            $KUBE_LOG_LEVEL \
            $KUBE_MASTER \
            $KUBE_PROXY_ARGS
Restart=on-failure
LimitNOFILE=65536
 
[Install]
WantedBy=multi-user.target
```

###### 创建proxy配置文件

``` shell
$ sudo mkdir -p /etc/kubernetes

$ sudo vim /etc/kubernetes/proxy
KUBE_PROXY_ARGS=""
$ vim /etc/kubernetes/config
KUBE_LOGTOSTDERR="--logtostderr=true"
KUBE_LOG_LEVEL="--v=0"
KUBE_ALLOW_PRIV="--allow_privileged=false"
KUBE_MASTER="--master=http://192.168.1.248:8080"

```

###### 启动proxy.service服务，查看状态

``` shell
$ sudo systemctl daemon-reload && sudo systemctl start kube-proxy.service

$ sudo netstat -lntp | grep kube-proxy
tcp        0      0 127.0.0.1:10249         0.0.0.0:*               LISTEN      10522/kube-proxy    
tcp6       0      0 :::10256                :::*                    LISTEN      10522/kube-proxy  
```

###### 添加kubelet.service启动文件

``` shell
$ sudo vim /usr/lib/systemd/system/kubelet.service
[Unit]
Description=Kubernetes Kubelet Server
Documentation=https://github.com/GoogleCloudPlatform/kubernetes
After=docker.service
Requires=docker.service
 
[Service]
WorkingDirectory=/var/lib/kubelet
EnvironmentFile=/etc/kubernetes/kubelet
ExecStart=/usr/bin/kubelet $KUBELET_ARGS
Restart=on-failure
KillMode=process
 
[Install]
WantedBy=multi-user.target
```

###### 创建 kubelet 工作目录，创建 kubelet 配置文件

``` shell
$ sudo mkdir -p /var/lib/kubelet

$ sudo vim /etc/kubernetes/kubelet
KUBELET_ADDRESS="--address=0.0.0.0"
KUBELET_HOSTNAME="--hostname-override=192.168.1.248"
KUBELET_API_SERVER="--api-servers=http://192.168.1.160:8080"
KUBELET_POD_INFRA_CONTAINER="--pod-infra-container-image=reg.docker.tb/harbor/pod-infrastructure:latest"
KUBELET_ARGS="--enable-server=true --enable-debugging-handlers=true --fail-swap-on=false --kubeconfig=/var/lib/kubelet/kubeconfig"
```

###### 创建 kubeconfig 配置文件

``` shell
$ sudo vim /var/lib/kubelet/kubeconfig
apiVersion: v1
kind: Config
users:
- name: kubelet
clusters:
- name: kubernetes
  cluster:
    server: http://192.168.1.160:8080
contexts:
- context:
    cluster: kubernetes
    user: kubelet
  name: service-account-context
current-context: service-account-context
```

###### 启动kubectl， 查看状态

``` shell
$ sudo systemctl daemon-reload && sudo systemctl start kubelet.service

$ sudo netstat -tnlp | grep kubelet
tcp        0      0 127.0.0.1:10248         0.0.0.0:*               LISTEN      10630/kubelet       
tcp        0      0 127.0.0.1:37865         0.0.0.0:*               LISTEN      10630/kubelet       
tcp6       0      0 :::10250                :::*                    LISTEN      10630/kubelet       
tcp6       0      0 :::10255                :::*                    LISTEN      10630/kubelet
```