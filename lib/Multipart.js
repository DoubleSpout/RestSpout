//settings 参数：
//settings={
//filedir:'/tmp/',//存放文件的临时地址，建议等上传完成以后再移动至保存文件夹
//onProgress:function(bytesReceived, bytesExpected){},
//onEnd:function(formidableobj){},
//onError:function(error, formidableobj){}
//}

var formidable = require('formidable'),
	onListen = {
		onProgress:function(bytesReceived, bytesExpected){},
		onEnd:function(formidableobj){},
		onError:function(error, formidableobj){}
	},
	Multipart = module.exports = function(req, filedir, callback){
		if(!(this instanceof arguments.callee)) return new arguments.callee(req, filedir, callback);
		formidable.IncomingForm.call(this, null);
		this.restFile = {};
		this.restParam = {};
		this.uploadDir = filedir || '/tmp/';
		if('function' == typeof callback) callback = {onEnd:callback};
		this._intial(req, this._serial(callback||{}));
	};
Multipart.prototype = {
	__proto__:formidable.IncomingForm.prototype,
	_serial:function(callback){
		var cb={}
		for(var j in onListen){
			cb[j] = callback[j] || onListen[j];
		}
		return cb;
	},
	_intial:function(req, callback){
		var that = this;
		this.on('progress', function(bytesReceived, bytesExpected){
			callback.onProgress(bytesReceived, bytesExpected);
		})
		.on('file', function(field, file) {
			that.restFile[field] = file
		})
		.on('field', function(name, value){
				if(that.restParam[name]) that.restParam[name] += ','+value;
				else that.restParam[name] = value;
			})
		.on('end', function(){
			callback.onEnd({
				param : that.restParam,
				file : that.restFile
			});
		})
		.on('error',function(err){
			callback.onError(err,{
				param : that.restParam,
				file : that.restFile
			});	
		});
		that.parse(req);
	}
}