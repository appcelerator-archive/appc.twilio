var assert = require('assert'),
	async = require('async');

exports['delete'] = function (connector, suiteConfig, testConfig, next) {
	var Model = suiteConfig.model;
	Model.connector = connector;

	var tasks = [];

	this._handleInserts(Model, tasks, testConfig, true);
	this._cleanupInserts(Model, tasks, testConfig, true);

	if ((testConfig.testDeleteAll === undefined || testConfig.testDeleteAll === true) && Model.deleteAll) {
		this._handleInserts(Model, tasks, testConfig, true);
		tasks.push(function (next) {
			if (!testConfig.inserted) {
				throw new Error('This test needed to create an instance, but nothing was inserted.');
			}

			Model.deleteAll(function (err) {
				assert.ifError(err);
				next();
			});
		});
	}

	async.series(tasks, next);
};
