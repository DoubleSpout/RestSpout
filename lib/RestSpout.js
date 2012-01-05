_restConfig = require('../config/config');
var RestReq = require('./RestReq')(),
	RestRes = require('./RestRes')();
module.exports = {
	AnalyzeUrl:RestReq.AnalyzeUrl,
	config:_restConfig
	};