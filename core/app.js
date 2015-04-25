// require('nw.gui').Window.get().showDevTools();

// local dirname
// var dirname = require('path').join( require('./js/util.js').dirname, '..' );

// prevent default behavior from changing page on dropped file
window.ondragover = function(e) { e.preventDefault(); return false };
window.ondrop = function(e) { e.preventDefault(); return false };

var app = angular.module('app', ['module.core', 'module.modules']);

// whitelist for iframe and assets
app.config(function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist(window.AUTH.whitelist);
});

app.config(function($ocLazyLoadProvider) {

	$ocLazyLoadProvider.config({
		debug: true,
		modules: [
			{
				name: 'markdown',
				serie: true,
				files: [
					'./widgets/markdown/MarkdownController.js',
					'./widgets/markdown/markdown.css',
					'./widgets/markdown/markdown.html'
				]
			},
			{
				name: 'svg',
				serie: true,
				files: [
					'./widgets/svg/SvgController.js',
					'./widgets/svg/svg.css',
					'./widgets/svg/svg.html'
				]
			}
		]
	});

});

// add Bearer token to $http requests
app.run(['$rootScope', '$injector', '$ocLazyLoad', function($rootScope, $injector, $ocLazyLoad) {

    $injector.get("$http").defaults.transformRequest = function(data, headersGetter) {
        if ($rootScope.user) {
        	headersGetter()['Authorization'] = "Bearer " + window.localStorage.access_token;
        }
        if (data) {
            return angular.toJson(data);
        }
    };

    // lazy load markdown widget
	$ocLazyLoad.load('markdown');

	// lazy load svg widget
	$ocLazyLoad.load('svg');
}]);

if(typeof angular !== 'undefined' && window.DEBUG) {
	console.timeEnd("Angular loaded");
}