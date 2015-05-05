// require('nw.gui').Window.get().showDevTools();

// local dirname
// var dirname = require('path').join( require('./js/util.js').dirname, '..' );

// prevent default behavior from changing page on dropped file
window.ondragover = function(e) { e.preventDefault(); return false };
window.ondrop = function(e) { e.preventDefault(); return false };

var app = angular.module('app', ['module.core', 'module.modules']);
var modules = ['app'];

var angularModules = [];

angular.element(document).ready(function() {
    console.log(modules);
    require('nw.gui').Window.get().showDevTools();
    angular.bootstrap(document, modules);
});

// whitelist for iframe and assets
app.config(function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist(window.AUTH.whitelist);
});

app.config(function ($controllerProvider) {
    // app.controller = $controllerProvider.register;

    app.controller = function (name, constructor)
    {
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
app.run(['$rootScope', '$timeout', '$templateCache', function($rootScope, $timeout, $templateCache) {
    // console.log(angularModules, angularModules.size());

    $rootScope.modules = {};
    
    $timeout(function() {
        console.log(angularModules);
        for(i in angularModules) {
            // angularModules[i];
            var result = angularModules[i];

            $templateCache.put(result.html_path, result.data);

            $rootScope.modules[result.type] = $rootScope.modules[result.type] || {};
            $rootScope.modules[result.type][result.module] = result.html_path;
            console.log('function', angularModules[i]);
        }
    }, 1000);

    
    // angularModules.forEach(function(callback) {
    //     console.log('something loaded', callback);
    //     callback();
    // });
}]);

if(typeof angular !== 'undefined' && window.DEBUG) {
	console.timeEnd("Angular loaded");
}