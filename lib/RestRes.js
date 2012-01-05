var fs = require('fs'),
	http = require('http'),
    path = require('path'),
    utils = require('./RestUtils'),
    mime = require('mime'),
	sendfile = require('./RestStatic'),
	sendfavicon = require('./RestFavicon'),
	restzlib = require('./RestZlib'),
	configZlib = _restConfig.isZlib,
	restjs = _restConfig.PoweredBy,
    RestRes  = module.exports = function(){
		if(!(this instanceof arguments.callee)) return new arguments.callee();
		this.res = http.ServerResponse.prototype;
		this._restResMethod = ['cache', 'send', 'sendjson', 'sendfile', 'contentType', 'download', 'attachment', 'set', 'get', 'clearcookie', 'cookie', 'redirect', 'render', 'favicon'];
		this._restdefine(this.res, this._restResMethod);
  }
RestRes.prototype={
		_cache:function(res, type, maxAge){ 
			  var option = option || {};
			  if (maxAge) type += ', max-age=' + (maxAge / 1000); 
			  return this._set(res, 'Cache-Control', type);
		},
		_send:function(res, body, statscode, iszlib){ 
				  var that = this,
					  iszlib = iszlib,
					  type,
					  acceptEncoding = res._restReq.headers['accept-encoding'],
					  body = body;
				  if('undefined' === typeof iszlib) iszlib =configZlib
				  res.setHeader('Server', restjs);
				  if(statscode) res.statusCode = statscode;
				  switch (typeof body) {
					case 'number':
					  that._contenttype(res, '.txt');
					  body = http.STATUS_CODES[body];
					  break;
					case 'string':
					  if (!res.getHeader('Content-Type')) that._contenttype(res, '.html');			
					  break;
					case 'boolean':
					case 'object':
					  if (null == body) body = '';
					  else if (Buffer.isBuffer(body)) that._contenttype(res, '.bin');
                      else return this._sendjson(res, body);
					  break;
				  }
				  if ('undefined' !==typeof  body && !res.getHeader('Content-Length')) {
					res.setHeader('Content-Length', Buffer.isBuffer(body) ? body.length : Buffer.byteLength(body));
				  }
				  if (204 == res.statusCode || 304 == res.statusCode) {
					res.removeHeader('Content-Type');
					res.removeHeader('Content-Length');
					body = '';
				  }
				  if(iszlib && (type = restzlib.check(acceptEncoding))) restzlib.send(res, body, type);
				  else res.end(body);			   
				  return res;
		},
		_sendjson:function(res, obj, statscode, iszlib, iszlib){ 			  
				  this._contenttype(res, '.json');
				  this._send(res, JSON.stringify(obj), statscode);
				  return res;
		},
		_sendfile:function(res, filepath, callback){ 	
			res.setHeader('Server', restjs);
			if(!filepath) return callback('filepath must require!');
			sendfile(res, filepath, callback);
			return res;
		},
		_contenttype:function(res, filename){
			 var charset = res.charset || 'utf-8';
			 res.setHeader('Content-Type', mime.lookup(filename)+'; '+charset);
			 return res;
		},
		_attachment:function(res, filename){ 
			  if (filename) this._contentType(res, filename);
			  res.setHeader('Content-Disposition', 'attachment; filename="' + path.basename(filename) + '"');
			  return res;
		},
		_download:function(res, filepath, fn){ 
				  return this._attachment(res, filepath)._sendfile(res, filepath, fn);
		},
		_set:function(res, field, val){ 
					if (3 == arguments.length) res.setHeader(field, val);
					else for (var key in field) res.setHeader(key, field[key]);
					return res;
		},
		_get:function(res, field){
				return res.getHeader(field);
		},
		_clearcookie:function(res, name, options){ 
				var opts = { expires: new Date(1), path: '/' };
				return this._cookie(res, name, '', options
				? utils.merge(opts, options)
				: opts);
		},
		_cookie:function(res, name, val, options){ 
			var options = options || {};
			if ('object' == typeof val) val = 'json:' + JSON.stringify(val);
			if ('maxAge' in options) options.expires = new Date(Date.now() + options.maxAge);
			res.setHeader('Set-Cookie', utils.serializeCookie(name, val, options));
			return this;
		},
		_redirect:function(res, url){
			  this._set(res, {'Location':url, 'Content-Type':'text/plain'}).statusCode = 302;
			  res.end('Redirecting to ' + url);
		},
		_render:function(res, view, options, fn){ 
			console.log('输出模版');
				 //输出模版render
			return res;
		},
		_favicon:function(res, filepath){
			sendfavicon(res, filepath);		
		},
		_restdefine:function(res, array){
			var that = this;
			array.forEach(function(value, i){
				res[value] = (function(value){
					return function(){
						var arg = Array.prototype.slice.apply(arguments);
						arg.unshift(this);
						return that['_'+value].apply(that, arg);
					}
				})(value)
			});
		Object.defineProperty(that.res, '_restReq', {set:function(newValue){
				 _restReq = newValue;
				 },get:function(){
					var reqobj = this.connection.server._events.request.arguments[0];
					return {
						url:reqobj.url,
						method:reqobj.method,
						headers:reqobj.headers
					};
			},enumerable:false});	
		},
	};


