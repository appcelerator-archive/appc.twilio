var Arrow = require('arrow');

/**
 * Fetches metadata describing your connector's proper configuration.
 * @param {Arrow.Instance} instance An instance of one of this connector's models.
 * @param {Any} field Field value to validate.
 * @param {String} name Field name to coerce.
 * @param {Any} value Value to coerce.
 * @returns {Boolean} Returns `true` if the type can be implicitly converted else `false`.
 */
exports.coerceCustomType = function coerceCustomType(instance, field, name, value) {
	var type = (typeof value).toLowerCase();
	// TODO: Coerce the type to your custom type (note that it might already be).
	return false;
};
