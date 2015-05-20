angular.module('sdk.menu', []).factory('$menu', ['$rootScope', function ($rootScope) {
	
	var factory = {};
	
    factory.setConfig = function(config) {
	  	$rootScope.menuConfig = config;
    };
	
	return factory;
	
}]);