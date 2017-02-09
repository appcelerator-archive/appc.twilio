const twilioAPIFactory = require('./../utils/twilioAPI');

exports.connect = function (next) {
	this.twilioAPI = twilioAPIFactory(this.config);
	next();
};
