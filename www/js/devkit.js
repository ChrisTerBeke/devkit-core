require('nw.gui').Window.get().showDevTools()

// local dirname
var dirname = require('path').join( require('./js/util.js').dirname, '..' );

// prevent default behavior from changing page on dropped file
window.ondragover = function(e) { e.preventDefault(); return false };
window.ondrop = function(e) { e.preventDefault(); return false };

// create the angular app
var app = angular.module('devkit', ['ui.codemirror', 'ngTagsInput']);

// whitelist for iframe and assets
app.config(function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
		'self',
		'http://*.athom.nl/**',
		'https://*.athom.nl/**'
	]);
});

// add Bearer token to $http requests
app.run(['$rootScope', '$injector', function($rootScope,$injector) {
    $injector.get("$http").defaults.transformRequest = function(data, headersGetter) {
        if ($rootScope.user) headersGetter()['Authorization'] = "Bearer " + $rootScope.user.access_token;
        if (data) {
            return angular.toJson(data);
        }
    };
}]);


// prevent bounce on trackpads
window.onload = function(){
	var keysToDisable = [37, 38, 39, 40, 33, 34, 35, 36];
	
	function preventDefault(e) {
		e = e || window.event;
		if (e.preventDefault) {
			e.preventDefault();
		}
		e.returnValue = false;
	}
	 
	function keydown(e) {
		for (i = 0; i < keysToDisable.length; i++) {
			if (e.keyCode === keysToDisable[i]) {
				preventDefault(e);
				return;
			}
		}
	}
	 
	function wheel(e) {
		preventDefault(e);
	}
	 
	function noScroll() {
		window.onmousewheel = document.onmousewheel = wheel;
		document.onkeydown = keydown;
	}
	 
	noScroll(); 
}