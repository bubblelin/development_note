使用java命令解压jar包：
1. 压缩包：
    jar cvf filename.jar a.class b.class: 压缩指定文件；
    jar cvf weibosdkcore.jar *: 全部压缩；
2. 解压包：
    jar xvf test.jar


    问题
    在Eclipse中对Maven依赖的Jar包打断点时提示Source Not Found找到不到源码

    解决
    Eclipse 安装dynamic-source-lookup（http://ifedorenko.github.com/m2e-extras/）插件即可


maven添加本地jar
tech-sdk-2.0.0-jar-with-dependencies.jar

<groupId>com.eqianbao.tech-sdk</groupId>
<artifactId>tech-sdk</artifactId>
<version>1.0.1</version>

mvn install:install-file -Dfile=tech-sdk-2.0.0 -DgroupId=com.eqianbao.tech-sdk -DartifactId=tech-sdk -Dversion=2.0.0 -Dpackaging=jar

mvn install:install-file -Dfile=tgtext-3.0.0.jar -DgroupId=com.eqianbao.tgtext -DartifactId=eqianbao.tgtext -Dversion=3.0.0 -Dpackaging=jar

<dependency>
			<groupId>com.eqianbao.utils</groupId>
			<artifactId>eqianbao.utils</artifactId>
			<version>1.0.0</version>
		</dependency>
mvn install:install-file -Dfile=Oracle_10g_10.2.0.4_JDBC_ojdbc14.jar -DgroupId=com.oracle -DartifactId=ojdbc14 -Dversion=10.2.0.4.0 -Dpackaging=jar
