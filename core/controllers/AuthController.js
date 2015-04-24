app.controller("authCtrl", function($scope, $rootScope, $http, $filter, $timeout, $auth) {

	$scope.popupUrl = '';
	$scope.popupVisible = false;

	$rootScope.sharedVars = {
	}

	$rootScope.$on('auth.login', function(){
		console.log('login this');
		$scope.login();

	});

	$rootScope.$on('auth.logout', function(){
		$scope.logout();
	});

	$rootScope.$on('closePopup', function(){
		$rootScope.$emit('devkit.blur', false);
		$scope.popupVisible = false;
		$scope.popupUrl = '';
		$rootScope.user.status = 'logged-out';
	});

	$scope.login  = function() {
		$scope.popupUrl = window.PATH.auth.loginUrl;
		$scope.popupVisible = true;

		$auth.login();
	}

	$scope.logout  = function() {
		$auth.logout();
	}

	$scope.getUserInfo  = function() {
		$auth.getUserInfo();
	}

	// listen for a message from the iframe
	window.addEventListener('message', function(e) {
		$scope.$apply(function(){

			// save tokens to localStorage
			window.localStorage.access_token = e.data.accessToken;
			window.localStorage.refresh_token = e.data.refreshToken;

			$rootScope.$emit('devkit.blur', false);
			$scope.popupVisible = false;
			$scope.popupUrl = '';

			$scope.getUserInfo();

		});
	});

	if(	typeof $rootScope.user == 'undefined' ) {

		$rootScope.user = {};

		if( typeof window.localStorage.access_token == 'undefined' || typeof window.localStorage.refresh_token == 'undefined' ) {
			//$scope.login();
			$rootScope.user.status = 'logged-out';
			$rootScope.user.statusMessage = 'Log in';
		} else {
			$scope.getUserInfo();
		}
	}

});