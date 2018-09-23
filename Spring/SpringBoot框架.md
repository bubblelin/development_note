## Spring基础配置
### 优点（“习惯优于配置”）
1. 快速构建项目
2. *对主流开发框架的无配置集成*
3. 项目可独立运行，无须外部依赖Servlet容器
4. 提供运行时的应用监控
5. 极大地提高了开发、部署效率
6. 与云计算的天然集成。

配置类
@Configuration声明当前类是一个配置类。
@ComponentScan自动扫描报名下所有使用@Service @Component @Repository @Controller的类，并注册为Bean。

## SpringBoot核心

### 运作原理

注解@SpringBootApplication是一个组合注解，它的核心功能是由@EnableAutoConfiguration提供：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Import({EnableAutoConfigurationImportSelector.class,
        AutoConfigurationPackages.Registrar.class})
public @interface EnableAutoConfiguration{
    Class<?>[] exclude() default{};
    String[] excludeName() default{};
}
```

这里的关键功能是@Import注解导入的配置功能， EnableAutoConfigurationImportSelector使用SpringFactoriesLoader.loadFactoryNames方法来扫描具有META-INF/spring.factories文件的jar包。

打开spring-boot-autoconfigre.jar包的spring.factories文件有AutoConfigration文件，一般都有@ConditionalOnXXX注解。

###### 对于@ConditionalOnWebApplication注解：

```java
package org.springframework.boot.autoconfigure.condition;

@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Conditional(OnWebApplicationCondition.class)
public interface CondititionalOnWebApplication{
}
```

该注解使用的条件是OnWebApplicationCondition，这个类有个isWebApplication方法，判断条件：

1. GenericWebApplicationContext是否在类路径中；
2. 容器里是否有名为session的scope；
3. 当前容器的Environment是否为StandardServletEnvironment；
4. 当前的ResourceLoader是否为WebApplicationContext；
5. 我们需要构造ConditionOutcome类的对象来帮助我们，最终通过ConditionOutcome.isMatch方法返回布尔值来确定条件。



### 类型安全的配置（基于properties）
>SpringBoot提供了基于类型安全的配置方式，通过@ConfigurationProperties将properties属性和一个Bean及其属性关联，从而实现类型安全的配置。
@SpringBootApplication是SpringBoot的核心注解，它是一个组合注解
``` java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Configuration
@EnableAutoConfiguration
@ComponentScan
public @interface SpringBootApplication{
    //用来关闭特定的自动配置，如@SpringBootApplication(exclude={DataSourceAutoConfiguration.class})
    Class<?>[] exclude() default{};
    String[] excludeName() default{};
}
```
@SpringBootApplication的运作原理
``` java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.TUNTIME)
@Documented
@Inherited
@Import({EnableAutoConfigurationImportSelector.class,
    AutoConfigurationPackages.Registrar.class})
public @interface EnableAutoConfiguration{
    Class<?>[] exclude() default{};
    String[] excludeName() default{};
}
```
>这里的关键功能是@Import注解的导入配置功能，EnableAutoConfigurationImportSelector使用SpringFactoriesLoader.loadFactoryNames方法来扫描具有META-INF/spring.factories文件的jar包。
我们的spring-boot-autoconfigure-1.3.0.x.jar 里就有一个spring.factories文件。
spring.factories文件声明了自动配置。一些AutoConfiguration文件的名称。
在spring-boot-autoconfigure-1.3.0.x.jar的org.springframework.boot.autoconfigure.condition包下，条件注解如下：
@ConditionalOnBean: 当前容器里有指定的Bean的条件下
@ConditionalOnClass:    当类路径下有指定的类的条件下
@ConditionalOnExpression:
@ConditionalOnJava:
@ConditionalOnJndi:
@ConditionalOnMissingBean:
@ConditionalOnMissingClass:
@ConditionalOnNotWebApplication:
@ConditionalOnProperty:
@ConditionalOnResource:
@ConditionalOnSingleCandidate:
@ConditionalOnWebApplication:   当前项目是Web项目的条件下
以上注解都组合了@Conditional元注解，只是使用了不同条件。
``` java
//对于@ConditionalOnWebApplication注解
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Docuemented
@Conditional(OnWebApplicationCondition.class)
public @interface ConditionalOnWebApplication{
}
```
从源码可以看出，此注解使用的条件是OnWebApplicationCondition，其中的构造如下：
``` java
@Order(Ordered.HIGHEST_PRECEDENCE + 20)
class OnWebApplicationCondition extends SpringBootCondition{
    //...
}
```
### SpringBoot的内置自动配置功能：http的编码配置
使用配置文件配置http编码方式，是在web.xml中配置一个filter,满足如下两个条件：
1. 能配置CharacterEncodingFilter这个Bean；
2. 能配置encoding和foceEncoding这两个参数。
``` java
<filter>
    <filter-name>encodingFilter</filter-name>
    <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
    <init-param>
        <param-name>encoding</param-name>
        <param-value>UTF-8<param-value>
    </init-param>
    <init-param>
        <param-name>forceEncoding</param-name>
        <param-value>true</param-value>
    </init-param>
</filter>
```
使用SpringBoot内置的自动配置功能
>基于类型安全的配置，在application.properties中直接设置
``` java
@ConfigurationProperties(prefix="spring.http.encoding")
public class HttpEncodingProperties{
    public static final Charset DEFAULT_CHARSET = Charset.forName("UTF-8");//默认方式
    private Charset charset = DEFAULT_CHARSET;//定制编码方式
    private boolean force = true;
}
```
>通过上述配置，根据条件配置CharsetEncodingFilter的Bean
``` java
@Configuration
@EnableConfigurationProperties(HttpEncodingProperties.class)//开启属性注入
@ConditionalOnClass(CharacterEncodingFilter.class)//当CharacterEncodingFilter类在类路径下
@ConditionalOnProperty(prefix="spring.http.encoding", value="enabled", matchIfMissing=true)
public class HttpEncodingAutoConfiguration{
    @Autowired
    private HttpEncodingProperties httpEncodingProperties;
    @Bean
    @ConditionOnMissingBean(CharacterEncodingFilter.class)//当容器中没有这个Bean的时候新建Bean
    public CharacterEncodingFilter characterEncodingFilter(){
        CharacterEncodingFilter filter = new OrderedCharacterEncodingFilter();
        filter.setEncoding(this.httpEncodingProperites.isForce());
        return filter;
    }
}
```

## Web相关配置
###SpringBoot提供的自动配置
>通过查看WebMvcAutoConfiguration及WebMvcProperties的源码，可以发现Spring Boot为我们提供一下配置：
1. 自动配置ViewResolver
    - ContentNegotiatingViewResolver
        这是SpringMVC提供的一个特殊的ViewResolver，ContentNegotiatingViewResolver不是自己处理View，而是代理给不同的ViewResolver来处理不同的View，所以它有最高的优先级。
    - BeanNameViewResolver
        在控制器中的一个方法的放回值的字符串会根据BeanNameViewResolver去查找Bean的名称为返回字符串的View来渲染视图。例如：
        ``` java
        @Bean//定义BeanNameViewResolver的Bean
        public BeanNameViewResolver beanNameViewResolver(){
            BeanNameViewResolver resolver = new BeanNameViewResolver();
            return resolver;
        }
        @Bean//定义一个View的Bean，名为jsonView
        public MappingJackson2JsonView jsonView(){
            MappingJackson2JsonView jsonView = new MappingJackson2JsonView();
            return jsonView;
        }
        //在控制器中， 返回值为字符串jsonView，它会找Bean的名称为jsonView的视图来渲染
        @RequestMapping(value='/json'. produces={MediaType.APPLICATION_JOSN_VALUE})
        public String Json(Model model){
            Person single = new Person("aa", 11);
            model.addAttribute("single", single);
            return "jsonView";
        }
        ```
    - InternalResolverViewResolver
        这是一个极为常用的ViewResolver，主要通过设置前缀、后缀，以及控制器中方法来返回视图名的字符串，以得到实际页面：
        ``` java
        @Bean
        @ConditionalOnMissingBean(InternalResourceViewResolver.class)
        public InternalResouceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setPrefix(this.prefix);
        resolver.setSuffix(this.prefix);
        return resolver;
        ```
2. 自动配置静态资源，在自动配置类的addResourceHandlers方法中定义了一下静态资源的自动配置。
    - 类路径文件
        在类路径下的/static、/public、/resources和/META-INF/resources文件下的静态文件直接映射为/**，可以通过http://localhost:8080/**来访问
    - webjar
3. 自动配置Formatter和Converter， 在WebMvcAutoConfigration类中的定义：
``` java
@Override
public void addFormatters(FormatterRegistry registry){
    //
}
```
4. 自动配置的HttpMessageConverters
在WebMvcConfiguration中，我们注册了messageConverters,这个Bean是在HttpMessageConvertersAutoConfiguration类中定义的，我们自动注册的HttpMessageConverter除了SpringMVC默认的
ByteArrayHttpMessageConverter、
StringHttpMessageConverter、
ResourceHttpMessageConverter、
SourceHttpMessageConverter、
AllEndompassingFormHttpMessageConverter外，我们在HttpMessageConvertersAutoConfiguration的自动配置文件里还引入了JacksonHttpMessageConvertersConfiguration和GsonHttpMessageConverterConfiguration
``` java
@Autowired
private HttpMessageConverters messageConverters;
@Override
public void configureMessageConverters(List<HttpMessageConverte<?>> converters){
    converters.addAll(this.messageConverters.getConverters());
}
```
- 如果jackson的jar包在类路径上，则springBoot通过JacksonHttpMessageConvertersConfigration增加MappingJackson2HttpMessageConverter和MappingJackson2XmlHttpMessageConverter。
- 如果Gson的jar包在类路径上，则springBoot通过GsonHttpMessageConvertersConfigration增加GsonHttpMessageConverter。
>在SpringBoot中，如果要新增自定义的HttpMessageConverter， 则只需自定义一个HttpMessageConverters的Bean，然后在此Bean中注册自定义HttpMessageConverter即可，
    ``` java
    @Bean
    public HttpMessageConverters customConverters(){
        HttpMessageConverter<?> customConverter1 = new CustomConverter1();
        HttpMessageConverter<?> customConverter2 = new CustomConverter2();
        return new HttpMessageConverters(customConverter1, customConverter2)
    }
    ```


### 接管 SpringBoot的Web配置
1. 完全替代SpringMVC的配置；
    通过一个配置类（注解@Configuration）加上@EnableWebMvc注解来实现。
2. 保留默认的自动配置，并增加自己的配置；
    通过一个配置类，并继承WebMvcConfigurationAdapter，但无须使用@EnableWebMvc注解，


### 注册Servlet、Filter、Listerner
当使用嵌入式的Servlet容器（Tomcat等）时，注册Servlet、Filter、Listerner的方式：
1. 通过将Servlet、Filter和Listener声明为Spring Bean而达到注册的效果
2. 注册ServletRegistrationBean、FilterRegistrationBean和ServletListenerRegistrationBean的Bean


## Spring Boot 的数据访问
### Spring Data JPA

### Spring Data REST
> Spring Data JPA是基于Spring Data的Respository之上，可以将repository自动输出为REST资源。目前支持Spring Data JPA、Spring Data MongoDB等自动转换为REST服务。
Spring Data REST的配置是定义在RespositoryRestMvcConfiguration配置类中已经配置好了。我们可以通过继承此类或者直接在自己的配置类上@Import此配置。
``` java
@Configuration
public class MyRepositoryRestMvcConfiguration extends RepositoryRestMvcConfiguration{
    @Override
    public RespositoryRestConfiguration config(){
        return super.config();
    }
}

@Configuration
@Import(RepositoryRestMvcConfiguration.class)
public class AppConfig{
    //...
}
```
>Spring Boot对Spring Data REST的自动配置放置在Rest包中，Spring Boot已经为我们自动配置了RepositoryRestConfiguration类

### 声名式事务
>使用@Transactional注解在方法上标明该方法需要事务支持。这是一个就AOP实现的操作。被注解的方法在调用时，Spring开启一个新的事务，当方法无异常运行结束后，Spring会提交这个事务。
@Transactional的定制事务行为：
1. propagation

2. isolation

3. timeout

4. readOnly

5. rollbackFor

6. noRollbackFor

### 数据缓存Cache
声名式缓存注解：
1. @Cacheable
    在方法执行前Spring先查看缓存中是否有数据，如果有数据，则直接返回缓存数据；若没有数据，调用方法并将方法返回值放进缓存。
2. @CachePut
    无论怎样，都会将方法的返回值放到缓存中。
3. @CacheEvict
    将一条或多条数据从缓存中删除
4. @Caching
    可以通过@Caching注解组合多个注解策略在一个方法上


## Spring Security认证和授权


## Spring Batch批处理
开启批处理的支持需要在配置类上使用@EnableBatchProcessing

## 异步消息