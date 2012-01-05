var http = require('http'),
	RestSpout = require('../lib/RestSpout'),
    server = http.createServer(function (req, res) {
		res.sendfile(__dirname+'/static/evo.jpg', function(err){
			if(!err) console.log('success！！！');
		})
	}).listen(3000);