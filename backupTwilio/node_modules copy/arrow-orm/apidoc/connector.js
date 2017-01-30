/**
 * @class Arrow.Connector
 * A Connector allows your application to access data from an external source,
 * such as a MySQL database or cloud storage.
 *
 * **Note:** Some methods in this class are left unimplemented, which you can implement when
 * creating a Connector instance.
 *
 * To create an Arrow Connector programmatically, load the `arrow` module, then call the
 * [Connector.extend](Arrow.Connector.extend) method. Pass the method an object which implements
 * methods to access the data source (described below).
 *
 * Alternatively, you can generate a new Connector project to create a modular connector
 * that can be packaged and reused. For information, see the
 * [Arrow Connector guides](http://docs.appcelerator.com/platform/latest/#!/guide/Arrow_Connectors).
 *
 * To add an existing connector to the project, see
 * [Arrow Connector guides](http://docs.appcelerator.com/platform/latest/#!/guide/Add_a_Connector).
 *
 * ### Create a New Connector
 *
 * To create a connector, either in the application or in a connector project, you must pass an
 * implementation object to the [Connector.extend](Arrow.Connector.extend) method.  The object
 * implements the methods in this class as well as the Model methods below.
 * At minimum, you should implement the {@link #connect} method and the starred Model methods.
 *
 *     var Arrow = require('arrow');
 *     var Connector = Arrow.Connector.extend({
 * 	       connect: function (callback) {
 * 	           // Connect to the external data source
 *             callback();
 *         },
 * 	       create: function (Model, value, callback) {
 * 	           // Create a model
 *             var result;
 *             try {
 *                 result = Model.instance(values);
 *             } catch(e) {
 *                 callback(e);
 *             }
 *             callback(null, result);
 *         }, // more Model methods
 *     });
 *
 * #### Model Methods
 *
 * The following model methods may be defined in the implementation object.  Important methods
 * to implement basic functionality are starred:
 *
 *   * {@link Arrow.Model#count count}
 *   * {@link Arrow.Model#create create} *
 *   * {@link Arrow.Model#delete delete} *
 *   * {@link Arrow.Model#deleteAll deleteAll} *
 *   * {@link Arrow.Model#find find}
 *   * {@link Arrow.Model#findByID findByID} *
 *   * {@link Arrow.Model#findAll findAll} *
 *   * {@link Arrow.Model#query query} *
 *   * {@link Arrow.Model#save save} *
 *   * {@link Arrow.Model#upsert upsert}
 *
 * When implementing the Model methods, the first parameter will be the Model class,
 * followed by the Model's method parameters.  For example, the Model's `create(values, callback)`
 * method will have the `create: function (Model, values, callback)` method signature in the
 * implementation object.
 *
 * #### Unimplemented Methods
 *
 * The following methods are left unimplemented by the Connector class but may be implemented
 * when creating a new connector:
 *
 * * {@link #createModelsFromSchema}
 * * {@link #coerceCustomType}
 * * {@link #endRequest}
 * * {@link #fetchConfig}
 * * {@link #fetchMetadata}
 * * {@link #fetchSchema}
 * * {@link #getCustomType}
 * * {@link #login}
 * * {@link #loginRequired}
 * * {@link #postCreate}
 * * {@link #startRequest}
 *
 * You may also define a `constructor` function to execute some custom logic when the connector
 * is created. The new connector instance is the value passed to `this` in the function.
 * The constructor is not passed any arguments and does not return any values.
 *
 * #### Connect Lifecycle
 *
 * The connector instance will call the following methods to connect to the data source
 * before the server starts (if provided by the implementation):
 *
 * 1. {@link #fetchMetadata}
 * 2. {@link #fetchConfig}
 * 3. {@link #connect}
 * 4. {@link #fetchSchema}
 *
 * #### Request Lifecycle
 *
 * If a request requires a login or if you want to intercept the request before or after it
 * completes, you can implement the following methods:
 *
 * 1. {@link #startRequest}
 * 2. {@link #loginRequired}
 * 3. {@link #login}
 * 4. Connector makes the request.
 * 5. {@link #endRequest}
 */

/**
 * @event register
 * @static
 * Fired when a connector is registered. The callback will be passed the Connector instance.
 */

/**
 * @method createModelsFromSchema
 * Creates models from the schema object returned from the `fetchSchema` method. **Unimplemented.**
 */
/**
 * @method coerceCustomType
 * Determines if the model field can be implictly converted to the value.
 * If it can, you should set the model field to the converted value.
 * **Unimplemented.** Implement this method to support custom data types for model fields.
 * @since 1.2.8
 * @param {Arrow.Instance} instance An instance of one of the connector's models.
 * @param {Any} field Field value to validate.
 * @param {String} name Field name to coerce.
 * @param {Any} value Value to coerce.
 * @returns {Boolean} Returns `true` if the type can be implicitly converted else `false`.
 */
/**
 * @method endRequest
 * Request interceptor invoked after the request completes. **Unimplemented.**
 * Invoke the `next` function when the operation completes.
 * @param {String} name Name of the function that invoked the request.
 * @param {Array<Object>} args Arguments passed to the called function that invoked the request.
 * @param {Object} request Request object.
 * @param {Function} next Function to call after the operation completes.
 */
/**
 * @method fetchConfig
 * Retrieves the data source's configuration. Called when the {@link #connect} method is invoked.
 * **Unimplemented.** Invoke the callback after the operation is completed. Pass an object of
 * key-value pairs as the second argument to the callback function.
 * @param {Function} callback Callback function passed a Error object (or null if successful)
 * and the configuration object.
 */
/**
 * @method fetchMetadata
 * Retrieves the data source's metadata used to validate the configuration.
 * Called when the {@link #connect} method is invoked. **Unimplemented.**
 * Invoke the callback after the operation is completed. Pass the metadata object as the
 * second argument to the callback function.  In the metadata object,
 * set the `fields` property to an array of Arrow.Metadata object used to validate the
 * configuration object.
 * @param {Function} callback Callback function passed a Error object (or null if successful)
 * and the metadata object.
 */
/**
 * @method fetchSchema
 * Retrieves the data source's schema. Called when the {@link #connect} method is invoked
 * **Unimplemented.** Invoke the callback after the operation is completed.
 * @param {Function} callback Callback function passed a Error object (or null if successful)
 * and the schema object.
 */
 /**
  * @method getCustomType
  * Gets the field value based upon a custom type. **Unimplemented.**
  * @since 2.1.8
  * @param {Arrow.Instance} instance An instance of one of the connector's models.
  * @param {Object} field Field value to validate.
  * @param {String} name Field name to coerce.
  * @param {Any} value Value to coerce.
  * @returns {Object} Returns an instance of your custom type.
  */
/**
 * @method loginRequired
 * Determines if a login is required to make a request to the data source.
 * **Unimplemented.** Define in the implementation object when creating a connector.
 * If a login is required, the {@link #login} function must be implemented too.
 * @param {Object} request Request object.
 * @param {Function} callback Callback passed an error message (or null if successful) and a boolean
 * indicating if a login is required (`true`) or not (`false`).
 */
/**
 * @method login
 * Logins to the data source to make a request if a login is required. **Unimplemented.**
 * Define in the implementation object when creating a connector.
 * Invoke the `next` function when the operation completes.
 * The {@link #loginRequired} function must be implemented to determine if
 * login should be called or not.
 * @param {Object} request Request object.
 * @param {Object} response Response object.
 * @param {Function} next Function to call after the operation completes.
 */
/**
 * @method postCreate
 * Executes logic after the connector is created but before it is returned. **Unimplemented.**
 * The new connector instance is the value passed to `this` in the function. The function is not
 * passed any arguments and does not need to return any values.
 */
/**
 * @method startRequest
 * Request interceptor invoked before the request is initiated and the {@link #login} method is invoked.
 * **Unimplemented.** Invoke the `next` function when the operation completes.
 * @param {String} name Name of the function that invoked the request.
 * @param {Array<Object>} args Arguments passed to the called function that invoked the request.
 * @param {Object} request Request object.
 * @param {Function} next Function to call after the operation completes.
 */

/**
 * @property config
 * @type Object
 * Key-value pairs describing the configuration settings of the connector.
 */
/**
 * @property connected
 * @type Boolean
 * Returns `true` if the connector is connected to its data source.
 */
/**
 * @property enabled
 * @type Boolean
 * Returns `true` if the connector is enabled.
 */
/**
 * @property metadata
 * @type Object
 * Object with only the `fields` key assigned to an array of Arrow.Metadata objects
 * to validate the configuration object.
 */
/**
 * @property models
 * @type Array<Arrow.Model>
 * Models that use the connector.
 */
/**
 * @property name
 * @type String
 * Name of the connector.
 */
/**
 * @property version
 * @type String
 * Version of the connector.
 */
