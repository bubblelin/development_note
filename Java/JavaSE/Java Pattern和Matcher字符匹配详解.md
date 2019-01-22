# Java Pattern和Matcher字符匹配详解

# Pattern类定义

​         `public final class Pattern extends Object implements Serializable`

​	正则表达式的编译表示形式。用于编译正则表达式后创建一个匹配模式。

​	指定为字符串的正则表达式必须首先被编译为此类的实例。然后，可将得到的模式用于创建Matcher对象，依照正则表达式，该对象可以与任意字符序列匹配。执行匹配所涉及的所有状态都驻留在匹配器中，所以多个匹配器可以共享同一模式。

​	因此，典型的调用顺序是：

```java
Pattern p =Pattern.compile("a*b");

Matcher m =p.matcher("aaaaab");

boolean b = m.matches();
```

​	在仅使用一次正则表达式时，可以方便地通过此类定义matches方法。此方法编译表达式并在单个调用中将输入序列与其匹配。语句：	

```java
boolean b =Pattern.matches("a*b", "aaaaab");
```

​	*等效于上面的三个语句，尽管对于重复的匹配而言它效率不高，因为它不允许重用已编译的模式。*

​	*此类的实例是不可变的，可供多个并发线程安全使用。Matcher类的实例用于此目的则不安全。*



### Pattern类方法

1. `Pattern complie(String regex)`：编译正则表达式，并创建Pattern类。

   由于Pattern的构造函数是私有的，不可以直接创建，所以通过静态的简单工厂方法`compile(String regex)`方法来创建，将给定的正则表达式编译并赋予给Pattern类。

2. `String pattern()`：返回正则表达式的字符串形式。其实就是返回Pattern.complile(String regex)的regex参数。示例如下：

   ```java
   
   ```

3. `Pattern compile(String regex, int flags)`:方法功能和compile(Stringregex)相同，不过增加了flag参数，flag参数用来控制正则表达式的匹配行为，可取值范围如下：

   `Pattern.CANON_EQ` ：启用规范等价。当且仅当两个字符的“正规分解(canonical decomposition)”都完全相同的情况下，才认定匹配。默认情况下，不考虑“规范相等性(canonical equivalence)”。

   `Pattern.CASE_INSENSITIVE`：启用不区分大小写的匹配。默认情况下，大小写不敏感的匹配只适用于US-ASCII字符集。这个标志能让表达式忽略大小写进行匹配，要想对Unicode字符进行大小不敏感的匹配，只要将UNICODE_CASE与这个标志合起来就行了。

   `Pattern.COMMENTS`：模式中允许空白和注释。在这种模式下，匹配时会忽略(正则表达式里的)空格字符(不是指表达式里的“\s”，而是指表达式里的空格，tab，回车之类)。注释从#开始，一直到这行结束。可以通过嵌入式的标志来启用Unix行模式。

   `Pattern.DOTALL`：启用dotall模式。在这种模式下，表达式‘.’可以匹配任意字符，包括表示一行的结束符。默认情况下，表达式‘.’不匹配行的结束符。

   `Pattern.LITERAL`：启用模式的字面值解析。

   `Pattern.MULTILINE`：启用多行模式。在这种模式下，‘\^’和‘$’分别匹配一行的开始和结束。此外，‘^’仍然匹配字符串的开始，‘$’也匹配字符串的结束。默认情况下，这两个表达式仅仅匹配字符串的开始和结束。

   `Pattern.UNICODE_CASE`：启用Unicode感知的大小写折叠。在这个模式下，如果你还启用了CASE_INSENSITIVE标志，那么它会对Unicode字符进行大小写不敏感的匹配。默认情况下，大小写不敏感的匹配只适用于US-ASCII字符集。

   `Pattern.UNIX_LINES`：  启用Unix行模式。在这个模式下，只有‘\n’才被认作一行的中止，并且与‘.’、‘^’、以及‘$’进行匹配。

4. `int flags()`：返回当前Pattern的匹配flag参数。

5. `String[] split(CharSequence input)`：用于分隔字符串，并返回一个String[]。

   此外，以下两个重载方法功能相同，增加参数limit目的在于要指定分割的段数，

   `String[] split(CharSequence input, int limit)`

   `String[]split(CharSequence input)`。

6. `static boolean matches(String regex, CharSequence input)`：是一个静态方法，用于快速匹配字符串，该方法适合用于只匹配一次，且匹配全部字符串。方法编译给定的正则表达式并且对输入的字串以该正则表达式为模式开展匹配，该方法只进行一次匹配工作，并不需要生成一个Matcher实例。

7. `Matcher matcher(CharSequence input)`：返回一个Matcher对象。Matcher类的构造方法也是私有的，不能随意创建，只能通过`Pattern.matcher(CharSequence input)`方法得到该类的实例。Pattern类只能做一些简单的匹配操作，要想得到更强更便捷的正则匹配操作，那就需要将Pattern与Matcher一起合作。Matcher类提供了对正则表达式的分组支持，以及对正则表达式的多次匹配支持。

Java代码示例：

```java
Pattern p = Pattern.compile("\d+");

Matcher m = p.matcher("22bb23");

// 返回p也就是返回该Matcher对象是由哪个Pattern对象的创建的
m.pattern();
```



### Pattern类使用示例

```java
 // 使用Pattern.compile方法编译一个正则表达式，创建一个匹配模式
Pattern pattern = Pattern.compile("\\?|\\*");

// pattern()函数返回正则表达式的字符串形式返回\?\*
String patternStr = pattern.pattern();
System.out.println(patternStr);
// flags()返回当前Pattern的匹配flag参数，这里并没有定义
int flag = pattern.flags();
System.out.println(flag);

// split方法对字符串进行分割
// 123 123 456 456
String[]splitStrs = pattern.split("123?123*456*456");
for (int i = 0; i < splitStrs.length; i++) {
    System.out.print(splitStrs[i] + "  ");
}
System.out.println();

// 字符串分割两次 123 123*456*456 
String[]splitStrs2 = pattern.split("123?123*456*456",2);
for (int i = 0; i < splitStrs2.length; i++) {
    System.out.print(splitStrs2[i] + "  ");
}
System.out.println();

Pattern p = Pattern.compile("\\d+");
String[]str = p.split("我的QQ是:456456我的电话是:0532214我的邮箱是:aaa@aaa.com");
for (int i = 0; i < str.length; i++) {
    System.out.printf("str[%d] = %s\n",i, str[i]);
}
System.out.println();

// Pattern.matches用给定的模式对字符串进行一次匹配，（需要全匹配时才返回true）
System.out.println("Pattern.matches(\"\\\\d+\",\"2223\") is " + Pattern.matches("\\d+", "2223"));
// 返回false，需要匹配到所有字符串才能返回true，这里aa不能匹配到
System.out.println("Pattern.matches(\"\\\\d+\", \"2223aa\")is " + Pattern.matches("\\d+", "2223aa"));
// 返回false,需要匹配到所有字符串才能返回true,这里bb不能匹配到
System.out.println("Pattern.matches(\"\\\\d+\",\"22bb23\") is " + Pattern.matches("\\d+", "22bb23"));
```



https://blog.csdn.net/zengxiantao1994/article/details/77803960































