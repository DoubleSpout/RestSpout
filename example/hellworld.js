var http = require('http'),
	RestSpout = require('../lib/RestSpout'),
    server = http.createServer(function (req, res) {
		res.end('hello world');	
	}).listen(3000);