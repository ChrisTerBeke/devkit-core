// require('nw.gui').Window.get().showDevTools();

// local dirname
// var dirname = require('path').join( require('./js/util.js').dirname, '..' );

// prevent default behavior from changing page on dropped file
window.ondragover = function(e) { e.preventDefault(); return false };
window.ondrop = function(e) { e.preventDefault(); return false };

var app = angular.module('app', ['module.core', 'module.app']);

// whitelist for iframe and assets
app.config(function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist(window.AUTH.whitelist);
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


if(typeof angular !== 'undefined' && window.DEBUG) {
	console.timeEnd("Angular loaded");
}