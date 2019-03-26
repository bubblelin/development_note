# 基础环境配置

*参考：[Rancher基础环境配置](https://www.cnrancher.com/docs/rancher/v2.x/cn/installation/basic-environment-configuration/)*



### 主机配置

1. 配置要求

2. 操作系统选择

3. Docker版本选择

   支持的Docker版本

   - 1.12.6
   - 1.13.1
   - 17.03.2
   - 17.06 (for Windows)

4. 主机名配置

   因为K8S的规定，主机名只支持包含 `-` 和 `.`(中横线和点)两种特殊符号，并且主机名不能出现重复。

5. Hosts

   配置每台主机的hosts(/etc/hosts),添加`$hostname host_ip`到hosts文件中。

6. CentOS关闭selinux

   ```shell
   $ sudo sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
   
   $ sudo systemctl stop firewalld.service && sudo systemctl disable firewalld.service

7. 关闭防火墙(可选)或者放行相应端口

8. 配置主机时区

9. Kernel性能调优

10. ETCD集群容错表



### Docker安装于配置

```shell
# 卸载旧版本Docker软件
$ sudo yum remove docker \
              docker-client \
              docker-client-latest \
              docker-common \
              docker-latest \
              docker-latest-logrotate \
              docker-logrotate \
              docker-selinux \
              docker-engine-selinux \
              docker-engine \
              container*
# 定义安装版本
$ export docker_version=17.03.2

# step 1: 安装必要的一些系统工具
$ sudo yum update -y
$ sudo yum install -y yum-utils device-mapper-persistent-data lvm2

# Step 2: 添加软件源信息
$ sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# Step 3: 更新并安装 Docker-CE
$ sudo yum makecache all
$ version=$(yum list docker-ce.x86_64 --showduplicates | sort -r|grep ${docker_version}|awk '{print $2}')
$ sudo yum -y install --setopt=obsoletes=0 docker-ce-${version} docker-ce-selinux-${version}

# 把当前用户加入docker组
$ sudo usermod -aG docker `<new_user>`
# 设置开机启动
$ sudo systemctl enable docker
```

