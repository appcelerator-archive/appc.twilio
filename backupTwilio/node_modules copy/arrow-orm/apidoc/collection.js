/**
 * @class Arrow.Collection
 * An Arrow Collection is an array of Arrow Model instances with some logic
 * to manipulate the models.
 *
 * To create a Collection, load the `arrow` module, then use the Collection constructor
 * to create an instance of a Collection. You can optionally pass in an array of Model instances
 * to initialize the collection.
 *
 *     var Arrow = require('arrow'),
 *         Collection = Arrow.Collection,
 *         myModels = new Collection(ModelClass, [Model instances...]);
 *     ...
 *     var lastModel = myModels.slice(-1);
 *
 */
/**
 * @constructor
 * Creates a model collection. You may pass no parameters, the model class and
 * array of model instances or just an array of model instances.
 * @param {Arrow.Model} [model] Model class to associate with the collection.
 * @param {Array<Arrow.Instance>} [instances] Array of model instances.
 */
/**
 * @property {Arrow.Model} model
 * Model class associated with the collection.
 */