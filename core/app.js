// require('nw.gui').Window.get().showDevTools();

// local dirname
// var dirname = require('path').join( require('./js/util.js').dirname, '..' );

// prevent default behavior from changing page on dropped file
window.ondragover = function(e) { e.preventDefault(); return false };
window.ondrop = function(e) { e.preventDefault(); return false };

var app = angular.module('app', ['module.core', 'module.modules']);
var modules = ['ng'];

var angularModules = [];

angular.element(document).ready(function() {
    require('nw.gui').Window.get().showDevTools();

    setTimeout(function()
    { 
        modules.push('app');
        angular.bootstrap(document, modules);
    }, 200);

    
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
app.run(['$rootScope', '$timeout', '$templateCache', '$module', function($rootScope, $timeout, $templateCache, $module) {
    // console.log(angularModules, angularModules.size());

    $rootScope.modules = {};

    // console.log('rootscope');

    // $timeout(function() {
        console.log(angularModules);
        for(i in angularModules) {
            // angularModules[i];
            var result = angularModules[i];

            $module.load(result.module, result.type, result.dir);

            // $templateCache.put(result.html_path, result.data);

            // $rootScope.modules[result.type] = $rootScope.modules[result.type] || {};
            // $rootScope.modules[result.type][result.module] = result.html_path;
            console.log('function', result.module, result.type, result.dir);
        }
    // }, 200);

    
    // angularModules.forEach(function(callback) {
    //     console.log('something loaded', callback);
    //     callback();
    // });
}]);

if(typeof angular !== 'undefined' && window.DEBUG) {
	console.timeEnd("Angular loaded");
}