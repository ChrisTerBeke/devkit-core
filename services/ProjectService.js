angular.module('sdk.project', []).factory('$project', ['$rootScope', function ($rootScope) {
	var factory = {};

	factory.getPath = function() {
		if(window.localStorage.project_dir) {
			return window.localStorage.project_dir;
		}
		else {
			return '';
		}
		
	}

	factory.setPath = function(path) {
		window.localStorage.project_dir = path;

		return true;
	}

	factory.getOpenFiles = function() {
		if(window.localStorage.files_open) {
			return window.localStorage.files_open.split(',');
		}
		else {
			return [''];
		}
	}

	factory.setOpenFiles = function(files) {
		window.localStorage.files_open = files.join(',');

		return true;
	}


    return factory;
}]);