var events = events || {};

var beforeSave = [];

angular.module('sdk.events', []).factory('$events', ['$rootScope', '$q', function ($rootScope, $q) {
	var factory = {};

	console.log('i was called!');

	factory.beforeSave = function(callbackFunction) {
		beforeSave.push($q(function(resolve, reject) {
	    setTimeout(function() 
	    {
	    	var result = callbackFunction();
	    	
	    	resolve(result);
	    }, 1000);
		}));
	};

    return factory;
}]);