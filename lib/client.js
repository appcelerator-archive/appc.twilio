const twilio = require('twilio');
const def = require('./../conf/default');
const pluralize = require('pluralize');

module.exports = function (config) {

	const client = new twilio.RestClient(config.sid, config.auth_token);

	return {
		createCall: createCall,
		createAddress: createAddress,
		createMessage: createMessage,
		query: query,
		updateAddress: updateAddress,
		find: {
			all: findAll,
			byId: findByID
		}
	}

	function findAll(Model, callback) {
		var key = pluralize(Model.name);

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
	}

	function findByID(Model, id, callback) {
		var key = pluralize(Model.name);

		if (!id) {
			callback(new Error('Missing required parameter "id"'));
		}
		client[key](id).get(function (err, call) {
			if (err) {
				callback(new Error(`Could not find ${Model.name} with ID: ${id}`));
			}
			if (!err) {
				var instance = Model.instance(call, true);
				callback(null, instance);
			}
		});
	}

	function query(Model, options, callback) {
		const instances = [];
		const key = pluralize(Model.name);

		client[key].list(options.where, function (err, data) {
			if (err) {
				callback(new Error("Could not make query request !"));
			}
			if (!err) {
				data[key].map((item) => {
					var instance = Model.instance(item, true);
					instances.push(instance);
				});

				callback(null, instances);
			}
		});
	}

	function createCall(Model, values, number, callback) {
		client.makeCall({
			to: values.to, // Any number Twilio can call
			from: number, // A number you bought from Twilio and can use for outbound communication
			url: 'https://demo.twilio.com/welcome/voice' // A URL that produces an XML document (TwiML) which contains instructions for the call

		}, (err, result) => {
			if (err) {
				callback(new Error('Could not make this call!'));
			}
			if (!err) {
				var instance = Model.instance(result, true);
				callback(null, instance);
			}
		});
	}

	function createAddress(Model, values, callback) {
		client.addresses.create(values, (err, result) => {
			if (err) {
				callback(new Error('Could not create this address'));
			}
			if (!err) {
				var instance = Model.instance(result, true);
				callback(null, instance);
			}
		});
	}

	function createMessage(Model, values, number, callback) {
		client.messages.create({
			to: values.to,
			from: number,
			body: values.body,
		}, (err, result) => {
			if (err) {
				callback(new Error('Could not send this message!'));
			}
			if (!err) {
				var instance = Model.instance(result, true);
				callback(null, instance);
			}
		});
	}

	function updateAddress(Model, id, doc, callback) {
		client.addresses(id).post(doc, function (err, address) {
			if (err) {
				callback(new Error('Could not update this model'));
			}
			if (!err) {
				var instance = Model.instance(address, true);
				callback(null, []);
			}
		});
	}
};
