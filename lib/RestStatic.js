var fs = require('fs'),
    path = require('path'),
    utils = require('./RestUtils'),
    Buffer = require('buffer').Buffer,
    mime = require('mime'),
	restzlib = require('./RestZlib'),
    RestStatic = {
		option:{
			getOnly : _restConfig.staticGetOnly,
			maxAge : _restConfig.maxAge
		}
	};
RestStatic.zlibArray = _restConfig.ZlibArray;
RestStatic.setHeaders = function(res, option){
    if (!res.getHeader('Date')) res.setHeader('Date', new Date().toUTCString());
    if (!res.getHeader('Cache-Control')) res.setHeader('Cache-Control', 'public, max-age=' + (option.maxAge / 1000));
    if (!res.getHeader('Last-Modified')) res.setHeader('Last-Modified', option.mtime);
    if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', option.type + (mime.charsets.lookup(option.type) ? '; charset=' + charset : ''));
    if (!res.getHeader('Etag')) res.setHeader('Etag', '"' + utils.md5(option.mtime) + '"');
	res.setHeader('Accept-Ranges', 'bytes');
};
RestStatic.send = module.exports = function(res, filepath, cb){
	var option = RestStatic.option,
	    cb = cb || function(){},
		req = res._restReq,
		acceptEncoding = req.headers['accept-encoding'];
if (option.getOnly && !'GET' == req.method) return cb('Sorry this source get method only');
fs.stat(filepath, function(err, stat){
    if (err) return cb('Find file err:'+err);
    else if (stat.isDirectory()) return cb('Could not send a directory!');
	var	ranges = req.headers.range,
		opts = {}, 
        len = stat.size,
		stype = option.type = mime.lookup(filepath);
	option.mtime = stat.mtime.toUTCString();
	RestStatic.setHeaders(res, option);
    if (utils.conditionalGET(req) && !utils.modified(req, res)) {
        cb()
        return utils.notModified(res);
    }
    if (ranges) {
       ranges = utils.parseRange(len, ranges);
      if (ranges) {
        opts.start = ranges[0].start;
        opts.end = ranges[0].end;
        len = opts.end - opts.start + 1;
        res.statusCode = 206;
        res.setHeader('Content-Range', 'bytes '
          + opts.start
          + '-'
          + opts.end
          + '/'
          + stat.size);
      } else {
        return cb('Range error:'+utils.error(416));
      }
    }
	var type = restzlib.check(acceptEncoding),
		couldZlib = RestStatic.zlibArray.some(function(value){
			return value == stype;		
		});
		fs.readFile(filepath, function(err, data){
				if(err) return cb(err)
				if(type && couldZlib) restzlib.send(res, data, type);
				else{
					res.setHeader('Content-Length', data.length);
					res.end(data);
				}
				cb();				
		})
	});	
}
