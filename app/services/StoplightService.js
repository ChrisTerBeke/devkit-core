angular.module('sdk.stoplight', [])
    .factory('$stoplight', ['$rootScope', '$http', '$timeout', '$q', function ($rootScope, $http, $timeout, $q) {   
	var factory = {};

    factory.minimize = function(){
		var gui = require('nw.gui');
		var win = gui.Window.get();
		win.minimize();
	}
	factory.close = function(){
		var gui = require('nw.gui');
		var win = gui.Window.get();
		win.close();
	}
	factory.zoom = function(){
		var gui = require('nw.gui');
		var win = gui.Window.get();
		win.maximize();
		
		if( typeof $rootScope.maximized == 'undefined' ) 
		{
			$rootScope.maximized = true;
		} 
		else 
		{
			$rootScope.maximized = !$rootScope.maximized;
		}
	}

    return factory;
}]);