// TODO: Reference the module to connect to your data store.
var Arrow = require('arrow');
//const client = require('./../client');

/**
 * Finds all model instances.  A maximum of 1000 models are returned.
 * @param {Arrow.Model} Model The model class being updated.
 * @param {Function} callback Callback passed an Error object (or null if successful) and the models.
 */
exports.findAll = function findAll(Model, callback) {
	var client = Model.connector.twilio;
	var body = "Test SMS";

	client.messages.create({
		to: "+359899982932",
		from: "+16467625508",
		body: body,
	}, function (err, message) {
		console.log(message);
	});
	//console.log(client.getClient());
	// TODO: Find all results for this Model from your data store. Arrow defaults to a limit of 1000 results.
	// yourDataStore.findAll(Model.name, function (err, results) {
	// 	if (err) {
	// 		return callback(err);
	// 	}

	// 	// TODO: Instantiate each result.
	// 	var array = [];
	// 	for (var c = 0; c < results.length; c++) {
	// 		var instance = Model.instance(results[c], true);
	// 		instance.setPrimaryKey(String(results[c].id));
	// 		array.push(instance);
	// 	}

	// 	// Turn the array of instances in to a collection, and return it.
	// 	callback(null, new Arrow.Collection(Model, array));

	// });

	callback(null, body);
};