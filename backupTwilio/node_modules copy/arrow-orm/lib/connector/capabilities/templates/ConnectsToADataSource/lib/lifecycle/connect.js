// TODO: Reference the module to connect to your data store.
var yourDataStore = /*require('your-data-store')*/{};

/**
 * Connects to your data store; this connection can later be used by your connector's methods.
 * @param next
 */
exports.connect = function (next) {
	// Note: Our current context, aka "this", is a reference to your connector.
	var self = this;
	// TODO: Connect to your data source, and then call `next();`!
	yourDataStore.connect(this.config, function (err, connection) {
		if (err) {
			return next(err);
		}
		// Note: now your methods can access this.connection!
		self.connection = connection;
		next();
	});
};
