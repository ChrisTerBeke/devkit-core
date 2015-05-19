angular.module('sdk.project', []).factory('$project', ['$rootScope', function ($rootScope) {
	var factory = {};

	factory.getPath = function() {
		return window.localStorage.project_dir;
	}

	factory.setPath = function(path) {
		window.localStorage.project_dir = path;

		return true;
	}

	factory.getOpenFiles = function() {
		return window.localStorage.files_open.split(',');
	}

	factory.setOpenFiles = function(files) {
		window.localStorage.files_open = files.join(',');

		return true;
	}


    return factory;
}]);