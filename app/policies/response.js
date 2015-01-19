var _ = require('lodash');
var ApiResponse = function(res) {
	this.valid = true;
	this.res = res;
	this.error = null;
	this.errorStatus = 500;
	this.data = {};
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
	this.send = function(err) {
		var status = 200;
		var body = null;
		if(!this.valid) {
			status = this.errorStatus;
			if(_.isObject(this.error)) {
				body = JSON.stringify({error: this.error});
			}
			else {
				body = JSON.stringify({error: {message: this.error}});
			}
		}
		else {
			body = JSON.stringify({
				data: this.data
			});
		}
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