### k8s技术清单

- [etcd](https://github.com/etcd-io/etcd/releases)
- docker
- Harbor
- [kubernetes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.11.md#downloads-for-v1113)
  1. kubelet
  2. kube-proxy
  3. kube-apiserver
  4. kube-controller-manager
  5. kube-scheduler
  6. kube-dashboard
- traefik
- flannel  (host-gw模式)
- CoreDNS



### 节点规划

| 主机名     | IP            | 角色   |
| ---------- | ------------- | ------ |
| master-160 | 192.168.1.169 | master |
| cluster-248 | 192.168.1.248 | node   |
| cluster-249 | 192.168.1.249 | node   |

注：

容器IP范围：172.33.0.0/30

k8s service IP 范围：10.0.0.0/24


### Docker 安装

[安装Docker.md](D:\github\development_note\Docker\k8s\安装Docker.md)



### 关闭swap

```shell
$ swapoff -a
$ sudo vim /etc/fstab #修改自动挂载配置，注释掉即可
#/dev/mapper/centos-swap swap   swap    defaults    0 0
```




### devops-102主机配置

- Docker
- kubelet
- flannel
- traefik

[Node主机安装.md](D:\github\development_note\Docker\k8s\Node主机安装.md)



### devops-103主机配置

- Docker
- kubelet
- flannel



### Master主机配置

- Docker
- etcd
- kube-apiserver
- kube-controller-manager
- kube-scheduler
- kubelet
- flannel
- dashboard

[Master主机安装.md](D:\github\development_note\Docker\k8s\Master主机安装.md)



 

### 配置flannel网络

*Flannel可以使整个集群的Docker容器拥有唯一的内网IP，并且多个Node之间的docker0可以互相访问*



### 访问k8s集群

访问k8s集群的方式：

1. 本地访问
2. 在VM内部访问
3. k8s-dashboard （https://172.17.8.101:8443）