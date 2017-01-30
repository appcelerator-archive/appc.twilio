var Arrow = require('arrow');

/**
 * Gets the field value based upon a custom type.
 * @param {Arrow.Instance} instance An instance of one of this connector's models.
 * @param {Object} field Field value to validate.
 * @param {String} name Field name to coerce.
 * @param {Any} value Value to coerce.
 * @returns {Object} Returns an instance of your custom type.
 */
exports.getCustomType = function (instance, field, name, value) {
	var type = (typeof value).toLowerCase();
	// TODO: based on the field.type, return an instance of your custom type.
};
