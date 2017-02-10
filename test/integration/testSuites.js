const config = require('../server/config.js');

const serverFactory = require('../server/serverFactory.js');
serverFactory(config, serverStartedCallback);

function serverStartedCallback() {
	console.log('Server started!');
	
	require('./findAll.integration.js');
	require('./findByID.integration');
	require('./query.integration');
	require('./applicationWorkflow.integration');
	require('./create.integration');
	require('./delete.integration');
}
