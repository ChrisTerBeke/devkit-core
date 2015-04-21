angular.module('sdk.auth', [])
    .factory('$auth', ['$rootScope', '$state', '$q', function ($rootScope, $state, $q) {   
	var factory = {};

   factory.login = function()
   {
		$scope.popupUrl = 'http://localhost:8080/login';
		$scope.popupVisible = true;
		$rootScope.user.status = 'logging-in';

		$timeout(function()
		{
			$rootScope.$emit('devkit.blur', true);
		}, 1);

	}

	factory.logout = function()
	{
		$rootScope.user = {};
		$rootScope.user.status = 'logged-out';
		$rootScope.user.statusMessage = 'Log in';

		delete window.localStorage.access_token;
		delete window.localStorage.refresh_token;
		//delete window.localStorage.activeHomey;
	}

	factory.getUserInfo = function()
	{

		$rootScope.user.status = 'logging-in';
		$rootScope.user.statusMessage = 'Logging in...';

		$http
			.get('http://api.formide.local/userdata/v1/me?access_token=' + window.localStorage.access_token)
			//.get('https://api.athom.nl/user/me')
			.success(function( data )
			{

				console.log(data);

				$rootScope.user.status = 'logged-in';
				$rootScope.user.statusMessage = data.firstName;

				$rootScope.user.firstname 	= data.firstName;
				$rootScope.user.lastname 	= data.lastName;
				$rootScope.user.email 		= data.email;
				$rootScope.user.avatar 		= data.profileImage;

				//$scope.getHomeys();

			})
			.error(function( data )
			{
				console.log(data);
				$rootScope.user.status = 'logged-out';
				$rootScope.user.statusMessage = 'Error logging in!';
			});

	}

    return factory;
}]);