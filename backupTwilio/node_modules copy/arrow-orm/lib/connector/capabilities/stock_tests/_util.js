var assert = require('assert'),
	_ = require('lodash');

/**
 * Handles the insert permutations from the test config.
 */
exports._handleInserts = function (Model, tasks, testConfig, required, checked) {
	if (!testConfig.insert) {
		if (required) {
			throw new Error('This test needs to create an instance, but no "insert" object was defined in the test.');
		}
		else {
			return;
		}
	}
	tasks.push(function (next) {
		Model.create(testConfig.insert, function (err, result) {
			assert.ifError(err);
			testConfig.inserted = result;
			if (checked) {
				if (_.isArray(testConfig.insert)) {
					for (var i = 0; i < result.length; i++) {
						checked && testConfig.check && testConfig.check(result[i]);
					}
				}
				else {
					testConfig.check && testConfig.check(result);
				}
			}
			next();
		});
	});
};

/**
 * Cleans up after the inserts task.
 */
exports._cleanupInserts = function (Model, tasks, testConfig, required) {
	tasks.push(function (next) {
		if (!testConfig.inserted) {
			if (required) {
				throw new Error('This test needed to create an instance, but nothing was inserted.');
			}
			else {
				return next();
			}
		}
		var toDelete = testConfig.inserted;
		if (_.isArray(testConfig.inserted)) {
			toDelete = toDelete.map(function (instance) {
				return instance.getPrimaryKey();
			});
		}
		Model.delete(toDelete, function (err) {
			assert.ifError(err);
			next();
		});
	});
};
