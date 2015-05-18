var events = events || {};

var beforeSave = {};

angular.module('sdk.popup', []).factory('$popup', ['$rootScope', 'ngDialog', function ($rootScope, ngDialog) {
	var factory = {};

	factory.open = function(name, scope) {
		var dir = '';
		for (var i=0; i<angularModules.length; i++) {

			if (angularModules[i].module == name){
				var dir = angularModules[i].dir;
			} 
		}

		var html_path = path.join(dir, 'component.html');

		ngDialog.open({ 
			template: html_path,
			scope: scope
		});
	}

	factory.close = function() {
		ngDialog.closeAll();
	}

    return factory;
}]);