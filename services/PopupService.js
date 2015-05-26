var events = events || {};

var beforeSave = {};

angular.module('sdk.popup', []).factory('$popup', ['$rootScope', 'ngDialog', function ($rootScope, ngDialog) {
	var factory = {};
	
	factory.open = function(name, scope) {
	
		$rootScope.$emit('service.popup.open', name);
		
		var dir = '';
		for (var i=0; i<angularModules.length; i++) {

			if (angularModules[i].module == name && angularModules[i].type == 'popup'){
				var dir = angularModules[i].dir;
			} 
		}

		var html_path = path.join(dir, 'component.html');

		ngDialog.open({
			preCloseCallback: function(){
				$rootScope.$apply(function(){
					$rootScope.$emit('service.popup.close', open);
				});
			},
			template: html_path,
			className: 'popup-' + name,
			scope: scope
		});
		
		open = name;
	}

	factory.close = function() {
		ngDialog.closeAll();
	}

    return factory;
}]);