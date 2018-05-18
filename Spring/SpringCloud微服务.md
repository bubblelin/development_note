## 微服务架构应具备以下特性：
1. 每个微服务可以独立运行在自己的进程里。
2. 一系列独立运行的微服务共同构建起整个系统。
3. 每个服务为独立的业务开发，一个微服务只关注某个特定的功能，如订单管理、用户管理等
4. 微服务之间通过一些轻量级的通信机制进行通信，例如通过RESTful API进行调用。
5. 可以使用不同的语言与数据存储技术。
6. 全自动的部署机制。


## 微服务设计原则
- 单一职责原则
- 服务自治原则
- 轻量级通信机制
- 微服务粒度


## Spring Boot Actuator
>Actuator提供了很多监控端点
- autoconfig    自动配置信息
- beans         应用上下文所有的Spring bean
- configprops   @ConfigurationProperties的配置属性列表
- dump          线程活动的快照
- env           应用的环境变量
- health        应用的健康指标
- info          应用的信息
- mappings      所有的URL路径
- metrics       应用的度量标准信息
- trace         跟踪信息（默认为最近100个HTTP请求）
- shutdown      远程关闭应用（需设置endpoints.shutdown.enabled=true）


## 微服务注册于发现Eureka
服务发现组件的功能：
- 服务注册表
- 服务注册于服务发现
- 服务检查
>Eureka是NetFlix开源的服务发现组件，本身是一个基于REST的服务。
Eureka Server: 提供服务发现的能力
Eureka Client： Java客户端

1. 在启动类上添加@EnableEurekaServer或@EnableDiscoveryClient注解
2. 配置文件中添加配置：
    对于Eureka Server： 
        eureka.client.registerWithEureka=false  #是否将自己注册到注册中心
        eureka.client.fetchRegistry=false       #是否从注册中心获取注册信息
        eureka.client.serviceUrl.defaultZone=http://localhost:8761/eureka/ #与Eureka Sever交互
    对于Eureka Client：
        eureka.client.registerWithEureka=true  #是否将自己注册到注册中心
        eureka.client.fetchRegistry=true       #是否从注册中心获取注册信息
        eureka.client.serviceUrl.defaultZone=http://localhost:8761/eureka/
        eureka.client.instance.prefer-ip-address=true #将自己的IP注册到注册中心