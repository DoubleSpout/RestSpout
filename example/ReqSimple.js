var http = require('http'),
	RestSpout = require('../lib/RestSpout'),
    server = http.createServer(function (req, res) {
		res.write('<body>');
		res.write('req.path:'+req.path+'<br />');
		res.write('req.ip:'+req.ip+'<br />');
		res.write('req.referer or req.referrer:'+req.referer+'<br />');
		res.write('req.UserAgent:'+req.UserAgent+'<br />');
		res.write('req.GetParam:'+JSON.stringify(req.GetParam)+'<br />');
		res.write('req.PostParam:'+JSON.stringify(req.PostParam)+'<br />');		
		res.write('req.cookie:'+JSON.stringify(req.cookie)+'<br />');
		res.write('<script>document.cookie = "name = spout"</script>');
		res.end('</body>');
	}).listen(3000);