var http = require('http'),
	path = require('path'),
	url = require('url'),
	RestUtils = require('./RestUtils'),
	multipart = require('./Multipart'),
    RestReq = module.exports =  function(){
		if(!(this instanceof arguments.callee)) return new arguments.callee();
		this.Req = http.IncomingMessage.prototype;
		this.Req.GetPost = this._restGetPost;
		this.Req.GetMultiPost = function(file, callback){
			if(this.method !== 'POST')	return;
			if(arguments.length===1&&'function' == typeof arguments[0]){
				var callback = file,
					file = null;
			}
				multipart(this, file, callback);
			};
		this.Req._restGetParamFunc = this._restGetParam;
		this._restDefine(this._restMakeMid());
	};
RestReq.prototype = {
	_restParseUrl : function(){return url.parse(this.url);},
	_restGetPost :function(callback){
		var callback = callback || function(){}, 
			that = this,
			pdata = '';
		if(this.method !== 'POST')	return callback();
		this.on('data', function(chunk){pdata+=chunk});
		this.on('end', function(){
			that._restPostData = pdata;
			callback();
		})
	},
	_restMakeMid:function(){
		var that = this;
		return [
			{
				name:'_restParseUrl',
				get:that._restParseUrl		
			},
			{
				name : 'path',
				get : that.AnalyzeUrl
			},
			{
				name : 'ip',
				get : that._restGetIp
			},
			{
				name : 'referer',
				get : that._restGetReferer
			},
			{
				name : 'referrer',
				get : that._restGetReferer
			},
			{
				name : 'UserAgent',
				get : that._restGetUserAgent
			},
			{
				name : 'GetParam',
				get : that._restGetParam
			},
			{
				name : 'PostParam',
				get : that._restPostParam
			},
			{
				name : 'cookie',
				get : that._restGetCookie
			}
		];
	},
	AnalyzeUrl:function(url){
			var	url = url || this._restParseUrl.pathname,
				href = url.split('/')
				.filter(function(val){return val != ''})
			if(href.length === 0) href=['index','index']
			else if(href.length === 1) href.push('index');
			return href;
		},
	_restGetIp:function(){
		return this.socket && (this.socket.remoteAddress || (this.socket.socket && this.socket.socket.remoteAddress));	
	},
	_restGetReferer:function(){
		return this.headers['referer'] || this.headers['referrer'] || '';
	},
	_restGetUserAgent:function(){
		return this.headers['user-agent'] || '';
	},
	_restGetParam:function(query){
		var param = {}, 
			query = query || this._restParseUrl.query || '';
	   query.split('&')
			.filter(function(val){ return val != ''})
			.forEach(function(val){
				var ParamArray = val.split('=');
				if(param[ParamArray[0]]) param[ParamArray[0]] += ','+ decodeURIComponent(ParamArray[1]);
				else param[ParamArray[0]] = decodeURIComponent(ParamArray[1]);
			});
		return param;
	},
	_restPostParam:function(callback){
		if(this.method !== 'POST')	return {};
		return 	this._restGetParamFunc(this._restPostData);
	},	
	_restGetCookie:function(){
		 var cookie = this.headers.cookie || {};
		 if (!cookie) return cookie;
		 try {
			cookie = RestUtils.parseJSONCookies(RestUtils.parseCookie(cookie));
			return cookie;
		 }
		 catch(err){
			return {}
		 }
	},
	_restDefine:function(MidArray){
		var that = this;
		MidArray.forEach(function(value, i){
			Object.defineProperty(that.Req, value.name, {set:function(newValue){
				 value.name = newValue;
				 },get:function(){
					return value.get.call(this);
				 },enumerable:false});				
		})
	}
}
