// TODO: Reference the module to connect to your data store.
var yourDataStore = /*require('your-data-store')*/{};

/**
 * login is called only if loginRequired calls next with the args (null, true). It looks at the current req, and
 * either logs the user in (based on credentials provided in headers) or returns an error. It can return a session
 * token via a res header so that future requests don't have to provide credentials.
 */
exports.login = function (req, res, next) {
	var headers = req.headers || {},
		username = headers.username,
		password = headers.password;

	// TODO: If we've gotten here, they haven't provided a token. If they don't provide credentials, then we can't login.
	if (!headers.username || !headers.password) {
		if (this.config.requireSessionLogin) {
			return next('Authentication is required. Please pass these headers: username and password; or accessToken.');
		}
		else {
			return next();
		}
	}

	// TODO: Authenticate the user's credentials.
	var self = this;
	yourDataStore.authenticateTheUser(username, password, function (err, result) {
		// TODO: If the authentication fails, then we'll show an error to the user. 
		if (err) {
			return next(err);
		}

		// TODO: Note on the controller (its state is specific to this req) who logged in.
		self.loggedInUser = result;
		// TODO: Optionally send back an access token that can be used instead of credentials in the future.
		res.header('accessToken', result.accessToken);

		// Let the controller carry on with the method that has been invoked:
		return next();
	});
};