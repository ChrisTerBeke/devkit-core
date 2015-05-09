var AuthController = function($scope, $auth)
{

	/*
	// listen for a message from the iframe
	window.addEventListener('message', function(e)
	{
		$scope.$apply(function(){

			// save tokens to localStorage
			window.localStorage.access_token = e.data.accessToken;
			window.localStorage.refresh_token = e.data.refreshToken;

			$scope.setBlur(false);
			$scope.setPopup('', false);

			$auth.getUserInfo().then(function(result) 
			{
				$scope.user = result.data;
			});
		});
	});

	if(	typeof $scope.user == 'undefined' ) {
		$scope.user = {};

		if( typeof window.localStorage.access_token == 'undefined' || typeof window.localStorage.refresh_token == 'undefined' )
		{
			$scope.user.status = 'logged-out';
			$scope.user.statusMessage = 'Log in';
		}
		else
		{
			$auth.getUserInfo().then(function(result) 
			{
				$scope.user = result.data;
			});	
		}
	}

	$scope.login = function()
	{
		$scope.setPopup(window.PATH.auth.loginUrl, true);

		$scope.user = $auth.login();
	}

	$scope.logout  = function()
	{
		$scope.user = $auth.logout();
	}
	*/
}

AuthController.$inject = ['$scope', '$auth'];

app.controller("AuthController", AuthController);