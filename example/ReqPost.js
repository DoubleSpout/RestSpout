var http = require('http'),
	RestSpout = require('../lib/RestSpout'),
    server = http.createServer(function (req, res) {
		req.GetPost(function(){
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
		});
	}).listen(3000);
var formstr = '<form action="/user/name?method=post" method="post">'+
			  '<input type="text" name="input_name" value="spout" /><br/><br/>'+
			  '<input type="password" name="password" value="password" /><br/><br/>'+
			  '<select name="select_name"><option value="spout" selected="selected">spout</option><option value="snoopy">snoopy</option><select><br/><br/>'+
			  '<input type="checkbox" value="spout" name="checkbox_name" checked="checked" /><input type="checkbox" value="snoopy" name="checkbox_name" /><input name="checkbox_name" type="checkbox" value="DoubleSpout" /><br/><br/>'+
			  '<input type="radio" value="spout" name="radio_name" checked="checked" /><input type="radio" value="snoopy" name="radio_name" /><input name="radio_name" type="radio" value="DoubleSpout" /><br/><br/>'+
			  '<textarea name="textarea_name" >my name is spout!</textarea><br/><br/>'+
			  '<button type="submit">submit</button></form><br/><br/><br/><br/>';