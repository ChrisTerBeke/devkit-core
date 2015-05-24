window.ondragover = function(e) { e.preventDefault(); return false };
window.ondrop = function(e) { e.preventDefault(); return false };

require('events').EventEmitter.defaultMaxListeners = 0;

var app = angular.module('app', ['module.core', 'module.modules']);
var modules = ['ng'];
var angularModules = [];

angular.element(document).ready(function() {
    setTimeout(function()
    { 
        modules.push('app');
        angular.bootstrap(document, modules);
    }, 200);
});

// whitelist for iframe and assets
app.config(function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist(window.CONFIG.whitelist);
});

app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('sdk');
});

app.config(function ($controllerProvider) {
    app.controller = function (name, constructor) {
        $controllerProvider.register(name, constructor);
        return (this);
    }
});

// add Bearer token to $http requests
app.run(['$rootScope', '$injector', function($rootScope, $injector) {
    $injector.get("$http").defaults.transformRequest = function(data, headersGetter) {
        if ($rootScope.user) {
        	headersGetter()['Authorization'] = "Bearer " + window.localStorage.access_token;
        }
        if (data) {
            return angular.toJson(data);
        }
    };
}]);

// run all angular defined modules
app.run(['$rootScope', '$timeout', '$templateCache', '$module', function($rootScope, $timeout, $templateCache, $module) {
    $rootScope.modules = {};
    for(i in angularModules) {
        var result = angularModules[i];
        $module.load(result.module, result.type, result.dir);
    }
}]);

if(typeof angular !== 'undefined' && window.DEBUG) {
	console.timeEnd("Angular loaded");
}