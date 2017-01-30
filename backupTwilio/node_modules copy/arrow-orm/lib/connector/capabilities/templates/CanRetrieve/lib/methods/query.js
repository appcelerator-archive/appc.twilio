// TODO: Reference the module to connect to your data store.
var yourDataStore = /*require('your-data-store')*/{},
	Arrow = require('arrow'),
	_ = require('lodash');

/**
 * Queries for particular model records.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {ArrowQueryOptions} options Query options.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the model records.
 * @throws {Error} Failed to parse query options.
 */
exports.query = function (Model, options, callback) {
	// TODO: Translate the Arrow style query fields below to line up with your data store.
	var query = {
		/**
		 * A dictionary of the fields to include, such as { first_name: 1 }
		 */
		sel: Model.translateKeysForPayload(options.sel),
		/**
		 * A dictionary of the fields to exclude, such as { last_name: 0 }
		 */
		unsel: Model.translateKeysForPayload(options.unsel),
		/**
		 * A dictionary of fields to search by, ignoring keys that aren't specified in our model, and including "id",
		 * such as { first_name: 'Daws%', last_name: 'Toth' }
		 */
		where: _.pick(Model.translateKeysForPayload(options.where), Model.payloadKeys().concat(['id'])),
		/**
		 * A dictionary of fields to order by, with a direction, such as { first_name: 1, last_name: -1 } where 1 is
		 * ascending and -1 is descending.
		 */
		order: Model.translateKeysForPayload(options.order),
		/**
		 * A number indicating how far to skip through the results before returning them, such as 0 or 100, as well
		 * as a limit on how many to return, such as 10 or 20. Alternatively, use options.page and options.per_page.
		 * Arrow translates these for you.
		 *
		 * For example, a skip of 50 and a limit of 10 is equivalent to a page of 5 and a per_page of 10.
		 */
		skip: options.skip,
		limit: options.limit
	};

	// TODO: Find the matching results for this Model from your data store. 
	yourDataStore.query(query, function (err, results) {
		if (err) {
			return callback(err);
		}

		// TODO: Instantiate each result.
		var array = [];
		for (var c = 0; c < results.length; c++) {
			var instance = Model.instance(results[c], true);
			instance.setPrimaryKey(String(results[c].id));
			array.push(instance);
		}
		// TODO: Turn the array of instances in to a collection.
		callback(null, new Arrow.Collection(Model, array));
	});
};
