exports.disconnect = function (next) {
	// Note: Our current context, aka "this", is a reference to your connector.
	var self = this;
	
	next();
};
