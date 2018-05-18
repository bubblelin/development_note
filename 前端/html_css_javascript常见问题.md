## html常见问题
1. 点击form表单内的`<button>`按钮，会自动提交表单
解决在`<buttion type="button">`添加type

2. 点击的事件会重复上一次事件
原因： JS中的事件默认是冒泡方式，逐层往上传播，可以通过stopPropagation()函数停止事件在DOM层次中的传播。
``` javascript
document.getElementById('id').unbind('click').bind('click', function(event){
  //TODO...
  event.stopPropagation() // 停止DOM事件层次传播
})
```

3. 有序列表
`<ol type="1">` 
type属性可有：1，a, A, 罗马数字，
``` html
<ol type="1">
  <li></li>
  <li></li>
</ol>
```
4. 无序列表
`<ul type="disc">` 
type属性可有：disc（实心圆）， cirle（空心圆）， square（实心正方形）
``` html
<ul type="disc">
  <li></li>
  <li></li>
</ul>
```
5. 定义列表
`<dl>`
``` html
<dl>
  <li></li>
  <li></li>
</dl>
```

6. 表格
`<td rowspan="跨度的行数">`
`<td colspan="跨度的列数">`
``` html
<table>
  <caption></catption>
  <thead>
    <tr>
      <th>标准表格单元1</th>
      <th>标准表格单元2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>标准表格单元1</th>
      <th>标准表格单元2</th>
    </tr>
    <tr>
      <th>标准表格单元1</th>
      <th>标准表格单元2</th>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th>标准表格单元1</th>
      <th>标准表格单元2</th>
    </tr>
  </tfoot>
</table>
```


7. 图片标签
`<img src="图像文件源路径" alt="图片无法显示时的提示文字" title="鼠标经过时图片时提示文字">`
图片格式：
jpg (一般的图片)
png (logo或者一些点缀的小图片)
gif (制作动画)
矢量图：
ai (静帧的矢量文件格式)
cdf (工程图)
fh (flash)
swf (flash)


8. a标签
`<a href="链接地址" target="目标窗口的打开方式"></a>`
目标窗口的打开方式：
_self   默认，当前窗口打开
_blank  一个全新的空白窗口打开
_parent 在当前框架的上一层打开
_top    在顶层框架中打开链接
链接类型：
外部链接
内部链接
锚点链接
``` html
<a href="#music"></a>
<div id="music">
</div>
```


9. form标签
* 5个属性：
name:   给表单命名
entype: application/x-www-form-urlencoded、multipart/form-data
target: 同a标签
* 表单对象：
input: type类型有text、password、button、reset、image、radio、checkbox、hidden、file
``` html
<input type="text" value="默认文字" size="文本框长度" maxlength="最多输入字符数"/>
<input type="password" value="默认文字" size="文本框长度" maxlength="最多输入字符数"/>
<input type="checkbox" value="默认被选中" checked="checked"/>

<input type="button" value="普通按钮的取值" onclick="交给javascript处理"/>
<input type="submit" value="提交按钮的取值"/>
<input type="reset" value="重置按钮清楚表单中输入数据"/>
<input type="image" src="按钮样式图片">
```
textarea: rows="行数" cols="列数"
select:   size标示展开后可见的列表项数据，当multiple="multiple"时，可以多选，下拉列表标签option
option:   selected是否选中，同redio的checked效果一样



10. 多媒体标签
`<embed src="视屏文件地址" width="播放界面的宽度" height="播放界面的高度">`
`<embed src="音乐地址" hidden="是否显示播放器" autostart="是否自动播放" loop="是否循环">`


11. 浮动框架iframe （html5舍弃了frameset标签）
`<iframe src="源文件网页地址" width="浮动框架宽" height="浮动框架高" scrolling="滚动条auto"></iframe>`









---

## CSS学习

1. css选择器
| 序号 | 例子                      | 解释                                              |
| ---- | ------------------------- | ------------------------------------------------- |
| 1    | **div,p**                 | 选择所有 `<div>` 和 `<p>` 元素                    |
| 2    | **div p**                 | 选择 `<div>` 元素内部的所有 `<p>`                 |
| 3    | **div>p**                 | 选择父元素为 `<div>` 的所有 `<p>` 元素            |
| 4    | **div+p**                 | 选择紧接在 `<div>` 元素之后的所有 `<p>` 元素      |
| 5    | **[target]**              | 选择带有target属性的所有元素                      |
| 5    | **[target=_blank]**       | 选择 `target="_blank"` 的所有元素                 |
| 6    | **[title~=flower]**       | 选择 `title` 属性包含 `flower` 的所有元素         |
| 7    | **[lang=en]**             | 选择lang属性值以en开头的所有元素                  |
| 8    | **a:link**                | 选择所有未被访问的链接                            |
| 9    | **a:visited**             | 选择所有已被访问的元素                            |
| 10   | **a:active**              | 选择活动链接                                      |
| 11   | **a:hover**               | 选择鼠标指针位于其上的链接                        |
| 12   | **Input:focus**           | 选择获得焦点的 `<input>` 元素                     |
| 13   | **p:first-letter**        | 选择 `<p>` 元素的首字母                           |
| 14   | **p:first-line**          | 选择 `<p>` 元素的首行                             |
| 15   | **p:before**              | 选择在每个 `<p>` 元素的内容之前插入内容           |
| 16   | **p:after**               | 选择在每个 `<p>` 元素的内容之后插入内容           |
| 17   | **p:lang(it)**            | 选择带有以it开头的lang属性值的每个 `<p>` 元素     |
| 18   | **p~ul**                  | 选择前面有 `<p>` 元素的每个 `<ul>`                |
| 19   | **a[src^="https"]**       | 选择其src属性值以 `"https"` 开头的每个 `<a>` 元素 |
| 20   | **a[src$=".pdf"]**        | 选择其src属性以 `".pdf"` 结尾的所有 `<a>` 元素    |
| 21   | **a[src\*="abc"]**         | 选择其src属性包含 `"abd"` 子串的所有 `<a>` 元素   |
| 22   | **p:first-of-type**       | 选择属于其父元素的首个 `<p>` 元素。               |
| 23   | **p:last-of-type**        | 选择属于其父元素的最后 `<p>` 元素。               |
| 24   | **p:only-of-type**        | 选择属于其父元素唯一的 `<p>` 元素。               |
| 25   | **p:only-child**          | 选择属于其父元素只有唯一任意子元素的 `<p>` 元素。 |
| 26   | **p:last-child**          | 选择属于其父元素最后一个子元素每个 `<p>` 元素。   |
| 27   | **p:nth-child(2)**        | 选择属于其父元素的第二个子元素的每个 `<p>` 元素。 |
| 28   | **p:nth-last-child(2)**   | 同上，从最后一个子元素开始计数。                  |
| 29   | **p:nth-last-of-type(2)** | 同上，但是从最后一个子元素开始计数。              |
| 30   | **:root**                 | 选择文档的根元素。                                |
| 31   | **p:empty**               | 选择没有子元素的每个 `<p>` 元素（包括文本节点）。 |
| 32   | **input:enabled**         | 选择每个启用的 `<input>` 元素。                   |
| 33   | **input:disabled**        | 选择每个禁用的 `<input>` 元素                     |
| 34   | **input:checked**         | 选择每个被选中的 `<input>` 元素。                 |
| 35   | **:not(p)**               | 选择非 `<p>` 元素的每个元素。                     |
| 36   | **::selection**           | 选择被用户选取的元素部分。                        |


2. 字体
font-family: 字体1，字体2，字体3；
font-size：  关键字或像素值
font-weight： 有normal，lighter，bold，bolder
font-style：  有normal，itatic，oblique
color

3. 文本
text-decoration  下划线，删除线，顶划线none/underline/line-through
text-transform   将英文转为大写none/uppercase/lowercase/capitalize(首字母大写)
font-variant     将英文转为小写normal/small-caps
text-indent      段落首行缩进12px
text-align       文本水平对齐方式left/center/right
line-height      行高18px
letter-spacing   字母距3px
word-spacing     单词词距3px

4. 边框
border-width
border-style none/hidden/solid/dashed/dotted/double,3d样式 inset/outset/ridge/groove
border-color 
局部边框border-top/border-bottom/border-left/border-right

5. 背景颜色
background-image      图片路径url("")
background-repeat     显示方式no-repeat/repeat/repeat-x/repeat-y
background-position   显示位置x:90px y:40px
background-attachment 是否滚动scroll/fixed


6. 超链接样式
去除下划线：text-decoration:none
超链接伪类：
a:link{css}     未访问时的样式
a:visited{css}  访问后的样式
a:hover{css}    鼠标经过显示的样式
a:actived{css}  鼠标单击激活时的样式


7. 图片样式
* 边框：
border-width
border-style
border-color
* 水平对齐text-align:
left
center
right
* 垂直对齐vertical-align:
top
middle
baseline
bottom
* 文字环绕效果float
left
right
* 图片文字间距
margin-top
margin-bottom
margin-left
margin-right


8. 列表样式
* 有效列表list-style-type
decimal
lower-roman
upper-roman
lower-alpha
upper-alpha
* 无序列表list-sytle-type
disc
circle
square


9. 表格样式


10. css盒子模型
* border 边框
* margin 外边距
* padding 内边距
* content 内容