整理springframework 常用的类</p>
<p>spring的里的resouce的概念, 在我们处理io时很有用. 具体信息请参考spring手册</p>
<h2 id="内置的resouce类型">内置的<code>resouce</code>类型：</h2>
<p><code>UrlResource</code><br />
<code>ClassPathResource</code><br />
<code>FileSystemResource</code><br />
<code>ServletContextResource</code><br />
<code>InputStreamResource</code><br />
<code>ByteArrayResource</code><br />
<code>EncodedResource</code> 也就是<code>Resource</code>加上<code>encoding</code>, 可以认为是有编码的资源<br />
<code>VfsResource</code>(在jboss里经常用到, 相应还有 工具类 <code>VfsUtils</code>)<br />
<code>org.springframework.util.xml.ResourceUtils</code> 用于处理表达资源字符串前缀描述资源的工具. 如: &quot;classpath:&quot;.<br />
有 <code>getURL, getFile, isFileURL, isJarURL, extractJarFileURL</code></p>
<h2 id="工具类">工具类</h2>
<p><code>org.springframework.core.annotation.AnnotationUtils</code> 处理注解<br />
<code>org.springframework.core.io.support.PathMatchingResourcePatternResolver</code> 用 于处理 ant 匹配风格(<code>com/*.jsp, com/*/.jsp</code>),找出所有的资源, 结合上面的resource的概念一起使用,对于遍历文件很有用. 具体请详细查看javadoc<br />
<code>org.springframework.core.io.support.PropertiesLoaderUtils</code> 加载<code>Properties</code>资源工具类,和Resource结合<br />
<code>org.springframework.core.BridgeMethodResolver</code> 桥接方法分析器. 关于桥接方法请参考: <a href="http://java.sun.com/docs/books/jls/third_edition/html/expressions.html#15.12.4.5" class="uri">http://java.sun.com/docs/books/jls/third_edition/html/expressions.html#15.12.4.5</a><br />
<code>org.springframework.core.GenericTypeResolver</code> 范型分析器, 在用于对范型方法, 参数分析.<br />
<code>org.springframework.core.NestedExceptionUtils</code></p>
<h2 id="xml工具">xml工具</h2>
<p><code>org.springframework.util.xml.AbstractStaxContentHandler</code><br />
<code>org.springframework.util.xml.AbstractStaxXMLReader</code><br />
<code>org.springframework.util.xml.AbstractXMLReader</code><br />
<code>org.springframework.util.xml.AbstractXMLStreamReader</code><br />
<code>org.springframework.util.xml.DomUtils</code><br />
<code>org.springframework.util.xml.SimpleNamespaceContext</code><br />
<code>org.springframework.util.xml.SimpleSaxErrorHandler</code><br />
<code>org.springframework.util.xml.SimpleTransformErrorListener</code><br />
<code>org.springframework.util.xml.StaxUtils</code><br />
<code>org.springframework.util.xml.TransformerUtils</code></p>
<h2 id="其它工具集">其它工具集</h2>
<p><code>org.springframework.util.xml.AntPathMatcherant</code>风格的处理<br />
<code>org.springframework.util.xml.AntPathStringMatcher</code><br />
<code>org.springframework.util.xml.Assert</code>断言,在我们的参数判断时应该经常用<br />
<code>org.springframework.util.xml.CachingMapDecorator</code><br />
<code>org.springframework.util.xml.ClassUtils</code>用于Class的处理<br />
<code>org.springframework.util.xml.CollectionUtils</code>用于处理集合的工具<br />
<code>org.springframework.util.xml.CommonsLogWriter</code><br />
<code>org.springframework.util.xml.CompositeIterator</code><br />
<code>org.springframework.util.xml.ConcurrencyThrottleSupport</code><br />
<code>org.springframework.util.xml.CustomizableThreadCreator</code><br />
<code>org.springframework.util.xml.DefaultPropertiesPersister</code><br />
<code>org.springframework.util.xml.DigestUtils</code>摘要处理, 这里有用于md5处理信息的<br />
<code>org.springframework.util.xml.FileCopyUtils</code>文件的拷贝处理, 结合Resource的概念一起来处理, 真的是很方便<br />
<code>org.springframework.util.xml.FileSystemUtils</code><br />
<code>org.springframework.util.xml.LinkedCaseInsensitiveMap</code></p>
<h2 id="key值不区分大小写的linkedmap">key值不区分大小写的LinkedMap</h2>
<p><code>org.springframework.util.xml.LinkedMultiValueMap</code>一个key可以存放多个值的<code>LinkedMap</code><br />
<code>org.springframework.util.xml.Log4jConfigurer</code>一个<code>log4j</code>的启动加载指定配制文件的工具类<br />
<code>org.springframework.util.xml.NumberUtils</code>处理数字的工具类, 有<code>parseNumber</code>可以把字符串处理成我们指定的数字格式, 还支持format格式, <code>convertNumberToTargetClass</code> 可以实现<code>Number</code>类型的转化.<br />
<code>org.springframework.util.xml.ObjectUtils</code>有很多处理null object的方法. 如<code>nullSafeHashCode</code>, <code>nullSafeEquals, isArray, containsElement, addObjectToArray</code>, 等有用的方法<br />
<code>org.springframework.util.xml.PatternMatchUtilsspring</code>里用于处理简单的匹配. 如 Spring's typical &quot;xxx&quot;, &quot;xxx&quot; and &quot;xxx&quot; pattern styles<br />
<code>org.springframework.util.xml.PropertyPlaceholderHelper</code>用于处理占位符的替换<br />
<code>org.springframework.util.xml.ReflectionUtils</code>反映常用工具方法. 有 <code>findField, setField, getField, findMethod, invokeMethod</code>等有用的方法<br />
<code>org.springframework.util.xml.SerializationUtils</code>用于java的序列化与反序列化. serialize与deserialize方法<br />
<code>org.springframework.util.xml.StopWatch</code>一个很好的用于记录执行时间的工具类, 且可以用于任务分阶段的测试时间. 最后支持一个很好看的打印格式. 这个类应该经常用<br />
<code>org.springframework.util.xml.StringUtils</code><br />
<code>org.springframework.util.xml.SystemPropertyUtils</code><br />
<code>org.springframework.util.xml.TypeUtils</code>用于类型相容的判断. <code>isAssignable</code><br />
<code>org.springframework.util.xml.WeakReferenceMonitor</code>弱引用的监控</p>
<h2 id="和web相关的工具">和web相关的工具</h2>
<p><code>org.springframework.web.util.CookieGenerator</code><br />
<code>org.springframework.web.util.HtmlCharacterEntityDecoder</code><br />
<code>org.springframework.web.util.HtmlCharacterEntityReferences</code><br />
<code>org.springframework.web.util.HtmlUtils</code><br />
<code>org.springframework.web.util.HttpUrlTemplate</code>这个类用于用字符串模板构建url, 它会自动处理url里的汉字及其它相关的编码. 在读取别人提供的url资源时, 应该经常用String url = &quot;<a href="http://localhost/myapp/%7Bname%7D/%7Bid%7D" class="uri">http://localhost/myapp/{name}/{id}</a>&quot;;</p>
<p><code>org.springframework.web.util.JavaScriptUtils</code><br />
<code>org.springframework.web.util.Log4jConfigListener</code><br />
用listener的方式来配制<code>log4j</code>在web环境下的初始化<br />
<code>org.springframework.web.util.UriTemplate</code><br />
<code>org.springframework.web.util.UriUtils</code>处理<code>uri</code>里特殊字符的编码<br />
<code>org.springframework.web.util.WebUtils</code></p>