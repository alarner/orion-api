var _ = require('lodash');
var ApiResponse = function(res) {
	this.valid = true;
	this.res = res;
	this.error = null;
	this.data = {};
	this.setError = function(err) {
		this.valid = false;
		this.error = err;
		return this;
	};
	this.setData = function(data) {
		this.data = data;
		return this;
	};
	this.send = function(err) {
		var status = 200;
		var body = null;
		if(!valid) {
			if(_.isObject(this.error)) {
				if(this.error.hasOwnProperty('status')) {
					status = this.error.status;
				}
				body = JSON.stringify(this.error);
			}
			else {
				status = 500;
				body = this.error;
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