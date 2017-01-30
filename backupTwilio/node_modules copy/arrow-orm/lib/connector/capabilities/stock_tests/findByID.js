var assert = require('assert'),
	async = require('async');

exports.findByID = function (connector, suiteConfig, testConfig, next) {
	var Model = suiteConfig.model;
	Model.connector = connector;

	var tasks = [];

	this._handleInserts(Model, tasks, testConfig, true);

	tasks.push(function (next) {
		if (!testConfig.inserted) {
			return next('Not inserted, so we cannot find it!');
		}
		Model.findByID(testConfig.inserted.getPrimaryKey(), function (err, result) {
			assert.ifError(err);
			testConfig.check && testConfig.check(result);
			next();
		});
	});

	this._cleanupInserts(Model, tasks, testConfig);

	async.series(tasks, next);
};
