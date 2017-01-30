/* global it */
var async = require('async'),
	assert = require('assert'),
	path = require('path'),
	fs = require('fs'),
	tests = mashModulesTogether(path.join(__dirname, 'stock_tests'));

module.exports = function (connector, testModule) {
	return function () {
		var dir = path.join(path.dirname(testModule.filename), 'capabilities');

		if (!fs.existsSync(dir)) {
			it('should have a test/capabilities dir', function () {
				assert(false, 'test/capabilities does not exist');
			});
			return;
		}

		var suiteConfig = mashModulesTogether(dir);
		Object.keys(suiteConfig).forEach(function (key) {
			var testConfig = suiteConfig[key],
				label = 'should ' + key;

			if (!tests[key]) {
				return;
			}

			if (testConfig.iterations !== undefined && testConfig.iterations > 1) {
				label += ' ' + testConfig.iterations + ' times';
			}

			it(label, function (next) {
				var count = testConfig.iterations || 1;
				tests[key](connector, suiteConfig, testConfig, function oneFinished(err) {
					if (err) {
						next(err);
					}
					else if (--count > 0) {
						tests[key](connector, suiteConfig, testConfig, oneFinished);
					}
					else {
						next();
					}
				});
			});
		});
	};
};

function mashModulesTogether(dir) {
	var conglomerate = {},
		filenames = fs
			.readdirSync(dir)
			.filter(function (filename) {
				return filename[0] !== '.' && filename.slice(-3) === '.js';
			});

	for (var i = 0; i < filenames.length; i++) {

		var filename = filenames[i],
			currentConfig = require(path.join(dir, filename));

		for (var key in currentConfig) {
			if (currentConfig.hasOwnProperty(key)) {
				conglomerate[key] = currentConfig[key];
			}
		}

		if (currentConfig.only === true) {
			return currentConfig;
		}

	}

	return conglomerate;
}