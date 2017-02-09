const twilio = require('twilio');
const def = require('./../../conf/default');
const pluralize = require('pluralize');

module.exports = function (config) {

	const client = new twilio.RestClient(config.sid, config.auth_token);

	return {
		createCall: createCall,
		createAddress: createAddress,
		createMessage: createMessage,
		createOutgoingCallerId: createOutgoingCallerId,
		createQueue: createQueue,
		query: query,
		updateAddress: updateAddress,
		updateOutgoingCallerId: updateOutgoingCallerId,
		updateQueue: updateQueue,
		deleteById: deleteById,
		find: {
			all: findAll,
			byId: findByID
		}
	}

	function findAll(Model, callback) {
		const key = pluralize(Model.name);

		client[key].list(function (err, data) {
			const instances = [];

			if (err) {
				callback(new Error("Could not get calls"));
			}

			data[key].map((item, index) => {
				const instance = Model.instance(item, true);
				instance.setPrimaryKey(index + 1);
				instances.push(instance);
			});

			callback(null, instances);
		});
	}

	function findByID(Model, id, callback) {
		const key = pluralize(Model.name);
		console.log(id);
		if (!id) {
			callback(new Error('Missing required parameter "id"'));
		}
		client[key](id).get(function (err, call) {
			// invalid id
			if (err) {
				callback(new Error(`Could not find ${Model.name} with ID: ${id}`));
			}
			// if valid id is passed
			if (!err) {
				callback(null, Model.instance(call, true));
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
			data[key].map((item) => {
				instances.push(Model.instance(item, true));
			});

			callback(null, instances);
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
			callback(null, Model.instance(result, true));
		});
	}

	function createAddress(Model, values, callback) {
		client.addresses.create(values, (err, result) => {
			if (err) {
				callback(new Error('Could not create this address'));
			}
			callback(null, Model.instance(result, true));
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
			callback(null, Model.instance(result, true));
		});
	}

	function createQueue(Model, values, number, callback) {
		client.queues.create({
			friendlyName: values.friendlyName || ""
		}, (err, result) => {
			if (err) {
				callback(new Error('Could not create this queue!'));
			}
			if (!err) {
				var instance = Model.instance(result, true);
				callback(null, instance);
			}
		});
	}

	function createOutgoingCallerId(Model, values, number, callback) {
		client.outgoingCallerIds.create({
			friendlyName: values.friendlyName || number,
			phoneNumber: number
		}, (err, result) => {
			if (err) {
				callback(new Error('Could not create this caller id!'));
			}
			callback(null, Model.instance(result, true));
		});
	}

	function updateAddress(Model, id, doc, callback) {
		client.addresses(id).post(doc, function (err, address) {
			if (err) {
				callback(new Error('Could not update this model'));
			}
			//TODO check this out - upsert
			const instance = Model.instance(address, true);
			callback(null, []);
		});
	}

	function updateOutgoingCallerId(Model, id, doc, callback) {
		client.outgoingCallerIds(id).update({
			friendlyName: doc
		}, function (err, callerId) {
			if (err) {
				callback(new Error('Could not update this item'));
			}
			callback(null, []);
		});
	}

	function updateQueue(Model, id, doc, callback) {
		client.queues(id).update({
			maxSize: doc
		}, function (err, queue) {
			if (err) {
				callback(new Error('Could not update this item'));
			}

			callback(null, []);
		});
	}

	function deleteById(Model, id, callback) {
		const key = pluralize(Model.name);

		if (!id) {
			callback(new Error('Missing required parameter "id"'));
		}
		client[key](id).delete(function (err, data) {
			if (err) {
				callback(new Error('Could not delete this item'));
			}

			callback(null, data);
		});
	}

};
