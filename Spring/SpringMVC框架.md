## MVC 和三层架构
MVC: Model + View + Controller（数据模型 + 视图 + 控制器）
三层架构：Presentation tier + Application tier + Data tier（展现层包含MVC + 应用层Service + 数据访问层DAO）
> MVC存在于三层架构的展现层，M即数据模型，是包含数据的对象，SpringMVC中有专门的Model类，用来和V（即视图）之间的数据交互、传值；V是视图页面，包含JSP、freeMarker、Thymeleaf等；C即控制器@Controller
> 三层架构是整个应用的架构，是由Spring框架负责管理的。

### DispatcherServlet
1. 请求驱动；
2. 所有设计都围绕这一个中央Servlet来展开，它负责把所有请求分发到控制器；
3. 同时提供其他web应用开发所需要的功能。

DispatcherServlet（继承自HttpServlet基类的一个Servlet）应用的其实就是一个“前端控制器”的设计模式。

在Servlet3.0+的环境下，使用编程方式代替web.xml配置Servlet容器:
``` java
public class MyWebApplicationInitializer implements WebApplicationInitializer{
    @Override
    public void onStartup(ServletContext container){
        ServletRegistration.Dynamic registration = container.addServlet("dispatcher", new DispatcherServlet());
        registration.setLoadOnStartup(1);
        registration.addMapping("/example/*");
    }
}
```

DispatcherServlet依赖以下Bean完成初始化：
HandlerMapping:
    处理器映射器，它会根据某些规则将进入容器的请求映射到具体的处理器以及一系列前处理器和后处理器（即处理器拦截器）上。具体的规则视HandlerMapping类的实现不同而不同。其最常用的一个实现支持你在控制器上添加注解，配置请求路径。
HandlerAdapter:
    处理器适配器，拿到请求所对应的处理器后，适配器将负责去调用该处理器，这使得DispatcherServlet无需关心具体的调用细节。比方说，要调用的是一个基于注解配置的控制器，那么调用前还需要从许多注解中解析出一些相应的信息。因此，HandlerAdapter的主要任务就是对DispatcherServlet屏蔽这些具体的细节。
HandlerExceptionResolver:
    处理器异常解析器，它负责将捕获的异常映射到不同的视图上去，此外还支持将更复杂的异常处理代码。
ViewResolver:
    视图解析器，它负责将一个代表逻辑视图名的字符串映射到实际的视图类型的View上。
LocaleResolver/LocaleContextResolver:
    地区解析器和地区上下文解析器，负责解析客户端所在地区信息甚至时区信息，为国际化的视图定制提供了支持。
ThemeResolver:
    主题解析器，负责解析Web应用中可用的主题，比如，提供一些个性化定制的布局等。
MultipartResolver:
    解析multi-part的传输请求，比如支持通过HTML表单进行的文件上传等。
FlashMapManager:
    FlashMap管理器，能够存储并取回两次请求之间的FlashMap对象。后者可用于在请求之间床底数据，通常是在请求重定向的情况下使用。


### DispatcherServlet的处理流程
1. 搜索应用的上下文对象WebApplicationContext并把它作为一个属性attribute，绑定到该请求上，属性的键名默认：DispatcherServlet.WEB_APPLICATION_CONTEXT_ATTRIBUTE
2. 将地区locale解析器绑定到请求上
3. 将主题theme解析器绑定到请求上
4. 如果配置了multipart文件处理器，则将请求包装成一个MultipartHttpServletRequest对象
5. 为该请求找到一个合适的处理器。前处理器、后处理器、控制器等。
6. 如果处理器返回的是一个模型model，那么框架将渲染相应的视图，若未返回任何模型，则框架不做渲染任何视图。

如果在处理器请求的过程中抛出了异常，那么上下文WebApplicationContext对象中定义的异常处理器将会负责捕获这些异常。通过配置异常处理器，可以定制自己的异常处理方式。


### 控制器Controller的实现
控制器作为应用程序逻辑的处理入口，负责调用已经实现的一些服务。通常，一个控制器会接收并解析用户的请求，然后把它转换成一个模型交给视图，有视图渲染出页面最终呈现给用户。


带正则表达式的URI模板
描述一个URI模板的变量，比如URL："/spring-web/spring-web-3.0.5.jar"
@RequestMapping注解支持在URI模板变量中使用正则表达式，语法：
    {varName:regex}
比如：
``` java
@RequestMapping("/spring-web/{symbolicName:[a-z-]+}-{version:\\d\\.\\d\\.\\d}{extension:\\.[a-z]+}")
public void handl(@PathVariable String version, @PathVariable String extension){

}
```


矩阵变量
矩阵变量可以在任何路径段落中出现，每对矩阵变量之间使用一个分号“；”隔开。
比如：
    URI:"/cars;color=red;year=2018"
多个值可以用逗号隔开或用重复变量名多次：
    "color=red,green,blue"， "color=red;color=green"
``` java
// GET /pets/42;q=11;r=22
@RequestMapping(path="/pets/{petId}", method=RequestMethod.GET)
public void findPet(@PathVariable String petId, @MatrixVariable int q){
    //petId=42
    //q=11
}

// GET /owners/42;q=11/pets/21;q=22
@RequestMapping(path="/owners/{ownerId}/pets/{petId}", method=RequestMethod.GET)
public void findPet(
    @MatrixVariable(name="q", pathVar="ownerId") int q1,
    @MatrixVariable(name="q", pathVar="petId") int q2 ){

        // q1=11
        //q2=22
}

//可以声明一个矩阵变量不是必须出现的，并给它赋值
// GET /pets/42
@RequestMapping(path="/pets/{petId}", method=RequestMethod.GET)
public void findPet(@MatrixVariable(required=false, defaultValue="1") int q){
    // q=1
}
//也可以通过一个Map来存储所有的矩阵变量
// GET /owners/42;q=11;r=12/pets/21;q=22;s=23
@RequestMapping(path="/owners/{ownerId}/pets/{petId}", method=RequestMethod.GET)
public void findPet(
    @MatrixVariable Map<String, String> matrixVars,
    @MatrixVariable(pathVar="petId") Map<String, String> petMatrixVars){

        // matrixVars：["q":"11", "r":"12", "s":"23"]
        // petMatrixVars: ["q":"11", "s":"23"]
    }
```
如果要允许矩阵变量的使用，必须把RequestMappingHandlerMapping类的removeSemicolonContent属性设置为 false （默认true）


支持的方法参数类型：
@PathVariable: URI模板变量中的值。
@MatrixVariable: URI路径段中的键值。
@RequestParam: Servlet请求中指定的参数。
@RequestHeader: Servlet请求中指定的HTTP请求头的值。
@RequestBody: HTTP请求体的存取。通过HttpMessageConverter转换成参数声明的类型。
    请求体到方法参数的转换由HttpMessageConverter完成。
    RequestMappingHandlerAdapter提供一下几种默认的HttpMessageConverter支持：
        ByteArrayHttpMessageConverter： 用以转换字节数组。
        StringHttpMessageConverter： 用以转换字符串。
        FormHttpMessageConverter： 用以将表格数据转换成MultiValueMap<String, String>或从MultiValueMap<String,String>中转换成表格数据。
@RequestPart: 对multipart/form-data请求快内容的存取。
@HttpEntity<?>: 提供了对HTTP请求头及请求体的存取。
java.util.Map / org.springframework.io.Model / org.springframework.ui.ModelMap： 
org.springframework.web.servlet.mvc.support.RedirectAttributes: 
命令或表单对象： 
org.springframework.validation.Errors / org.springframework.validation.BindingResult: 
org.springframework.web.bind.support.SessionStatus: 
org.springframework.web.util.UriComponentsBuilder: 

响应参数：
@ResponseBody： 可被用于方法上，标志该方法的返回值，应该被直接写到HTTP响应体中去（而不会放置到Model中或被解释为一个视图名）


### 异步请求的处理
控制器方法不一定需要返回一个值，而是可以返回一个java.util.consurrent.Callable对象，并通过SpringMVC所管理的线程来返回产生的值。
``` java
@RequestMapping(method=RequestMethod.POST)
public Callable<String> processUpload(final MultipartFile file){
    return new Callable<String>(){
        public String call() throw Exception{
            //...
            return "someView";
        }
    }
}
```
另一个选择，让控制器方法返回一个DeferredResult的实例，该情况下，返回值可以由任何一个线程产生，也包括有SpringMVC管理的线程。
``` java
@RequestMapping("/quotes")
@ResponseBody
public DeferredResult<String> quotes(){
    DeferredResult<String> deferredResult = new DeferredResult<>();
    //save the deferredResult somewhere...
    return deferredResult;
}

//in some other thread
deferredResult.setResult(data);
```

Servlet3.0的异步请求特性：
1. 一个Servlet请求ServletRequest可以通过调用request.startAsync()方法进入异步模式。这样的作用是该servlet以及所有的过滤器都可以结束，但其响应response会留待异步处理结束后再一起返回。
2. 调用request.startAsync()方法会返回一个AsyncContext对象，可用它对异步处理进一步的控制和操作。
3. ServletRequest提供了获取当前DispatcherType的方式，后者可以用来区别当前处理的是原始请求、异步请求、转向，或是其他类型的请求方法类型。
Callable的异步请求被处理时所依次发生的事件
1. 控制器先返回一个Callable对象；
2. SpringMVC开始进行异步处理，并把该Callable对象提交给另一个独立线程的执行器TaskExecute处理；
3. DispatcherServlet和所有过滤器都退出Servlet容器线程，但此时方法的响应对象仍未返回；
4. Callable对象最终产生一个返回结果，此时SpringMVC会重新吧请求分派回Servlet容器，恢复处理；
5. DispatcherServlet再次被调用，恢复对Callable异步处理所返回结果的处理。
异步请求的异常处理
...
拦截异步请求
...

### 使用HandlerIntercepter拦截请求
定义的类需实现org.springframework.web.servlet包下的HandlerInterceptor接口
boolean preHandle(...)
postHandle(...)
afterCompletion(...)
``` java
package sample;
public class TimeBasedAccessIntercepter extends HandlerInterceptorAdapter{
    private int openingTime;
    private int closingTime;
    public void setOpeningTime(int openTime){
        this.openingTime = openTime;
    }
    public void setClosingTime(int closingTime){
        this.closingTime = closingTime;
    }

    public boolean preHandler(HttpServletRequest request, HttpServletResponse response,     Object handler) throw Exception{

        Calendar cal = Calendar.getInstance();
        int hour = cal.get(HOUR_OF_DAY);
        if(openingTime <= hour && closingTime > hour){
            return true;
        }
        response.sendRedirect("http://.....");
        return false;
    }
}
```
如上面的例子，所有被该处理器处理的请求都会被TimeBasedAccessInterceptor拦截器拦截。如果当前时间在工作时间之外，那么用户就会被重定向到一个HTML文件提示用户。

### HTTP缓存支持
主要与"Cache-Control"相关。
配置:setCachePeriod(int seconds)


### 基于代码的Servlet容器初始化
``` java
import org.springframework.web.WebApplicationInitializer;
public class MyWebApplicationInitializer implements WebApplicationInitializer{
    @Override
    public void onStartup(ServletContext container){
        XmlWebApplicationContext appContext = new XmlWebApplicationContext();
        appContext.setConfigLocation("/WEB-INF/spring/dispatcher-config.xml");
        ServletRegistration.Dynamic registration = container.addServlet("dispatcher", new DispatcherServlet(appContext))；
        
        registration.setLoadOnStartup(1);
        registration.addMapping("/");
    }
}
```

### 配置SpringMVC
#### 启用MVC Java编程配置或MVC命名空间
``` java
//SpringMVC配置：跳转路劲等
@Configuration
@EnableWebMvc//开启一些默认配置，如ViewResolver，MessageConverter
public class MyMvcConfig{
    @Bean
    public InternalResourceViewResolver viewResolver(){
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver()；
        viewResolver.setPrefix("/WEB-INF/classes/views/");
        viewResolver.setSuffix(".jsp");
        viewResolver.setViewClass(JstlView.class);
        return viewResolver;
    }
}
//Web配置：onStartUp()方法等
public class WebInitializer implements WebApplicationInitializer{
    @Override
    public void onStartup(ServletContext servletContext){
        AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        ctx.register(MyMvcConfig.class);
        ctx.setServletContext(servletContext);

        Dynamic servlet = servletContext.addServlet("dispatcher", new DispatcherServlet(ctx));
        servlet.addMapping("/");
        servlet.setLoadOnStartup(1);
    }
}
```
同时，以上代码启用了一下特性：
1. Spring3风格的类型转换支持。这是使用一个配置的转换服务ConversionService实例，以及the JavaBeans PropertyEditors used for Data Binding.
2. 使用@NumberFormat对数字字段进行格式化，类型转换由ConversionService实现。
3. 使用@DataTimeFormat注解对Date、Calenda、Long及Joda Time类型的字段进行格式化。
4. 使用@Valid注解对@Controller输入进行验证---前提是classpath路径下比如提供符合JSR-303规范的验证器。
5. HTTP消息转换HttpMessageConverter的支持，对注解了@RequestMapping或@ExceptionHandler方法的@RequesteBody方法参数或@ResponseBody返回值生效。

Jackson JSON和XML转换器是通过Jackson2ObjectMapperBuilder创建的ObjectMapper实例创建的，目的在于提供更好的默认配置。
该builder会使用以下的默认属性对Jackson进行配置：
1. 禁用DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES
2. 禁用MapperFeature.DEFAULT_VIEW_INCLUSION
同时，如果检测在classpath路径下存在这些模块，改builder也会自动注册它们：
1. jackson-datatype-jdk7：支持java7的一些类型
2. jackson-datatype-joda：支持joda-Time类型
3. jackson-datatype-jsr310：支持Java8的Date&Time API类型
4. jackson-datatype-jdk8：支持Java8其它的一些类型，如Optional等。

在Java编程模式下，使用定制的配置：
``` java
@Configuration
@EnableWebMvc
public class WebConfig extends WebMvcConfigurerAdapter{
    //override configuration methods...
    @Bean
    public InternalResourceViewResolver viewResolver(){
        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setPrefix("/WEB-INF/classes/views/");
        viewResolver.setSuffix(".jsp");
        viewResolver.setViewClass(JstlView.class);
        return viewResolver;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry){
        registry.addResourceHandler("/assets/**").addResourceLocations("classpath:/assets/");
    }
}
```
#### 拦截器配置
> 实现对每一个请求处理前后进行相关的业务处理，类似于Servlet的Filter。
1. 让普通的Bean实现HandlerInterceptor接口或者继承HandlerInterceptorAdapter类来实现自定义拦截器。
2. 通过重写WebMvcConfigurerAdapter的addIntercetptors方法来注册自定义的拦截器。
#### @ControllerAdvice
对控制器的全局配置放在同一个位置，注解了@Controller的类里的，并注解了@RequestMapping的方法可以使用一下注解：
@ExceptionHandler
    用于全局处理控制器里的异常
@InitBinder
    设置WebDataBinder，WebDataBinder用来自动绑定前台请求参数到Model中。
@ModelAttribute
    原本的作用是绑定键值对到Model里，此处是让全局的@RequestMapping都能获得在此处设置的键值对。
``` java
@ControllerAdvice
public class ExceptionHandlerAdvice{
    @ExceptionHandler(value=Exception.class)
    public ModelAndView exception(Exception exception, WebRequest request){
        ModelAndView mv = new ModelAndView("error");//error页面
        mv.addObject("errorMessage", exception.getMessage());
        return mv;
    }

    @ModelAttribute
    public void addAttributes(Model model){
        model.addAttributes("msg", "额外信息");
    }

    @InitBinder
    public void initBinder(WebDataBinder webDataBinder){
        webDataBinder.setDisallowedFields("id");
    }
}
```


### Spring MVC高级配置
#### 文件上传配置
> Spring MVC 通过配置一个MultipartResolver来上传文件， 通过MultipartFile[] files参数来接收多个文件上传。
需要的jar依赖：
commons-fileupload
commons-io：可简化I/O操作
#### 自定义HttpMessageConverter
> HttpMessageConverter用来处理request和response里的数据。Spring内置了大量的HttMessageConverter，如：MappingJackson2HttpMessageConverter、StringHttpMessageConverter等。
1. 继承AbstractHttpMessageConverter接口来实现自定义的HttpMessageConverter；
2. 新建一个我们自定义的媒体类型 application/x-wisely；
3. 重写readIntenal()方法，处理请求的数据，具体的转换操作
4. 重写writeIntenal，处理如何输出数据到response
#### 服务器端推送技术
> 早期使用Ajax向服务器轮训消息，使浏览器尽可能第一时间获得服务器的消息，由于这种方式的轮询频率不好控制，所以会增加服务器的压力。
使用SSE轮询，当客户端向服务器发送请求是，服务端会抓住这个请求不放，等有数据更新的时候才返回给客户端；等到客户端接收请求时，再向服务端发送请求。