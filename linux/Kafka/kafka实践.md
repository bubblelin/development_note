centos安装jdk
# yum list installed | grep java

# yum -y remove java-1.7.0-openjdk*
# yum -y remove tzdata-java.noarch

# yum -y list java*
# yum -y install java-1.8.0-openjdk*

# yum -y install git.x86_64


zookeeper启动
# zkServer.sh start 
zkServer.sh start-foreground 打印日志方式启动，发现是报找不到主机的路由异常
（1）：zoo.cfg配置文件中，server.x:2888:3888配置出现错误；
（2）：myid文件内容和server.x不对应，或者myid不在data目录下；
（3）：系统防火墙是否在启动。
			# firewall-cmd --state
			# systemctl stop firewalld.service
			# systemctl disable firewalld.service   （禁止开机启动，永久关闭防火墙）

kafka启动
# kafka-server-start.sh -daemon $KAFKA_HOME/config/server.properties			
server.properties修改
zookeeper.connect=server-1:2181,server-2:2181,server-3:2181

验证
# zkCli.sh -server server-1:2181
# ls /brokers/ids

kafka-manager启动
# nohup ./kafka-manager -Dhttp.port=9009 -Dconfig.file=../conf/application.conf &
关闭
# kill -9 pid
删除bin目录下的文件
# rm -f RUNNING_PID


gradle
repositories {
    mavenLocal()
    maven { url "http://maven.aliyun.com/nexus/content/groups/public/"}
    mavenCentral()
    jcenter()
    maven { url "https://repo.spring.io/snapshot" }
    maven { url "https://repo.spring.io/milestone" }
    maven { url 'http://oss.jfrog.org/artifactory/oss-snapshot-local/' }  //转换pdf使用
}




创建主题
kafka-topics.sh --create \
--zookeeper server-1:2181,server-2:2181,server-3:2181 \
--replication-factor 2 \
--partitions 3 \
--topic kafka-action

kafka-topics.sh --create \
--zookeeper server-1:2181,server-2:2181,server-3:2181 \
--replication-factor 2 \
--partitions 3 \
--topic config-test-2 \
--config max.message.bytes=404800

查看主题
kafka-topics.sh --describe --zookeeper server-1:2181,server-2:2181,server-3:2181

删除主题
kafka-topics.sh --delete \
--zookeeper server-1:2181,server-2:2181,server-3:2181 \
--topic config-test-2

修改主题
kafka-topics.sh --alter \
--zookeeper server-1:2181,server-2:2181,server-3:2181 \
--topic config-test-2 \
--config max.message.bytes=204800


生产者发送消息的生产者
kafka-console-producer.sh --broker-list server-1:9092,server-2:9092,server-3:9092 \
--topic kafka-action \
--property parse.key=true \
--property key.separator=' '
查看某个主题各分区对应消息偏移量
kafka-run-class.sh kafka.tools.GetOffsetShell --broker-list server-1:9002,server-2:9002,server-3:9002 \
--topic kafka-action \
--time -1

性能测试工具
kafka-producer-perf-test.sh --num-records 100000 \
--record-size 1000 \
--topic producer-perf-test \
--throughput 1000000 \
--producer-props bootstrap.servers=server-1:9092,server-2:9092,server-3:9092 acks=all































