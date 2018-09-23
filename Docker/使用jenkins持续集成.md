

# 使用Docker+Jenkins构建镜像

### 运行Jenkins容器

1. 修改宿主机docker.service

   ```shell
   # vim /usr/lib/systemd/system/docker.service
   ExecStat=/usr/bin/dockerd-current -H tcp://0.0.0.0:2375 -H unix:///var/run/docker.sock \
   ```


1. 挂在宿主机的卷，需要配置jenkins用户的权限

   ```shell
   # chown -R 1000 /root/docker/docker-data/jenkins
   ```

2. 运行Jenkins，并使用DOOD模式

   ```shell
   # docker run -d \
     --user root \
     -p 8100:8080
     --name docker_jenkins_1
     -v /root/docker/docker-data/jenkins/jenkins_home:/var/jenkins_home
     -v /var/run/docker.sock:/var/run/docker.sock
     -v /usr/bin/docker:/usr/bin/docker
     jenkins/jenkins:lts
   ```

3. 官方的Jenkins镜像是基于debian jessie，在Jenkins运行docker命令还会报错

   ```shell
   docker: error while loading shared libraries: libltdl.so.7: cannot open shared object file: No such file or directory
   Build step 'Execute shell' marked build as failure
   ```

   更新源并安装缺少的库

   ```shell
   # apt-get update && apt-get install -y libltdl7
   ```
