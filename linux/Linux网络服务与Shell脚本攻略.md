## Linux 网络配置与基础服务
1. ifconfig eth0 第一块网卡信息

2. netstat -anpt | grep “:80”
`anpt`组合选项，以数字的形式显示当前系统中所有的TCP连接信息
`:80`坚听“TCP80”端口

3. DNS解析域名
DNS解析命令：nslookup www.xxx.com
DNS服务器配置：/etc/resolv.conf


4. DHCP
动态主机配置协议服务

1. FTP服务
默认使用TCP协议的20、21端口与客户端进行通信。
20端口用于建立数据连接，并传输文件数据；
21端口用于建立控制连接，并传输FTP控制命令；
主动模式
被动模式
文本模式
二进制模式

安装vsftpd （教程https://www.cnblogs.com/CSGrandeur/p/3754126.html）
sudo apt-get install vsftpd
重启确认安装
sudo service vsftpd restart
设置用户主目录
sudo mkdir /home/ftp
配置vsftpd.conf
sudo vi /etc/vsftpd.conf

``` shell
anonymous_enable=NO #禁止匿名访问
local_enable=YES #接受本地用户
write_enable=YES #允许上传
chroot_local_user=YES #用户只能访问限制的目录
local_root=/home/ftp #设置自己建的固定目录，在结尾添加，如果不添加，各用户对应自己的目录

#加一行“pam_service_name=vsftpd”，这个配置文件本来就有，就不管了。
```

创建用户
sudo useradd -d /home/ftp -M ftpuser
修改密码
sudo passwd ftpuser
调整文件夹权限，避免 “500 OOPS: vsftpd: refusing to run with writable root inside chroot()”
sudo chmod a-w /home/ftp
创建目录，这样登录之后会看到data文件夹
sudo mkdir /home/ftp/data 
改pam.d/vsftpd，这时候直接用useradd的帐号登录ftp会530 login incorrect
sudo nano /etc/pam.d/vsftpd
注释掉： #auth    required pam_shells.so

客户端操作
```shell
ftp>
    lcd /home #将本地目录切换到
    get file  #将文件下载到本地（／home目录）
  或wget ftp://192.168.33.10/vsftpdconf.tar.gz
    put file  #将文件上传到服务器
    quit   #退出
```



## DNS 域名解析服务
1. DNS系统的作用和类型
维护一个地址数据库，其中记录各种主机域名与IP地址的对应关系，为客户程序提供正向或反向的地址查询服务
即：正向解析和反向解析

DNS系统类型
缓存域名服务器
主域名服务器
从域名服务器



## 远程访问权限
### SSH远程管理
1. 配置OpenSSH服务端
sshd服务的配置文件：/etc/ssh/sshd_config
重启：service sshd reload
登陆方式：
  密码验证（优先使用该验证方式）
  密钥对验证配置

    PasswordAuthentication yes  //启用密码验证
    PubkeyAuthentication yes    //启用密钥对验证
    AuthorizedKeysFile .ssh/authorized_keys  //指定公钥库数据文件

2. 使用SSH客户端程序
$> ssh root@*    //登陆
$> whoami        //确认当前用户
$> /sbin/ifconfig eth0 | grep "inet addr"    //确认当前主机地址
$> ssh -p 2345 root@*

3. 构建密钥对验证的SSH体系
$> ssh-keygen -t rsa //创建密钥
$> ls -lh ~/.ssh/id_rsa //确认生成密钥
$> scp ~/.ssh/id_rsa.pub root@*:/tmp //拷贝之服务器
$> cat /tmp/id_rsa.pub >> /home/user/.ssh/authorized_keys
$> tail -l /home/user/.ssh/authorized_keys


### TCP Wrappers访问控制
1. TCP Wrappers概述
2. TCP Wrappers的访问策略



## Shell编程规范与变量
1. 重定向操作
标准输入 STDIN
标准输出 STDOUT
表表错误 STDERR
重定向输入使用`<`操作符
  例如读取密码的操作：`$> passwd -stdin user < pass.txt`
重定向输出使用`>`操作符(会覆盖文件内容)
  例如保存主机的cpu信息： `$> uname -p > kernel.txt`
重定向输出使用'>>'操作符(会追加在文件末尾)
  例如保存主机的cpu信息： `$> uname -p >> kernel.txt`
错误重定向使用`2>`操作符
  例如： `$> tar jcf /*.tgz /etc/ 2> error.log`

2. Shell脚本变量揭秘
1.变量
双引号（"）,主要起界定字符串的作用，特别是要赋值的内容中包含空格时，须以双引号括起来
单引号（"）,要赋值的内容中包含 “$”、“"”、“\”具有特殊意义的字符时，须以单引号括起来
反撇号（"）,重要用于命令替换，例如查找tar命令程序的位置并列出其属性：
  #> ls -lh `which useradd` 
  -rwxr-x---. 1 root root 101K8月2 2011 /user/sbin/useradd
read命令  ,用于提示用户输入信息，以空格为分隔符，将读入的各字段挨个赋值给指定的变量：
  #> read ToDir1
  #> echo $ToDir1
环境变量   ,使用env命令列出


## Shell编程之Sed与Awk
1. 文本处理工具
grep 
egrep
sed
awk
1. 基础正则表达式

| 元字符    | 作用                                                             |
| --------- | ---------------------------------------------------------------- |
| `\`       | 转义字符，用于取消特殊符号的含义，如：`\!`, `\n`                 |
| `^`       | 匹配字符串的开始位置， 如: `^world`匹配以world开头的行           |
| `$`       | 匹配字符串的结束位置， 如: `world$`匹配以world结尾的行           |
| `.`       | 匹配除`\n`（换行）之外的任意一个字符                             |
| `*`       | 匹配前面的子表达式0次或这多次                                    |
| `[list]`  | 匹配list列表中的一个字符，如: `[0-9]`匹配任一位数字              |
| `[^list]` | 匹配不在list列表中的一个字符，如: `^[0-9]`匹配任一位非数字       |
| `\{n\}`   | 匹配前面的子表达式n次，如: `[0-9]\{2\}`匹配两位数字              |
| `\{n,m\}` | 匹配前面的子表达式n到m次，如: `[a-z]\{2,3\}`匹配2到3位的小写字母 |
|  |  |

## Linus防火墙（一）
1. 防火墙
主要工作在网络层，针对TCP/IP数据包实施过滤和限制，属于典型的包过滤防火墙
netfilter: 指Linux内核中实现包过滤防火墙的内部结构，不以程序程序或文件的形式存在，属于“内核态”的防火墙功能体系
iptables : 指用来管理Linux防火墙的命令程序，通常位于/sbin/intables目录下，属于“用户态”的防火墙管理体系
