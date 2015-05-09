"use strict";
  
function sdkPlugin() {}

module.exports = sdkPlugin; // we'll probably use requirejs? to load plugins for the sdk

sdkPlugin.init = function(sdk) {

	sdk.addModelFromAssets('assets/cube.stl'); // load a model from app assets, will be model 0
	sdk.addModelFromApi(43043, 'RANDOM_FILE_HASH'); // load a model from the api, will be model 1
	
	sdk.rotateModel(0, 90, 90, 90); // rotate model 0 90 degrees in each direction
	sdk.moveModel(1, 10, 10, 10); // move model 1 10 mm in each direction

}

sdkPlugin.on = function(sdk) {

	sdk.on('modelAdded', function(event, model) {
		console.log(model); // do a console log when a model is added
	});
  
};