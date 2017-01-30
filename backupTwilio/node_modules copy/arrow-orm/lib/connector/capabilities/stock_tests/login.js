var assert = require('assert'),
	async = require('async');

exports.login = function (connector, suiteConfig, testConfig, next) {
	var tasks = [],
		origRequireSessionLogin = connector.config.requireSessionLogin;

	// Simulate running in the browser.
	connector.baseContext = connector;

	/*
	 Define some utility we will use throughout.
	 */
	var savedHeaders = {};

	function saveHeader(name, value) {
		savedHeaders[name.toLowerCase()] = value;
	}

	/*
	 If headers are missing, or bad headers are provided, we should require login.
	 */
	tasks.push(function checkLoginRequiredWithoutHeaders(next) {
		connector.request = {};
		connector._promise = true;
		connector.loginRequired(assertLoginRequired(true, next));
	});
	tasks.push(function checkLoginRequiredWithEmptyHeaders(next) {
		connector.request = {headers: {}};
		connector._promise = true;
		connector.loginRequired(assertLoginRequired(true, next));
	});

	/*
	 If requireSessionLogin:true and any of the auth headers are missing, login should fail.
	 */
	tasks.push(function checkLoginWithoutHeaders(next) {
		connector.config.requireSessionLogin = true;
		connector.login({}, {}, assertError(next));
	});
	tasks.push(function checkLoginWithEmptyHeaders(next) {
		connector.config.requireSessionLogin = true;
		connector.login({headers: {}}, {}, assertError(next));
	});
	tasks.push(function checkLoginWithEmptyHeaders(next) {
		connector.config.requireSessionLogin = true;
		var headers = {};
		// Provide all but one of the headers.
		for (var i = 0; i < -1 + testConfig.authenticationHeaders.length; i++) {
			var header = testConfig.authenticationHeaders[i];
			headers[header] = 'a-value';
		}
		connector.login({headers: headers}, {}, assertError(next));
	});

	/*
	 If requireSessionLogin:false and any of the auth headers are missing, login should carry on.
	 */
	tasks.push(function checkLoginWithoutHeaders(next) {
		connector.config.requireSessionLogin = false;
		connector.login({}, {}, assertSuccess(next));
	});
	tasks.push(function checkLoginWithEmptyHeaders(next) {
		connector.config.requireSessionLogin = false;
		connector.login({headers: {}}, {}, assertSuccess(next));
	});
	tasks.push(function checkLoginWithEmptyHeaders(next) {
		connector.config.requireSessionLogin = false;
		var headers = {};
		// Provide all but one of the headers.
		for (var i = 0; i < -1 + testConfig.authenticationHeaders.length; i++) {
			var header = testConfig.authenticationHeaders[i];
			headers[header] = 'a-value';
		}
		connector.login({headers: headers}, {}, assertSuccess(next));
	});

	/*
	 If bad auth headers are provided, login should error.
	 */
	tasks.push(function checkLoginWithBadAuthHeaders1(next) {
		connector.config.requireSessionLogin = true;
		connector.login({headers: testConfig.badAuthentication}, {}, assertError(next));
	});
	tasks.push(function checkLoginWithBadAuthHeaders2(next) {
		connector.config.requireSessionLogin = false;
		connector.login({headers: testConfig.badAuthentication}, {}, assertError(next));
	});

	/*
	 If good auth headers are provided, login should succeed.
	 */
	tasks.push(function checkLoginWithGoodAuthHeaders1(next) {
		connector.config.requireSessionLogin = true;
		connector.login({headers: testConfig.goodAuthentication}, fakeResponse(saveHeader), assertSuccess(next));
	});
	tasks.push(function checkLoginWithGoodAuthHeaders2(next) {
		connector.config.requireSessionLogin = false;
		connector.login({headers: testConfig.goodAuthentication}, fakeResponse(saveHeader), assertSuccess(next));
	});

	/*
	 If good tokens are provided, we shouldn't require login.
	 */
	tasks.push(function checkLoginRequiredWithAccessTokens1(next) {
		connector.config.requireSessionLogin = true;
		connector.request = {headers: savedHeaders};
		connector._promise = true;
		connector.loginRequired(assertLoginRequired(false, next));
	});
	tasks.push(function checkLoginRequiredWithAccessTokens2(next) {
		connector.config.requireSessionLogin = false;
		connector.request = {headers: savedHeaders};
		connector._promise = true;
		connector.loginRequired(assertLoginRequired(false, next));
	});

	/*
	 Put things back the way we found them.
	 */
	tasks.push(function restoreOriginalSettings(next) {
		connector.config.requireSessionLogin = origRequireSessionLogin;
		next();
	});

	async.series(tasks, next);
};

function assertLoginRequired(expected, next) {
	return function (err, required) {
		assert.ifError(err);
		assert.equal(required, expected, 'loginRequired unexpected response');
		next();
	};
}

function assertError(next) {
	return function (err) {
		assert(err, 'expected an error to be returned');
		next();
	};
}

function assertSuccess(next) {
	return function (err) {
		assert.ifError(err);
		next();
	};
}

function fakeResponse(saveHeader) {
	return {
		header: saveHeader
	};
}