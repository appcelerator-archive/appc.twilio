var assert = require('assert'),
	async = require('async');

exports.distinct = function (connector, suiteConfig, testConfig, next) {
	var Model = suiteConfig.model;
	Model.connector = connector;

	var tasks = [];

	this._handleInserts(Model, tasks, testConfig);

	tasks.push(function (next) {
		Model.distinct(testConfig.distinct, testConfig.query || {}, function (err, results) {
			assert.ifError(err);
			testConfig.check && testConfig.check(results);
			next();
		});
	});

	this._cleanupInserts(Model, tasks, testConfig);

	async.series(tasks, next);
};
