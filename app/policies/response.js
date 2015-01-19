var _ = require('lodash');
var ApiResponse = function(res) {
	this.valid = true;
	this.res = res;
	this.error = null;
	this.errorStatus = 500;
	this.data = {};
	this.metadata = {};
	this.setError = function(err, status) {
		this.valid = false;
		this.error = err;
		if(status) this.errorStatus = status;
		return this;
	};
	this.setData = function(data) {
		this.data = data;
		return this;
	};
	this.setMetadata = function(metadata) {
		_.merge(this.metadata, metadata);
	};
	this.send = function(err) {
		var status = 200;
		var body = null;
		var bodyObj = {
			metadata: this.metadata
		};
		if(!this.valid) {
			status = this.errorStatus;
			if(_.isObject(this.error)) {
				bodyObj.error = this.error;
			}
			else {
				bodyObj.error = {message: this.error};
			}
		}
		else {
			bodyObj.data = this.data;
		}

		body = JSON.stringify(bodyObj);

		res.writeHead(status, {
			'Content-Length': body.length,
			'Content-Type': 'text/json'
		});
		res.end(body);
	};
}
module.exports = function(req, res, model, config, cb) {
	res.api = new ApiResponse(res);
	cb();
};