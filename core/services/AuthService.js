angular.module('sdk.auth', [])
    .factory('$auth', ['$rootScope', '$http', '$timeout', '$q', function ($rootScope, $http, $timeout, $q) {
	var factory = {};

   factory.login = function() {
   		$rootScope.user = $rootScope.user || {};
		$rootScope.user.status = 'logging-in';

		$timeout(function() {
			$rootScope.$emit('devkit.blur', true);
		}, 1);

	}

	factory.logout = function() {
		$rootScope.user = {};
		$rootScope.user.status = 'logged-out';
		$rootScope.user.statusMessage = 'Log in';

		delete window.localStorage.access_token;
		delete window.localStorage.refresh_token;
	}

	factory.getUserInfo = function() {
		$rootScope.user = $rootScope.user || {};
		$rootScope.user.status = 'logging-in';
		$rootScope.user.statusMessage = 'Logging in...';

		$http
			.get(window.PATH.auth.userInfo)
			.success(function(data) {
				$rootScope.user = data;
				$rootScope.user.status = 'logged-in';
			})
			.error(function(data) {
				$rootScope.user.status = 'logged-out';
				$rootScope.user.statusMessage = 'Error logging in!';
				alert('Error logging in');
			});
	}

    return factory;
}]);