/*
 * grunt-appc-js
 * https://github.com/ingo/grunt-appc-js
 *
 * Copyright (c) 2015 Ingo Muschenetz
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	var source = ['Gruntfile.js', 'tasks/*.js', '<%= nodeunit.tests %>'];

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: source,
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			}
		},
		jscs: {
			options: {
				config: '.jscsrc',
				reporter: require('jscs-stylish').path
			},
			src: source
		},
		retire: {
			js: source,
			node: ['.'],
			options : {
				packageOnly: false
			}
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ['tmp']
		},

		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js']
		},

		bump: {
			options: {
				files: ['package.json'],
				commitFiles: ['package.json'],
				pushTo: 'origin'
			}
		}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['clean', 'nodeunit']);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['jshint', 'jscs', 'retire', 'test']);

};
