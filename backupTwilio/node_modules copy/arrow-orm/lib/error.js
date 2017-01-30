/**
 * @class Arrow.ORMError
 * JavaScript Error object that will capture a stack trace.
 */
/**
 * @method ORMError
 * Constructor.
 * @param {String} message Error message.
 * @returns {Arrow.ORMError}
 */
/**
 * @property message
 * @type String
 * Error message.
 */
/**
 * @property stack
 * @type String
 * Stack trace captured when the error occurred.
 */
function ORMError(message) {
	this.message = message;
	Error.captureStackTrace(this, ORMError);
}


ORMError.prototype = Object.create(Error.prototype);
ORMError.prototype.constructor = ORMError;

/**
 * @class Arrow.ValidationError
 * JavaScript Error object that will capture a stack trace.
 */
/**
 * @method ValidationError
 * Constructor.
 * @param {String} field Field name that failed validation.
 * @param {String} message Error message.
 * @returns {Arrow.ValidationError}
 */
/**
 * @property message
 * @type String
 * Error message.
 */
/**
 * @property stack
 * @type String
 * Stack trace captured when the error occurred.
 */
/**
 * @property field
 * @type String
 * Name of the field that failed validation.
 */
function ValidationError(field, message) {
	this.field = field;
	ORMError.call(this,message);
}


ValidationError.prototype = Object.create(ORMError.prototype);
ValidationError.prototype.constructor = ValidationError;


exports.ValidationError = ValidationError;
exports.ORMError = ORMError;
