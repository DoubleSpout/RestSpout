var http = require('http'),
	RestSpout = require('../lib/RestSpout'),
    server = http.createServer(function (req, res) {
		res.send('123456789012345678901234567890', 200);	  
	}).listen(3000);