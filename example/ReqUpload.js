var http = require('http'),
	util = require('util'),
	RestSpout = require('../lib/RestSpout'),
    server = http.createServer(function (req, res) {
			if(req.method === 'POST'){
			req.GetMultiPost(function(MultiForm){
					res.write('<body>');
					res.write(formstr)
					res.write('<b>we get post data down list:</b><br /><br />');
					res.write('req.path:'+req.path+'<br />');
					res.write('req.ip:'+req.ip+'<br />');
					res.write('req.referer or req.referrer:'+req.referer+'<br />');
					res.write('req.UserAgent:'+req.UserAgent+'<br />');
					res.write('req.GetParam:'+JSON.stringify(req.GetParam)+'<br />');
					res.write('req.cookie:'+JSON.stringify(req.cookie)+'<br />');
					res.write('<br/><br/><b>we got the multiform data down list:</b><br/><br/>')
					res.write(util.inspect(MultiForm));
					res.end('</body>');
				});
			}
			else{
					res.write('<body>');
					res.write(formstr)
					res.write('<b>we get post data down list:</b><br /><br />');
					res.write('req.path:'+req.path+'<br />');
					res.write('req.ip:'+req.ip+'<br />');
					res.write('req.referer or req.referrer:'+req.referer+'<br />');
					res.write('req.UserAgent:'+req.UserAgent+'<br />');
					res.write('req.GetParam:'+JSON.stringify(req.GetParam)+'<br />');
					res.write('req.PostParam:'+JSON.stringify(req.PostParam)+'<br />');
					res.write('req.cookie:'+JSON.stringify(req.cookie)+'<br />');
					res.end('</body>');
				
			}

	}).listen(3000);
var formstr = '<form enctype="multipart/form-data" action="/user/name?method=post" method="post">'+
			  '<input type="text" name="input_name" value="spout" /><br/><br/>'+
			  '<input type="password" name="password" value="password" /><br/><br/>'+
			  '<input type="file" name="img" value="" /><br/><br/>'+
			  '<button type="submit">submit</button></form><br/><br/><br/><br/>';