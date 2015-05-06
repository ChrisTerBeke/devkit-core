var events = events || {};

var beforeSave = {};

angular.module('sdk.events', []).factory('$events', ['$rootScope', '$q', function ($rootScope, $q) {
	var factory = {};

	// factory.beforeSave = function(path, callbackFunction) {
	// 	beforeSave[path] = beforeSave[path] || [];
	// 	beforeSave[path].push($q(function(resolve, reject) {
	//     setTimeout(function() 
	//     {
	//     	var result = callbackFunction();
	    	
	//     	resolve(result);
	//     }, 1000);
	// 	}));
	// };

	factory.beforeSave = function(path, callbackFunction) {
		beforeSave[path] = beforeSave[path] || [];
		beforeSave[path].push($q(function(resolve, reject) {
			resolve(callbackFunction);
		}));
	};

    return factory;
}]);