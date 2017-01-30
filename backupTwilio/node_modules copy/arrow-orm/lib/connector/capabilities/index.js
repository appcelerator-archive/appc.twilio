var fs = require('fs'),
	path = require('path'),
	chalk = require('chalk');

/*
 Public API.
 */

exports.validateCapabilities = validateCapabilities;
/*
 * Generates tests based upon the capabilities you have specified.
 */
exports.generateTests = require('./generateTests');

/**
 * @class Arrow.Capabilities
 * Defines various connector specific capabilities; these are used by the validator to help developer's add new
 * functionality to their connectors.
 * @since 1.2.8
 */
var Capabilities = exports.Capabilities = {
	/**
	 * Specifies that the first time the connector is used, it will need to connect to a particular
	 * data source before it can be used. For example, the MySQL connector connects to a MySQL server.
	 */
	ConnectsToADataSource: 'ConnectsToADataSource',
	/**
	 * Define validation on your validation files to ensure you get the data you need to run.
	 * For example, a MongoDB connector could require a valid URL.
	 */
	ValidatesConfiguration: 'ValidatesConfiguration',
	/**
	 * Connectors can provide custom types of objects, such as a MongoDB ObjectID.
	 */
	AddsCustomTypes: 'AddsCustomTypes',
	/**
	 * Connectors can dynamically create models based upon loaded schema from their data sources.
	 */
	GeneratesModels: 'GeneratesModels',
	/**
	 * Connectors can contain static models, defined in their "models" directory.
	 */
	ContainsModels: 'ContainsModels',
	/**
	 * Enables a "create" method on this connector's models.
	 */
	CanCreate: 'CanCreate',
	/**
	 * Enables several methods such as findAll, findByID, or query on this connector's models.
	 */
	CanRetrieve: 'CanRetrieve',
	/**
	 * Enables an "update" method on this connector's models.
	 */
	CanUpdate: 'CanUpdate',
	/**
	 * Enables several methods such as delete and deleteAll on this connector's models.
	 */
	CanDelete: 'CanDelete',
	/**
	 * In addition to (or in place of) authenticating users in Arrow, the connector itself can validate a user
	 * when a request is made to one of the connector's exposed methods. This is done through the user of headers.
	 * For example, the Salesforce connector allows you to pass a Salesforce username, password, and token, or
	 * an access token. Then all queries are made as this provided user, allowing the connector to leverage Salesforce's
	 * access controls very easily.
	 */
	AuthenticatesThroughConnector: 'AuthenticatesThroughConnector'
};

/*
 Implementation.
 */

var validations = {
	ConnectsToADataSource: function (impl) {
		return impl.connect;
	},
	AddsCustomTypes: function (impl) {
		return impl.coerceCustomType && impl.getCustomType;
	},
	ValidatesConfiguration: function (impl) {
		return impl.fetchMetadata;
	},
	GeneratesModels: function (impl) {
		return impl.fetchSchema && impl.createModelsFromSchema;
	},
	ContainsModels: function (impl) {
		if (impl.models && Object.keys(impl.models).length > 0) {
			return true;
		}
		// If models is empty, it's probably because we are waiting for the connector to finish loading first.
		return impl.modelsDir && fs.readdirSync(impl.modelsDir)
				.filter(function (f) {
					return f.slice(-3) === '.js';
				}).length > 0;
	},
	CanCreate: function (impl) {
		return impl.create;
	},
	CanRetrieve: function (impl) {
		return impl.findByID || impl.findById || impl.findOne || impl.findAll || impl.query || impl.distinct;
	},
	CanUpdate: function (impl) {
		return impl.save || impl.upsert || impl.findAndModify;
	},
	CanDelete: function (impl) {
		return impl.delete || impl.deleteAll;
	},
	AuthenticatesThroughConnector: function (impl) {
		return impl.loginRequired && impl.login;
	}
};

function validateCapabilities(impl) {
	var connectorDir = path.resolve(path.join(impl.filename, '..', '..')),
		mightBeEmpty = Object.keys(impl).length <= 5 && impl.filename && impl.logger && impl.pkginfo && impl.defaultConfig && impl.capabilities !== undefined,
		failed = false;

	for (var i = 0; i < impl.capabilities.length; i++) {
		var capability = impl.capabilities[i];
		if (validations[capability] !== undefined) {
			if (!validations[capability](impl)) {
				failed = true;
				console.log('');
				console.log(chalk.green('The "' + chalk.underline(capability) + '" capability has been enabled, so we need to make a couple of changes:'));

				var templateDir = path.join(__dirname, 'templates', capability);

				crawlTemplates(connectorDir, templateDir);

				logIfExists(path.join(templateDir, 'notes.txt'));
			}
			else {
				mightBeEmpty = false;
			}
		}
	}

	if (failed) {
		console.log('');
		console.log(chalk.green('Please go take a look at the TODOs in these new files, then do an `' + chalk.bold('appc run') + '` or `' + chalk.bold('npm test') + '` to try out the new capabilities.'));
		console.log('');

		process.exit();
	}

	if (mightBeEmpty) {
		console.log('');
		console.log(chalk.red('This connector does not do much of anything at the moment.'));
		console.log(chalk.red('Why don\'t you take a look at the "' + chalk.underline('capabilities') + '" array in:'));
		console.log(chalk.red(path.join(connectorDir, 'lib', 'index.js')));
		console.log('');
	}
}

function crawlTemplates(connectorDir, templateDir, currentPath) {
	var lookIn = currentPath ? path.join(templateDir, currentPath) : templateDir,
		copyTo = currentPath ? path.join(connectorDir, currentPath) : connectorDir;

	if (!fs.existsSync(lookIn)) {
		return;
	}
	if (!fs.existsSync(copyTo)) {
		fs.mkdirSync(copyTo);
	}
	var children = fs.readdirSync(lookIn);
	for (var i = 0; i < children.length; i++) {
		var child = children[i];
		if (child[0] === '.') {
			continue;
		}
		var templateFile = path.join(lookIn, child);
		if (fs.statSync(templateFile).isDirectory()) {
			crawlTemplates(connectorDir, templateDir, currentPath ? path.join(currentPath, child) : child);
		}
		else if (child.slice(-3) === '.js') {
			var newFile = path.join(copyTo, child),
				relNewFile = currentPath ? path.join(currentPath, child) : child;
			if (!fs.existsSync(newFile)) {

				var newContent = fs.readFileSync(templateFile, 'UTF-8');
				fs.writeFileSync(newFile, newContent);

				var todos = (newContent.match(/TODO/g) || []).length,
					log = chalk.dim(' - ') + chalk.yellow('Created `' + chalk.underline(relNewFile) + '`');
				if (todos) {
					log += chalk.dim(' (contains ') + chalk.magenta(todos + ' TODOs') + chalk.dim(')');
				}
				console.log(log);
			}
		}
	}
}

function logIfExists(ref) {
	if (fs.existsSync(ref)) {
		console.log(chalk.green(fs.readFileSync(ref, 'UTF-8')));
	}
}
