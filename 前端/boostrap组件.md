### 模态框
``` html
<div class="modal fade" id="final_modal" role='dialog' data-backdrop='static' style="display:node;height:100%;margin:0 30%;text-align:center;">
    <div class="modal-dialog" style='display:table-cell;vertical-align:middle;'>
        <div class="modal-content" style='border-radius:8px;background-color:#fff;'>

            <div class="modal-header" style='color:#000;background-color:#31b0d5;position:relative;'>
                <h4 class="text-center">提示</h4>
                <button class='close text-right' style='opacity: 1;position:absolute;top:36%;left:93%;'>
                    <span aria-hidden='true'>X</span>
                </button>
            </div>

            <div class="modal-body">

            </div>

            <div class="modal-footer" style='border:0;padding:25px 22% 35px;color:#fff;'>
                <div class='col-xs-8' style='padding:0 5%;'>
                    <button class="btn btn-primary" id="confirm_btn_2" style="padding:10px 40px;">确定</button>
                </div>
            </div>
        </div>
    </div>
</div>
```

```javascript
var productName = $('input[name="productName"]').val();
var repayDate = $('input[name="repayDate"]').val();
var msg = "<p class='text-center' style='color:#d10e0a;font-size:20px;margin:30px auto;'>"
        + productName
        + "产品，将于"
        + repayDate
        + "提前还款，确定后将给投资者发送短信通知，并于产品详情页展示还款证明。"
        + "</p>";
//显示模态框
$("#final_modal .modal-body").append(msg);
$('#final_modal').modal('show');
//隐藏模态框
$('#final_modal .modal-body').html('');
$('#final_modal').modal('hide');
```



### 使用bootbox.js插件

1. 确认弹框 confirm

```javascript
bootbox.confirm("Hello world!", function (result) {  
    if(result) {  
        alert('点击了确认按钮');  
    } else {  
        alert('点击了取消按钮');  
    }  
});  
bootbox.confirm({  
    buttons: {  
        confirm: {  
            label: '我是确认按钮',  
            className: 'btn-myStyle'  
        },  
        cancel: {  
            label: '我是取消按钮',  
            className: 'btn-default'  
        }  
    },  
    message: '提示信息',  
    callback: function(result) {  
        if(result) {  
            alert('点击确认按钮了');  
        } else {  
            alert('点击取消按钮了');  
        }  
    },  
    //title: "bootbox confirm也可以添加标题哦",  
});

bootbox.confirm({
   message: "确认要删除吗",
   buttons: {
       confirm: { label: '确认' },
       cancel: { label: '取消' }
   },
   callback: function (result) {
       // 返回 true  或者false
       if (result) {
           bootbox.alert("OK");
       } else {
           bootbox.alert("cancel");
       }
   }
});
```

2. 对话弹框 dialog

``` javascript
bootbox.dialog({  
   message: "I am a custom confirm",  
   title: "Confirm title",  
   buttons: {  
       Cancel: {  
           label: "Cancel",  
           className: "btn-default",  
           callback: function () {  
               alert("Cancel");  
           }  
       }  
       , OK: {  
           label: "OK",  
           className: "btn-primary",  
           callback: function () {  
               alert("OK");  
           }  
       }  
   }  
});  
```

3. 提示弹框 alert

``` javascript

bootbox.alert("");

bootbox.alert("This is an alert with a callback!", function(){
    console.log('This was logged in the callback!');
});

bootbox.alert({  
    buttons: {  
       ok: {  
            label: '我是ok按钮',  
            className: 'btn-myStyle'  
        }  
    },  
    message: '提示信息',  
    callback: function() {  
        alert('关闭了alert');  
    },  
    title: "bootbox alert也可以添加标题哦",  
});
```

``` javascript

```
