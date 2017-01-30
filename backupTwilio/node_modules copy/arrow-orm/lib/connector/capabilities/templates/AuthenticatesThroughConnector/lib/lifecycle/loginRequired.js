// TODO: Reference the module to connect to your data store.
var yourDataStore = /*require('your-data-store')*/{};

/**
 * loginRequired checks to see if the current req for this connector requires the user to login.
 */
exports.loginRequired = function (req, next) {
	var headers = req.headers || {};
	// TODO: If the user doesn't provide a specific header, which you specify, such as "accesstoken"...
	if (!headers.accesstoken) {
		// ... then they need to login!
		next(null, true);
	}
	else {
		// TODO: Optionally make sure that the headers they provided are valid: 
		yourDataStore.ensureAccessTokenIsGood(headers, function (err, isGood) {
			// If we hit an error, or if it isn't good, then they need to login.
			if (err || !isGood) {
				return next(null, true);
			}
			// Otherwise, we're good to go!
			else {
				next(null, false);
			}
		});
	}
};