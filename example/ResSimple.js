var http = require('http'),
	RestSpout = require('../lib/RestSpout'),
    server = http.createServer(function (req, res) {
		res.cache('public');
		res.set('X-Powered-By', 'RestSpout');
		res.get('X-Powered-By');
		res.clearcookie('RestSpout');
		res.cookie('RestSpout', 'I am coming!');
		//res.redirect('http://www.baidu.com')
		//res.send('<body>API</body>');
		res.sendjson({name:'spout', age:27});		  
	}).listen(3000);