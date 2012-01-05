var zlib = require('zlib'),
    RestZlib  = {
		iszilb:_restConfig.isZlib
	}
 RestZlib.send = function(res, body, type){
	if(!type) return false;
	res.setHeader('content-encoding', type);
	zlib[type.toLowerCase()](body, function(err, data){
		res.setHeader('Content-Length', data.length);
		if(!err) res.end(data);
	})
	return true;
}	
 RestZlib.check = function(acceptEncoding){
	if(!RestZlib.iszilb || !acceptEncoding) return false;
	if(~acceptEncoding.toLowerCase().indexOf('deflate')) return 'Deflate';
	else if(!acceptEncoding.toLowerCase().indexOf('gzip')) return 'Gzip';
	return false;
 }
module.exports = RestZlib;