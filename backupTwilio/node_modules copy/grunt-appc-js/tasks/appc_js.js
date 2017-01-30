/*
 * grunt-appc-js
 * https://github.com/ingo/grunt-appc-js
 *
 * Copyright (c) 2015 Ingo Muschenetz
 * Licensed under the MIT license.
 */

'use strict';

var extendGruntPlugin = require('extend-grunt-plugin');
var packpath = require('packpath');
var path = require('path');
var _ = require('lodash');

module.exports = function (grunt) {

	grunt.registerMultiTask('appcJs', 'Linting and style checks for Appcelerator JavaScript', function () {

		var source = this.data;
		if (this.data.src) {
			source = this.data.src;
		}

		// there is likely a better way to specify the path to the files
		var optionsJscs = {
			src: source,
			options: _.omit(this.options({
				config: 'node_modules/grunt-appc-js/.jscsrc',
				reporter: require('jscs-stylish').path,
			}), 'globals')
		};

		var optionsRetire = {
			js: source,
			node: ['.'],
			options: {
				packageOnly: false
			}
		};

		var jsHintConfig = {
			browser: true,
			curly: true,
			eqeqeq: true,
			eqnull: true,
			expr: true,
			immed: true,
			indent: 4,
			latedef: false,
			newcap: true,
			noarg: true,
			nonew: true,
			undef: true,
			unused: false,
			trailing: true,
			loopfunc: true,
			proto: true,
			node: true,
			'-W104': true,
			'-W068': true,
			globals: {
				after      : false,
				afterEach  : false,
				before     : false,
				beforeEach : false,
				describe   : false,
				it         : false,
				Titanium   : false,
				Ti         : false
			}
		};

		var optionsJsHint = {
			src: source,
			options: _.omit(_.merge(this.options(),
				{reporter: require('jshint-stylish')},
				jsHintConfig), 'fix')
		};

		// have to require the specific task, as there is no "main" in package.json
		var jscs = require('grunt-jscs/tasks/jscs');
		var jshint = require('grunt-contrib-jshint/tasks/jshint');
		var retire = require('grunt-retire/tasks/retire');

		// Creates a target on grunt, that can be run later
		extendGruntPlugin(grunt, jscs, {
			'jscs.src' : optionsJscs
		});

		extendGruntPlugin(grunt, jshint, {
			'jshint.src' : optionsJsHint
		});

		extendGruntPlugin(grunt, retire, {
			'retire.js' : optionsRetire
		});

		// Runs the subtasks
		grunt.task.run('jshint:src', 'jscs:src', 'retire:js');

	});

};
