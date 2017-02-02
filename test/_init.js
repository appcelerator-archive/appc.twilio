'use strict';

const test = require('ava').test;
const path = require('path');

//Get the default configuration
var default_conf = getConfiguration();
default_conf.port = (Math.random() * 40000 + 1200) | 0;

//require and instantiate Arrow...
var Arrow = require('arrow'),
	server = new Arrow(default_conf),
	connector = server.getConnector('appc.twilio');

test.cb.before(t => {

	server.start();

	t.end();
});

/**
 * Returns a configuration object, from ./conf/default.js
 */
function getConfiguration() {
	var files = path.join(process.cwd(), 'test/');
	var def_conf = files + 'conf/default.js';
	return require(def_conf);
}

global.Arrow = Arrow;
global.server = server;
global.connector = connector;
