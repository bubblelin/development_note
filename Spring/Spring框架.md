### Spring框架分成多个模块。应用程序可以选择需要的部分。

![img](D:\MyDocument\Development_study\development_note\Spring\spring-overview.png)

- spring-aop: 基于代理的AOP支持
- spring-aspects: 基于AspectJ的切面

- spring-beans: Beans的支持，包括Groovy
- spring-context: 应用程序上下文运行，包括调度和远程抽象
- spring-context-support: 将公共第三方库集成到Spring应用程序上下文中的支持类
- spring-core: 许多其他Spring模块使用核心工具类
- spring-expression: Spring表达式语言（SpEL）

- spring-messaging: 对消息传递体系结构和协议的支持

- spring-instrument: 用于JVM的检测代理
- spring-instrument-tomcat: 用于Tomcat的检测代理

- spring-jdbc: JDBC支持包，包括数据源设置和JDBC访问支持
- spring-jms: JMS支持包，包括用于发送和接受JMS消息的帮助类
- spring-orm: 对象/关系映射，包括JPA和Hibernate支持
- spring-oxm: 对象/XML映射
- spring-test: 支持单元测试和集成测试Spring组件
- spring-tx: 事务架构，包括DAO支持和JCA集成

- spring-web: WEB支持包，包括客户端和WEB远程处理
- spring-webmvc: WEB应用程序的REST WEB服务和模型-视图-控制器实现
- spring-webmvc-portlet: 要在Portlet环境中使用MVC实现
- spring-websocket: WebSocket和SockJS实现，包括STOMP支持

除了Spring框架外，还有其他项目，如：
1. Spring Boot: 提供了一种快速、自动配置Spring各种组件的方法来创建用于生产环境的Spring的应用程序。它是基于Spring框架的，“约定多于配置”，目的是快速搭建可以运行的应用。
2. Spring Security
3. Spring Data: 对主流的关系型和NoSQL数据库的支持。
4. Spring Cloud: 为分布式系统开发提供工具库。
5. Spring Batch
6. Spring XD: 用来简化大数据开发。
7. Spring Intergration: 通过消息机制对企业集成模式的支持
8. Spring HATEOAS: 基于HATEOAS原则简化REST服务开发
9. Spring Social: 基于社交网络API（如Facebook、新浪微博等）的集成
10. Spring AMQP: 
11. Spring Mobile: 提供对手机设备检测的功能，给不同的设备返回不同的页面的支持。
12. Spring for Android: 主要提供在Android上消费RESTful API的功能。
13. Spring Web Flow: 基于Spring MVC提供基于向倒流程式的Web应用开发
14. Spring Web Services: 提供了基于协议有限的SOAP/Web服务
15. Spring LDAP:
16. Spring session: 提供一个API，及实现来管理用户会话信息。


### Spring框架本身有四大原则
Spring所有功能的设计和实现都是基于此四大原则。
1. 使用POJO进行轻量级和最小侵入式开发。
2. 通过依赖注入和基于接口编程实现松耦合。
3. 通过AOP和默认习惯进行声明式编程。
4. 使用AOP和模板减少模式化代码。


### Spring AOP
AOP: 面向切面编程
> Spring的AOP存在的目的是为了解耦。AOP可以让一组类共享相同的行。在OOP中只能通过继承类和实现接口，来使代码的耦合度增强，且类继承只能为单继承，阻碍更多的行为添加到一组类上，AOP弥补了OOP的不足。
Spring支持AspectJ的注解式切面编程。
1. 使用@AspectJ声明是一个切面。
2. 使用@After、@Before、@Around定义建言（advice），可以直接将拦截规则（切点）作为参数。
3. 其中@After、@Before、@Around参数的拦截规则为切点（PointCut），为了使切点复用，可以使用@PointCut专门定义拦截规则，然后再@After、@Before、@Around的参数调用。
4. 其中符合条件的每一个被拦截处为连接点（JoinPoint）。
5. Spring配置类加上@EnableAspectJAutoProxy


### Spring 框架的Inversion Of Control(IOC)组件
> 控制翻转（IoC）和依赖注入（DI）在Spring环境下是等同的概念，控制翻转是通过依赖注入实现。所谓依赖注入指的是容器负责创建对象和维护对象间的依赖关系，而不是通过对象本身负责自己的创建和解决自己的依赖。

> IoC 旨在通过提供正规化的方法来组合不同的组件，成为一个完整的可用的应用。
> IoC容器：最主要的是完成了对象的创建和依赖的管理注入等等。

所谓控制反转，就是原先我们代码里面需要实现的对象创建、依赖的代码，反转给容器来帮忙实现。
我们需要创建一个容器，同时需要一种描述来让容器知道需要创建的对象与对象的关系。
这个描述最具体表现就是我们可配置的文件：.
1. 对象和对象关系怎么表示？
    可以用 xml ， properties 文件等语义化配置文件表示。
2. 描述对象关系的文件存放在哪里？
    可能是 classpath ， filesystem ，或者是 URL 网络资源， servletContext 等。
3. 回到正题，有了配置文件，还需要对配置文件解析。不同的配置文件对对象的描述不一样，如标准的，自定义声明式的，如何统一？ 
    在内部需要有一个统一的关于对象的定义，所有外部的描述都必须转化成统一的描述定义。
4. 如何对不同的配置文件进行解析？
    需要对不同的配置文件语法，采用不同的解析器


### Spring Aware
> Spring依赖注入的最大亮点就是你所有的Bean对Spring容器的存在是没有“意识”的。即可以将Spring替换成别的容器。但是，在实际项目中，Bean必须要“意识”到Spring的存在，才能调用Spring所提供的资源，这就是所谓的Spring Aware。其实，Spring Aware本来就是Spring设计用来框架内部使用的，若使用Spring Aware,则Bean将会和Spring框架耦合。

Spring提供的Aware接口:
- BeanNameAware:
    获得容器中的Bean的名称。
- BeanFactoryAware:
    获得当前bean factory,这样可以调用容器的服务。
- ApplicationContextAware*:
    当前applicaiton context,这样可以调用容器的服务。
- MessageSourceAware:
    获得message source, 这样可以获得文本信息。
- ApplicationEventPublisherAware:
    应用时间发布器，可以发布事件。
- ResourceLoaderAware:
    获得资源加载器，可以获得外部资源文件。

- 让Bean去继承ApplicationContextAware可以获得Spring容器的所有服务。


### Spring高级特性
#### 多线程
Spring通过任务执行器TaskExecutor 来实现多线程和并发编程。使用ThreadPoolTaskExecutor可实现一个基于线程池的任务执行器。 而实际开发中，任务一般是非阻碍的，即异步的，所以我们要在配置类中通过@EnableAsync开启对异步任务的支持，并通过在实际执行的Bean的方法中使用@Async注解来声明其是一个异步任务。
1. 利用@EnableAsync注解开启异步任务支持
2. 配置类实现AsyncConfigurer接口并重写getAsyncExecutory方法，并返回一个ThreadPoolTaskExecutor，如此便能获得一个基于线程池的任务执行器。
##### 计划任务
1. 首先通过在配置类中注解@EnableScheduling来开启对计划任务的支持。
2. 然后再要执行计划任务的方法上注解@Scheduled，以声明这是一个计划任务。
3. 在@Scheduled注解上，使用fixedRate属性每隔固定时间执行，使用cron属性设定指定时间执行。
#### 条件注解@Conditional
根据满足某一个特定条件创建一个特定的Bean。
- 如：通过实现Condition接口，并重写其matches方法来构造判断条件
#### 组合注解和元注解
元注解：可以注解到别的注解上的注解。
组合注解：被注解的注解称为组合注解，并具备元注解的功能。
#### @Enable* 注解的工作原理
@EnableAspectJAutoProxy
    开启对AspectJ自动代理的支持
@EnableAsync
    开启异步方法的支持
@EnableScheduling
    开启计划任务的支持
@EnableWebMvc
    开启WebMVC的配置支持
@EnableConfigurationProperties
    开启对@ConfigurationProperties注解配置Bean的支持
@EnableJpaRepositories
    开启SpringDataJPARepository的支持
@EnableTransactionManagement
    开启注解式事务的支持
@EnableCaching
    开启注解式缓存的支持。
以上注解的源码，都有一个@Import注解，该注解用来导入一下三种配置类：
1. 直接导入配置类
    @Import(SchedulingConfiguration.class)，SchedulingConfiguration类注解了@Configuration，且注册了一个scheduledAnnotationProcessor的Bean
2. 依据条件选择配置类
    @Import(AsyncConfigurationSelector.class)，AsycnConfigurationSelector类通过条件来选择需要导入的配置类，该类通过实现ImportSelector接口，并重写了selectImports()方法进行条件判断
3. 动态注册Bean
    @Import(AspectJAutoProxyRegistrar.class)，AspectJAutoProxyRegistrar类实现了ImportBeanDefinitionRegistrar接口，并重写registerBeanDefinitions()方法在运行时自动添加Bean到已有的配置类。
#### 测试
> 单元测试是针对当前开发的类和方法进行测试，可以简单通过模拟依赖来实现，对运行环境没有依赖。
但是只通过单元测试时不够的，它只能验证当前类或方法能否正常工作，而我们想要知道系统的各个组成部分（数据库、网络连接、IoC容器等）组合在一起是否能正常工作，故需要集成测试。
Spring通过Spring TestContext Framework对集成测试提供顶级支持。既可以依赖Junit，也可以依赖TextNG。
Spring提供了一个SpringJUnit4ClassRunner类，提供了Spring TestContext Framework的功能：
0. @RunWith引入SpringJunit4ClassRunner类
1. 通过@ContextConfiguration来配置Application Context；
2. 通过@ActiveProfiles确定获得profile

### Spring源码解析

#### Spring中的后置处理器BeanPostProcessor
```java
public interface BeanPostProcessor {
    //实例化、依赖注入完毕，在调用显示的初始化之前完成一些定制的初始化任务，
    //显示的初始化方法，(例如：配置文件中bean标签添加init-method属性指定Java类中初始化方法、
    //@PostConstruct注解指定初始化方法，Java类实现InitailztingBean接口)
    Object postProcessorBeforeInitialization(Object bean, String beanName) throws BeansException;
    //实例化、依赖注入、初始化完毕时执行
    Object postProcessorAfterInitialization(Object bean, String beanName) throws BeansException;
}
```