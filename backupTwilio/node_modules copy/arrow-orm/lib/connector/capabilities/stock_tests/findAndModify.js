var assert = require('assert'),
	async = require('async');

exports.findAndModify = function (connector, suiteConfig, testConfig, next) {
	var Model = suiteConfig.model;
	Model.connector = connector;

	var tasks = [];

	this._handleInserts(Model, tasks, testConfig);

	tasks.push(function (next) {
		Model.findAndModify(testConfig.query, testConfig.update, function (err, result) {
			assert.ifError(err);
			testConfig.check && testConfig.check(result);
			next();
		});
	});

	this._cleanupInserts(Model, tasks, testConfig);

	async.series(tasks, next);
};
