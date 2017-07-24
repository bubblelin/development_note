//选择器
$("input.className") //选中input标签中  class属性名为className的标签
$("form .className") //选中form标签下  class属性名为className的标签


//校验form表单
var options = {
    'penaltyDay': ['is', '罚息天数必须是正整数', '^[1-9]\\d*$'],
    'penaltyDay': ['notEmpty', '罚息天数不为空']
};
var tt = $('#formName').validator(options, true, function(info) {
    if(info){
        $('#error').html(info);//错误信息
        return false;
    }
});
if(tt){
    //提交表单
}


//select标签如何回显，通过ejs表达式标记option标签：selected
<select name="scopeActivity" >
    <option value="">请选择</option>
    <% activity.forEach(function(v, i){ %>
        <option value="<%= v.key %>" <%= product.scopeActivity == v.key ? 'selected' : ''%> >
            <%= v.value %>
        </option>
    <% }) %>
</select>


//文档处理  append(), appendTo(), addClass(), end(), empty(), remove()
//1.向所有段落中追加一些HTML标记
HTML:   <p>I would like to say: </p>
jQuery: $("p").append("<b>Hello</b>");
结果：   <p>I would like to say: <b>Hello</b></p>
//2.1 把所有段落追加到ID值为foo的元素中。
HTML:   <p>I would like to say: </p>
        <div></div><div></div>
jQuery: $("p").appendTo("div");
结果:    <div><p>I would like to say: </p></div>
        <div><p>I would like to say: </p></div>
//2.2 新建段落追加div中并加上一个class
HTML:   <div></div><div></div>
jQuery:  $("<p/>").appendTo("div").addClass("test").end().addClass("test2");
结果:     <div><p class="test test2"></p></div>
         <div><p class="test"></p></div>

//3. 把所有段落的子元素（包括文本节点）删除
HTML:       <p>Hello, <span>Person</span> <a href="#">and person</a></p>
jQuery:     $("p").empty();
结果:        <p></p>

//4.1 从DOM中把所有段落删除
HTML:       <p>Hello</p> how are <p>you?</p>
jQuery:     $("p").remove();
结果:        how are
//4.3 从DOM中把带有hello类的段落删除
HTML:       <p class="hello">Hello</p> how are <p>you?</p>
jQuery:     $("p").remove(".hello");
结果:        how are <p>you?</p>
