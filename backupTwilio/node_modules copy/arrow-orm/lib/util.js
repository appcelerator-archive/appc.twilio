'use strict';
var logLevels = ['info', 'error', 'warn', 'debug', 'trace','fatal'];

/**
 * hook the logger to also call the transaction logger
 */
function hookLogger (logger, tx) {
	if (tx.log && !logger._hooked) {
		logger._hooked = true;
		logLevels.forEach(function (level) {
			var fn = logger[level];
			if (fn) {
				logger['_' + level] = fn;
				logger[level] = function () {
					fn.apply(logger, arguments);
					tx.log[level].apply(tx.log, arguments);
				};
			}
		});
	}
}

/**
 * unhook a previously installed logger hook
 */
function unhookLogger (logger) {
	if (logger._hooked) {
		logger._hooked = false;
		logLevels.forEach(function (level) {
			var fn = logger['_' + level];
			if (fn) {
				logger[level] = fn;
			}
		});
	}
}

/**
 * setup transaction logging for a given function
 */
function createTransactionLoggedDelegate (clazz, type, instance, name) {
	var fn = instance['wrapped' + name];
	// only wrap once, if wrapped, return fn
	if (fn) { return instance[name]; }
	instance['wrapped' + name] = instance[name];
	instance[name] = function () {
		// if we don't have a context, use the instance and re-invoke
		if (!this) { return instance[name].apply(instance, arguments); }
		// if we aren't invoking with an instance of our class, re-invoke
		if (!(this instanceof Object.getPrototypeOf(instance).constructor)) { return instance[name].apply(instance, arguments); }
		var args = arguments;
		var target = instance['wrapped' + name];
		var self = this;
		if (self && self.request && self.request.tx) {
			var tx = self.request.tx && self.request.tx.start(
					type + ':' + clazz.name + ':' + name,
					false,
					clazz.filename || 'generated',
					clazz.description || (clazz.name + ' ' + type)),
				logHooked;

			// if we have a logger, hook it to dispatch also into the tx logger
			if (self.logger) {
				hookLogger(self.logger, tx);
				logHooked = true;
			}

			// check to see if async and if so, dispatch through
			if (typeof (args[args.length - 1]) === 'function') {
				var callback = args[args.length - 1];
				args = Array.prototype.slice.call(args, 0, args.length - 1);
				tx.addArguments(args);
				args.push(function (err, result) {
					if (err) { tx.addError(err); }
					if (result) { tx.addResult(result); }
					tx.end();
					logHooked && unhookLogger(self.logger);
					callback(err, result);
				});
				return target.apply(this, args);
			} else {
				// no callback, just call it sync
				try {
					args.length && tx.addArguments(Array.prototype.slice.call(args));
					return target.apply(self, args);
				} finally {
					logHooked && unhookLogger(self.logger);
					tx.end();
				}
			}
		} else {
			// doesn't have transaction logging turned on, skip it
			return target.apply(self, args);
		}
	};
	return instance[name];
}

exports.createTransactionLoggedDelegate = createTransactionLoggedDelegate;
