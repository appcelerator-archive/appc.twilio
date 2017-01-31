const Arrow = require('arrow'),
	pluralize = require('pluralize');

/**
 * Finds all model instances.  A maximum of 1000 models are returned.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the models.
 */
exports.findAll = function findAll(Model, callback) {
	const key = pluralize(Model.name);

	client[key].list(function (err, data) {
		var instances = [];

		if (err) {
			callback(new Error("Could not get calls"));
		}

		if (!err) {
			data[key].map((item, index) => {
				var instance = Model.instance(item, true);
				instance.setPrimaryKey(index + 1);
				instances.push(instance);
			});

			callback(null, instances);
		}
	});
};
