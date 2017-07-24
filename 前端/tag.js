//添加标签
var i = 0;
$('#addtag').click( function (){
    if(i > 4){
        alert("只能添加5个标签");
        return;
    }
    var v = $('input[name="tag"]').val();
    if(v.length < 1){
        return;
    }
    $('#tag').append('<span class="label label-default tag_label" style="display:inline-block;margin-right:10px;">'+ v + '</span>');
    i++;
 });

 $('#tag').on('click','.tag_label',function(){
     $(this).remove();
     i--;
 })
