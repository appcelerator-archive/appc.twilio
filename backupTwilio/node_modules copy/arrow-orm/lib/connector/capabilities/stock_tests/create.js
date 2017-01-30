var assert = require('assert'),
	async = require('async');

exports.create = function (connector, suiteConfig, testConfig, next) {
	var Model = suiteConfig.model;
	Model.connector = connector;

	var tasks = [];

	this._handleInserts(Model, tasks, testConfig, true, true);
	this._cleanupInserts(Model, tasks, testConfig);

	async.series(tasks, next);
};
