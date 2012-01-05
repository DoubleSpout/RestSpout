# RestSpout —— node.js restful ROA web framework

##例子：(simple example)

    var http = require('http'),

	RestSpout = require('../lib/RestSpout'),//do nothing but only require it!

    server = http.createServer(function (req, res) {

		res.write('<body>');

		res.write('req.path:'+req.path+'<br />');

		res.write('req.ip:'+req.ip+'<br />');

		res.write('req.referer or req.referrer:'+req.referer+'<br />');

		res.write('req.UserAgent:'+req.UserAgent+'<br />');

		res.write('req.GetParam:'+JSON.stringify(req.GetParam)+'<br />');	

		res.write('req.cookie:'+JSON.stringify(req.cookie)+'<br />');

		res.end('</body>');

	}).listen(3000);
     
     一切都和原来一样，只是在入口文件处引入 RestSpout = require('../lib/RestSpout')这个即可，您将方便许多！

## 接口：(API)

 req:

 属性：(property)

 1、path：一个数组，拆分了'/'分割的uri
 
 2、ip：客户端ip字符串

 3、referer（referer+）：访问来源

 4、UserAgent：客户端信息
 
 5、GetParam：用户GET请求过来的参数

 6、PostParam：用户POST请求过来的参数，具体用法请参与expamle中的ResPost.js

 7、cookie：cookie对象key-value

方法：(method)

1、GetPost(callback)：获取Post数据完毕时调用callback，具体用法请参与expamle中的ResPost.js

2、GetMultiPost([filedir], [callback])：文件上传成功以后调用callback，filedir表示文件存放目录

## 提示：(Tips)

完美兼容expressjs，只需要在入口文件引入 RestSpout = require('../lib/RestSpout'); 然后就可以正常使用expressjs了，想要利用expressjs开发 Restful 架构，只需要：

app.all(/\S/, function(req, res, next){

	//your application code

})

这样就可以根据req.path来自定义规则加载指定模块和执行方法了，不用写多个app.get(/路由正则匹配/, function(){})，整合了文件上传的模块，方便管理简单的文件上传

当然如果你完全可以单独引入 RestSpout = require('../lib/RestSpout')，做一些简单的接口应用开发

##展望：(Future)

将来 RestSpout 将开发respose部分，提供比expressjs更友好的API。