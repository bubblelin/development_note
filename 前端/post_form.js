//提交表单使用ajax提交：
$.ajax({
    type:'POST',
    url:'/productInstal/add?type=' + type,
    data:cond_,
    success:function(data_){
        console.log('data==',data_);
        if(data_.code == -2){
            alert(data_.detail);
            return false;
        }else if(data_.code == -1){
            window.location.replace('/productInstal/process');
        }else if(data_.code == 0){
            window.location.replace('/productInstal/process');
        }
    }
})
//ajax的post提交的另一种方式：
$.post('/productInstal/add?type=' + type,cond_,function(data_){
	console.log('data==',data_);
	if(data_.code == -2){
		alert(data_.detail);
		return false;
	}else if(data_.code == -1){
		window.location.replace('/productInstal/process');
	}else if(data_.code == 0){
		window.location.replace('/productInstal/process');
	}
});

//使用post提交，需要同时校验：CSRF
"appsec": {
    "enabled": true,
    "priority": 110,
    "module": {
        "name": "lusca",
        "arguments": [{
            "csrf": true,
            "xframe": "SAMEORIGIN",
            "p3p": false,
            "csp": false
        }]
    }
},
//提交csrf
<input type="hidden" name="_csrf" id='_csrf' value="<%-locals._csrf%>">
