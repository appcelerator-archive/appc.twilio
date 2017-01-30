var Arrow = require('arrow');

// TODO: Rename "yourModel" (and this file) to whatever you want.
module.exports = Arrow.Model.extend('yourModel', {
	fields: {
		// TODO: Customize these fields.
		first_name: {type: String, required: true},
		last_name: {type: String},
		email: {type: String}
	}
});