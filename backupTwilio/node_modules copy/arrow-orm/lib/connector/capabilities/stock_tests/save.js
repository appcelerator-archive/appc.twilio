var assert = require('assert'),
	async = require('async');

exports.save = function (connector, suiteConfig, testConfig, next) {
	var Model = suiteConfig.model;
	Model.connector = connector;

	var tasks = [];

	this._handleInserts(Model, tasks, testConfig, true);

	tasks.push(function (next) {
		var updates = testConfig.update;
		for (var key in updates) {
			if (updates.hasOwnProperty(key)) {
				testConfig.inserted[key] = updates[key];
			}
		}
		Model.save(testConfig.inserted, function (err, result) {
			assert.ifError(err);
			testConfig.check && testConfig.check(result);
			next();
		});
	});

	this._cleanupInserts(Model, tasks, testConfig);

	async.series(tasks, next);
};
