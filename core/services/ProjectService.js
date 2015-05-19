angular.module('sdk.project', []).factory('$project', ['$rootScope', function ($rootScope) {
	var factory = {};

	factory.getPath = function() {
		return window.localStorage.project_dir;
	}

	factory.setPath = function(path) {
		window.localStorage.project_dir = path;

		return true;
	}

    return factory;
}]);