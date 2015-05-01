var AuthController = function($scope, $timeout, $auth)
{

	$scope.login = function()
	{
		$scope.$parent.$parent.setPopup(window.PATH.auth.loginUrl, true);

		$auth.login();
	}

	$scope.logout  = function()
	{
		$auth.logout();
	}
}

AuthController.$inject = ['$scope', '$timeout', '$auth'];

app.controller("AuthController", AuthController);