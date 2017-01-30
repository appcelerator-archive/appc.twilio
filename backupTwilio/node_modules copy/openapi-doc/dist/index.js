'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PATH_PATTERN = new RegExp(/(?:\{[\w]+\})/g);

var HTTP_STATUS_CODES = {
	100: 'Continue',
	101: 'Switching Protocols',
	102: 'Processing',
	200: 'OK',
	201: 'Created',
	202: 'Accepted',
	203: 'Non-Authoritative Information',
	204: 'No Content',
	205: 'Reset Content',
	206: 'Partial Content',
	207: 'Multi-Status',
	300: 'Multiple Choices',
	301: 'Moved Permanently',
	302: 'Moved Temporarily',
	303: 'See Other',
	304: 'Not Modified',
	305: 'Use Proxy',
	307: 'Temporary Redirect',
	400: 'Bad Request',
	401: 'Unauthorized',
	402: 'Payment Required',
	403: 'Forbidden',
	404: 'Not Found',
	405: 'Method Not Allowed',
	406: 'Not Acceptable',
	407: 'Proxy Authentication Required',
	408: 'Request Time-out',
	409: 'Conflict',
	410: 'Gone',
	411: 'Length Required',
	412: 'Precondition Failed',
	413: 'Request Entity Too Large',
	414: 'Request-URI Too Large',
	415: 'Unsupported Media Type',
	416: 'Requested Range Not Satisfiable',
	417: 'Expectation Failed',
	418: 'I\'m a teapot',
	422: 'Unprocessable Entity',
	423: 'Locked',
	424: 'Failed Dependency',
	425: 'Unordered Collection',
	426: 'Upgrade Required',
	428: 'Precondition Required',
	429: 'Too Many Requests',
	431: 'Request Header Fields Too Large',
	500: 'Internal Server Error',
	501: 'Not Implemented',
	502: 'Bad Gateway',
	503: 'Service Unavailable',
	504: 'Gateway Time-out',
	505: 'HTTP Version Not Supported',
	506: 'Variant Also Negotiates',
	507: 'Insufficient Storage',
	509: 'Bandwidth Limit Exceeded',
	510: 'Not Extended',
	511: 'Network Authentication Required'
};

/**
 * A Swagger builder utility that annotates a method to be used in express.
 */

var Swagger = function () {
	/**
  * Construct a Swagger builder.
  */
	function Swagger() {
		_classCallCheck(this, Swagger);

		this.currentPath = null;
		this.doc = {
			swagger: '2.0',
			info: {
				description: '',
				version: '1.0.0',
				title: ''
			},
			host: 'localhost',
			basePath: '/',
			schemes: ['http'],
			paths: {},
			securityDefinitions: {},
			definitions: {}
		};
		this._actions = {};
		this._securityHandlers = {};
	}

	/**
  * Returns the Swagger 2.0 API document.
  * @public
  * @return {object} Swagger 2.0 API document.
  */


	_createClass(Swagger, [{
		key: 'apidoc',
		value: function apidoc() {
			return this.doc;
		}

		/**
   * Returns the security handlers associated with the API endpoints.
   * @public
   * @return {object} Map of callback functions.
   */

	}, {
		key: 'info',


		/**
   * Adds information for the API.
   * @public
   * @param {string} title - the title of the API
   * @param {string} version - the version of the API
   * @param {string} description - the description of the API
   * @return {object} The current object (this).
   */
		value: function info(title, version, description) {
			if (typeof title !== 'string') {
				if (!title) {
					throw new Error('missing required argument: title');
				}
				throw new Error('illegal argument: title');
			}
			if (typeof version !== 'string') {
				if (!version) {
					throw new Error('missing required argument: version');
				}
				throw new Error('illegal argument: version');
			}
			if (typeof description !== 'string') {
				if (!description) {
					throw new Error('missing required argument: description');
				}
				throw new Error('illegal argument: description');
			}
			this.doc.info = {
				title: title,
				version: version,
				description: description
			};
			return this;
		}

		/**
   * Adds a Security Definition.
   * @public
   * @param {object} options - The options for this security definition. See: http://swagger.io/specification/#securityDefinitionsObject
   * @param {function} handler - The middleware handler for enforcing this security definition.
   * @return {object} The current object (this).
   */

	}, {
		key: 'securityDefinition',
		value: function securityDefinition(name, options, handler) {
			if (!name) {
				throw new Error('missing required argument: name');
			}
			if (typeof name !== 'string') {
				throw new Error('illegal argument: name');
			}

			if (!options.type) {
				throw new Error('missing required argument: options.type');
			}
			if (typeof options.type !== 'string') {
				throw new Error('illegal argument: options.type');
			}

			// Check the additional keys
			var keys = Object.keys(options).filter(function (k) {
				return k !== 'type' && k !== 'description';
			});
			if (options.type === 'basic') {
				if (keys.length) {
					throw new Error('illegal options for basic security: ' + keys.join(', '));
				}
			} else if (options.type === 'apiKey') {
				if (keys.indexOf('in') === -1) {
					throw new Error('missing required argument: options.in');
				}

				if (keys.indexOf('name') === -1) {
					throw new Error('missing required argument: options.name');
				}

				keys = keys.filter(function (k) {
					return k !== 'in' && k !== 'name';
				});
				if (keys.length) {
					throw new Error('illegal options for apiKey security: ' + keys.join(', '));
				}
			} else if (options.type === 'oauth2') {
				throw new Error('oauth2 support not added.');
			} else {
				throw new Error('invalid security type: ' + options.type);
			}

			this.doc.securityDefinitions = this.doc.securityDefinitions || {};

			if (this.doc.securityDefinitions[name]) {
				throw new Error('duplicate security definition: ' + name);
			}

			this._securityHandlers[name] = handler;
			this.doc.securityDefinitions[name] = options;
			return this;
		}

		/**
   * Adds a Security Requirement.
   * @public
   * @param {array} definitionNames - An array of the Security Definition names to apply.
   *                                  If empty then no security.
   * @return {object} The current object (this).
   */

	}, {
		key: 'security',
		value: function security() {
			var _this = this;

			var definitionNames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

			if (!Array.isArray(definitionNames)) {
				definitionNames = [definitionNames];
			}
			var sec = definitionNames.map(function (d) {
				if (!_this.doc.securityDefinitions[d]) {
					throw new Error('no such security definition: ' + d);
				}
				return _defineProperty({}, d, []);
			});

			if (this.currentPath) {
				// Per operation override
				if (this.currentPath.security) {
					throw new Error('security requirement already defined for this api');
				}
				this.currentPath.security = sec;
			} else {
				// Global security
				if (this.doc.security) {
					throw new Error('global security requirement already defined.');
				}
				this.doc.security = sec;
			}
			return this;
		}
	}, {
		key: 'nosecurity',
		value: function nosecurity() {
			this.security([]);
			return this;
		}

		/**
   * Adds a schema definition to the API.
   * @public
   * @param {string} name - The type name.
   * @param {object} spec - A valid JSON schema draft 04 spec.
   * @return {object} The current object (this).
   */

	}, {
		key: 'schema',
		value: function schema(name, spec) {
			if (!name) {
				throw new Error('missing required argument: name');
			}
			if (typeof name !== 'string') {
				throw new Error('illegal argument: name');
			}
			if (!spec) {
				throw new Error('missing required argument: spec');
			}
			if ((typeof spec === 'undefined' ? 'undefined' : _typeof(spec)) !== 'object') {
				throw new Error('illegal argument: spec');
			}
			this.doc.definitions[name] = spec;
			return this;
		}

		/**
   * Creates a post method for the specified path.  Use Express style routing.
   * @public
   * @param {string} path - The path for the method.
   * @example
   * swagger.post('/foos');
   * @return {object} The current object (this).
   */

	}, {
		key: 'post',
		value: function post(path) {
			return this._verb('post', path);
		}

		/**
   * Creates a get method for the specified path.  Use Express style routing.
   * @public
   * @param {string} path - The path for the method.
   * @example
   * swagger.get('/foos/:fooId');
   * @return {object} The current object (this).
   */

	}, {
		key: 'get',
		value: function get(path) {
			return this._verb('get', path);
		}

		/**
   * Creates a put method for the specified path.  Use Express style routing.
   * @public
   * @param {string} path - The path for the method.
   * @example
   * swagger.put('/foos/:fooId');
   * @return {object} The current object (this).
   */

	}, {
		key: 'put',
		value: function put(path) {
			return this._verb('put', path);
		}

		/**
   * Creates a delete method for the specified path.  Use Express style routing.
   * @public
   * @param {string} path - The path for the method.
   * @example
   * swagger.delete('/foos/:fooId');
   * @return {object} The current object (this).
   */

	}, {
		key: 'delete',
		value: function _delete(path) {
			return this._verb('delete', path);
		}

		/**
   * Creates a patch method for the specified path.  Use Express style routing.
   * @public
   * @param {string} path - The path for the method.
   * @example
   * swagger.patch('/foos/:fooId');
   * @return {object} The current object (this).
   */

	}, {
		key: 'patch',
		value: function patch(path) {
			return this._verb('patch', path);
		}

		/**
   * Sets the summary for the current method.
   * @public
   * @param {string} summary - The summary for the method.
   * @example
   * swagger.delete('/foos/:fooId').summary('Deletes foo.');
   * @return {object} The current object (this).
   */

	}, {
		key: 'summary',
		value: function summary(_summary) {
			if (!this.currentPath) {
				throw new Error('need to start a method using one of: get, post, put, or delete.');
			}
			this.currentPath.summary = _summary;
			return this;
		}

		/**
   * Sets the description for the current method.
   * @public
   * @param {string} description - The description for the method.
   * @example
   * swagger.delete('/foos/:fooId').description('Deletes foo');
   * @return {object} The current object (this).
   */

	}, {
		key: 'description',
		value: function description(_description) {
			if (!this.currentPath) {
				throw new Error('need to start a method using one of: get, post, put, or delete.');
			}
			this.currentPath.description = _description;
			return this;
		}

		/**
   * Sets the operationId for the current method.
   * @public
   * @param {string} name - The name for the method.
   * @example
   * swagger.delete('/foos/:fooId').operationId('DeleteFoo');
   * @return {object} The current object (this).
   */

	}, {
		key: 'operationId',
		value: function operationId(name) {
			if (!this.currentPath) {
				throw new Error('need to start a method using one of: get, post, put, or delete.');
			}
			this.currentPath.operationId = name;
			return this;
		}

		/**
   * Adds a tag to the current method.
   * @public
   * @param {string} name - The name for the method.
   * @example
   * swagger.delete('/foos/:fooId').tag('foo');
   * @return {object} The current object (this).
   */

	}, {
		key: 'tag',
		value: function tag(_tag) {
			if (!this.currentPath) {
				throw new Error('need to start a method using one of: get, post, put, or delete.');
			}
			if (!this.currentPath.tags) {
				this.currentPath.tags = [];
			}
			this.currentPath.tags.push(_tag);
			return this;
		}

		/**
   * Convenience method to add a body parameter.
   * @public
   * @param {string} type - The type of object (not full ref), e.g. "Type"
   * @param {string} description - The description of the body parameter.
   * @example
   * swagger.post('/foo').body('Foo', 'Foo to create');
   * @return {object} The current object (this).
   */

	}, {
		key: 'body',
		value: function body(type, description) {
			return this.parameter({
				in: 'body',
				name: 'body',
				description: description,
				required: true,
				schema: {
					$ref: '#/definitions/' + type
				}
			});
		}

		/**
   * Adds a parameter to the current method.
   * @public
   * @param {object} param - A valid Swagger parameter specification.
   * @example
   * swagger.post('/foo').param({
   *	 in: 'path',
   *	 name: 'foo',
   *	 type: 'string',
   *	 description: 'My foo param'});
   * @return {object} The current object (this).
   */

	}, {
		key: 'parameter',
		value: function parameter(param) {
			if (!this.currentPath) {
				throw new Error('need to start a method using one of: get, post, put, or delete.');
			}
			if (!param) {
				throw new Error('missing required argument: param');
			}
			if ((typeof param === 'undefined' ? 'undefined' : _typeof(param)) !== 'object') {
				throw new Error('invalid argument: param');
			}
			if (!param.name) {
				throw new Error('invalid argument: param.name');
			}
			if (!param.in) {
				throw new Error('invalid argument: param.in');
			}
			if (['body', 'formData', 'header', 'path', 'query'].indexOf(param.in) < 0) {
				throw new Error('invalid argument param.in: ' + param.in);
			}
			if (param.type) {
				// swagger specification data types
				if (['string', 'number', 'integer', 'boolean', 'array', 'file'].indexOf(param.type) < 0) {
					throw new Error('invalid argument param.type: ' + param.type);
				}
				if (param.type === 'file') {
					if (param.in !== 'formData') {
						throw new Error('invalid argument param.type of "file" must have param.in of "formData"');
					}
					if (this.currentPath.consumes.indexOf('multipart/form-data') < 0 && this.currentPath.consumes.indexOf('application/x-www-form-urlencoded') < 0) {
						throw new Error('invalid argument param.type of "file" consumes of "multipart/form-data" or "application/x-www-form-urlencoded"');
					}
				}
			} else if (!param.schema) {
				throw new Error('param.schema required when param.type is not defined');
			}

			if (param.in === 'path') {
				param.required = true; // must be true

				// find path parameter
				var found = -1;
				var varname = '{' + param.name + '}';
				var match = void 0;
				PATH_PATTERN.lastIndex = 0; // < this is horrible

				match = PATH_PATTERN.exec(this._action.path);
				while (match !== null) {
					if (found = match.indexOf(varname) >= 0) {
						break;
					}
					match = PATH_PATTERN.exec(this._action.path);
				}
				if (found < 0) {
					throw new Error('expected path parameter :' + param.name);
				}
			}
			this.currentPath.parameters.push(param);
			return this;
		}

		/**
   * Adds a response to the current method.
   * @public
   * @param {number} code - The HTTP response code.
   * @param {string} [description] - Optional description.
   *				 If not specified, uses the standard HTTP response string.
   * @param {string} [type] - Optional type (to be used in $ref).
   * @param {boolean} [isArray] - Optional indicator that the repsonse is an array of {type}.
   * @return {object} The current object (this).
   */

	}, {
		key: 'response',
		value: function response(code, description, type, isArray) {
			if (!this.currentPath) {
				throw new Error('need to start a method using one of: get, post, put, or delete.');
			}
			if (!code) {
				throw new Error('invalid argument: code');
			}
			code += ''; // must be a string

			// check that all path parameters are defined before defining responses.
			this._checkPathParametersAreDefined();

			if (!description && HTTP_STATUS_CODES.hasOwnProperty(code)) {
				description = HTTP_STATUS_CODES[code];
			}
			this.currentPath.responses[code] = {
				description: description
			};
			if (type) {
				if (isArray === true) {
					this.currentPath.responses[code].schema = {
						type: 'array',
						items: {
							'$ref': '#/definitions/' + type
						}
					};
				} else {
					this.currentPath.responses[code].schema = {
						'$ref': '#/definitions/' + type
					};
				}
			}
			return this;
		}

		/**
   * Applies an action to the described endpoint to be used with express.
   * @public
   * @param {function(request: object, response: object)} handler - The express handler function.
   * @return {object} The current object (this).
   */

	}, {
		key: 'action',
		value: function action(handler) {
			if (!this.currentPath) {
				throw new Error('need to start a method using one of: get, post, put, or delete.');
			}
			if (this._actions.hasOwnProperty(this._action.path)) {
				if (this._actions[this._action.path].hasOwnProperty(this._action.verb)) {
					throw new Error('the action is already defined for: ' + this._action.verb + ' ' + this._action.path);
				}
			} else {
				this._actions[this._action.path] = {};
			}
			this._actions[this._action.path][this._action.verb] = handler;
			return this;
		}

		/**
   * Internally creates a method for verb and path.
   * @private
   * @param {string} verb - The HTTP verb.
   * @param {string} path - The path in Express format.
   * @return {object} The current object (this).
   */

	}, {
		key: '_verb',
		value: function _verb(verb, path) {
			if (!path || typeof path !== 'string') {
				throw new Error('invalid argument: path');
			}
			path = this._rewriteEndpointFromExpressToSwagger(path);
			if (!this.doc.paths.hasOwnProperty(path)) {
				this.doc.paths[path] = {};
			}
			this._action = {
				path: path,
				verb: verb,
				handler: null
			};
			this.currentPath = this.doc.paths[path][verb] = {
				summary: '',
				description: '',
				operationId: '',
				consumes: [],
				produces: [],
				parameters: [],
				responses: {}
			};

			return this;
		}

		/**
   * Internally checks to see if a parameter exists for the current method.
   * @private
   * @param {string} name - The name of the parameter.
   * @return {boolean} True if the parameter exists.
   */

	}, {
		key: '_parameterExists',
		value: function _parameterExists(name) {
			return this.currentPath.parameters.findIndex(function (a) {
				return a.name === name;
			}) >= 0;
		}

		/**
   * Internally checks that all path parameters are defined.  Throws if not defined.
   * @private
   * @return
   */

	}, {
		key: '_checkPathParametersAreDefined',
		value: function _checkPathParametersAreDefined() {
			if (PATH_PATTERN.test(this._action.path)) {
				var match = void 0;
				PATH_PATTERN.lastIndex = 0; // < this is horrible
				while (match = PATH_PATTERN.exec(this._action.path)) {
					match = match[0].replace(/[\{\}]/g, '');
					if (!this._parameterExists(match)) {
						throw new Error('expected path parameter :' + match);
					}
				}
			}
		}

		/**
   * Rewrites path string from /path/:id to /path/{id}.  Internally, the paths are
   * stored as Swagger.
   * @private
   * @return {string} Rewritten string
   */

	}, {
		key: '_rewriteEndpointFromExpressToSwagger',
		value: function _rewriteEndpointFromExpressToSwagger(endpoint) {
			var EXP_PATH_PATTERN = new RegExp(/(?::[\w]+)/g);
			var match = EXP_PATH_PATTERN.exec(endpoint);
			while (match !== null) {
				endpoint = endpoint.replace(match[0], '{' + match[0].replace(':', '') + '}');
				match = EXP_PATH_PATTERN.exec(endpoint);
			}
			return endpoint;
		}

		/**
   * Rewrites path string from /path/{id} to /path/:id.
   * @public
   * @param {string} str - The swagger path to convert.
   * @return {string} Rewritten string
   */

	}, {
		key: 'securityHandlers',
		get: function get() {
			return this._securityHandlers;
		}

		/**
   * Returns the actions associated with the API endpoints.
   * @public
   * @return {object} Map of [path][verb].
   */

	}, {
		key: 'actions',
		get: function get() {
			return this._actions;
		}
	}], [{
		key: 'endpointToExpress',
		value: function endpointToExpress(str) {
			var match = PATH_PATTERN.exec(str);
			while (match != null) {
				str = str.replace(/{/, ':').replace(/}/, '');
				match = PATH_PATTERN.exec(str);
			}
			return str;
		}
	}]);

	return Swagger;
}();

exports = module.exports = Swagger;