var fs = require('fs')
  , utils = require('./RestUtils')
  , icon ={
		DefaultPath:utils.ProcessPath+_restConfig.favicon,
		maxAge : _restConfig.maxAge,
		icon : false
	};

icon.SendFavicon = module.exports = function favicon(res, path){
	 var path = path || icon.DefaultPath;
     if(icon.icon)  return icon.Response(true, res)
 	 fs.readFile(path, function(err, buf){
	   if(!err)  icon.Response(false, res, buf);
	 });
	 return false;
  };
 icon.Response = function(iscache, res, buf){
	if(~res._restReq.url.indexOf(_restConfig.favicon)){
			if(!iscache){
				  icon.icon = {
					headers: {
						'Content-Type': 'image/x-icon'
					  , 'Content-Length': buf.length
					  , 'ETag': '"' + utils.md5(buf) + '"'
					  , 'Cache-Control': 'public, max-age=' + (icon.maxAge / 1000)
					},
					body: buf
				  };	
			}
			res.writeHead(200, icon.icon.headers);
			res.end(icon.icon.body);
			return iscache;
	 }
 }
