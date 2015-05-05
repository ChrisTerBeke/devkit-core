angular.module('sdk.auth', [])
    .factory('$auth', ['$rootScope', '$http', '$timeout', '$q', function ($rootScope, $http, $timeout, $q) {
	var factory = {};

   factory.login = function() {
   		var user = {};
		user.status = 'logging-in';

		$timeout(function() {
			$rootScope.$emit('devkit.blur', true);
		}, 1);

		return user;

	}

	factory.logout = function() {
		var user = {};
		user.status = 'logged-out';
		user.statusMessage = 'Log in';

		delete window.localStorage.access_token;
		delete window.localStorage.refresh_token;

		return user;
	}

	factory.getUserInfo = function() {
		var promise = $http({
			method: 'GET',
	        url:  window.PATH.auth.userInfo,
	        headers: {
	          'Authorization': 'Bearer ' + window.localStorage.access_token
	        },
	        withCredentials: true
	    })
	    .success(function(data){
	        user = data;
			user.status = 'logged-in';

			return user;
	    })
	    .error(function(){
	        user.status = 'logged-out';
			user.statusMessage = 'Error logging in!';

			return user;
	    });

	    return promise;
	}

    return factory;
}]);