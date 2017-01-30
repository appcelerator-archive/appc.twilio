/**
 * @class Arrow.Instance
 * An instance of an Arrow Model is one data record in the Model API.
 * Use the Arrow Instance API to manage your model data.
 *
 * To create an Arrow Model instance, call the Model object's [instance()](Arrow.Model.instance)
 * method
 * and pass it data you want to set on the model instance.
 *
 *     var Arrow = require('arrow'),
 *         Model = Arrow.Model,
 *         UserModels = Model.getModel('user');
 *     ...
 *     var newModel = UserModels.instance({first_name: 'John', last_name: 'Doe'});
 *     newModel.save(function (err, result) {
 * 	       if (!err) {
 * 	           Arrow.logger.info(result);
 *         } else {
 * 	           Arrow.logger.error(error);
 *         }
 *     });
 */
