var _ = require('lodash'),
	assert = require('assert'),
	async = require('async');

exports.query = function (connector, suiteConfig, testConfig, next) {
	var Model = suiteConfig.model;
	Model.connector = connector;

	var tasks = [];

	this._handleInserts(Model, tasks, testConfig);

	var queries = _.isArray(testConfig.query) ? testConfig.query : [testConfig.query];
	for (var i = 0; i < queries.length; i++) {
		var query = queries[i];
		tasks.push(function (next) {
			Model.query(this.query, function (err, results) {
				assert.ifError(err);
				testConfig.check && testConfig.check(results);
				next();
			});
		}.bind({query: query}));
	}

	this._cleanupInserts(Model, tasks, testConfig);

	async.series(tasks, next);
};
