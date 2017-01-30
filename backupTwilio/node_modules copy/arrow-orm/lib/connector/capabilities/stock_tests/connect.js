var assert = require('assert'),
	async = require('async');

exports.connect = function (connector, suiteConfig, testConfig, next) {
	var tasks = [],
		originalConfig = connector.config;

	if (connector.connected) {
		tasks.push(function (next) {
			connector.disconnect(function (err) {
				assert.ifError(err);
				next();
			});
		});
	}

	if (testConfig.badConfig) {
		tasks.push(function (next) {
			connector.config = testConfig.badConfig;
			connector.connect(function (err) {
				assert(err, 'expected an error to be thrown when connecting with a bad config');
				next();
			});
		});
	}
	if (testConfig.badConfigs) {
		testConfig.badConfigs.forEach(function (badConfig) {
			tasks.push(function (next) {
				connector.config = badConfig;
				connector.connect(function (err) {
					assert(err, 'expected an error to be thrown when connecting with a bad config');
					next();
				});
			});
		});
	}

	if (testConfig.goodConfig) {
		tasks.push(function (next) {
			connector.config = testConfig.goodConfig;
			connector.connect(function (err) {
				assert.ifError(err);
				connector.disconnect(function (err) {
					assert.ifError(err);
					connector.disconnect(next);
				});
			});
		});
	}
	if (testConfig.goodConfigs) {
		testConfig.goodConfigs.forEach(function (goodConfig) {
			tasks.push(function (next) {
				connector.config = goodConfig;
				connector.connect(function (err) {
					assert.ifError(err);
					connector.disconnect(function (err) {
						assert.ifError(err);
						connector.disconnect(next);
					});
				});
			});
		});
	}

	tasks.push(function (next) {
		connector.config = originalConfig;
		connector.connect(function (err) {
			assert.ifError(err);
			next();
		});
	});

	async.series(tasks, next);
};
