 var path	= require('path');
var fs		= require('fs');

var module = module || {};

angular.module('sdk.moduleload', [])
    .factory('$module', ['$rootScope', '$timeout', '$http', '$q', '$templateCache', function ($rootScope, $timeout, $http, $q, $templateCache) {
    var factory = {};

    $rootScope.modules = {};

    factory.load = function(module, type, dir)
    {
		var html_path = path.join(dir, 'component.html');
		fs.exists(html_path, function(exists) {
			if(exists) {
				fs.readFile( html_path, function(err, data){
		            if (err) throw err;
				            
					$templateCache.put(html_path, data.toString());
					
					$rootScope.$apply(function () {
			            $rootScope.modules[type] = $rootScope.modules[type] || {};
		            	$rootScope.modules[type][module] = html_path;
			        });
				});
			}
		});
    }

    return factory;
}]);