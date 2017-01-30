var assert = require('assert'),
	async = require('async');

exports.upsert = function (connector, suiteConfig, testConfig, next) {
	var Model = suiteConfig.model;
	Model.connector = connector;

	var tasks = [];

	this._handleInserts(Model, tasks, testConfig);

	tasks.push(function (next) {
		Model.upsert(testConfig.inserted.getPrimaryKey(), testConfig.inserted, function (err, result) {
			assert.ifError(err);
			testConfig.check && testConfig.check(result);
			next();
		});
	});

	this._cleanupInserts(Model, tasks, testConfig);

	async.series(tasks, next);
};
