var AuthController = function($scope, $http)
{	
	$scope.user = 'undefined';
	
	$scope.init = function() {
		if(typeof $scope.user == 'undefined') {
			$scope.user = {};
	
			if( typeof window.localStorage.access_token == 'undefined' || typeof window.localStorage.refresh_token == 'undefined' ) {
				$scope.user.status = 'logged-out';
				$scope.user.statusMessage = 'Log in';
			}
			else {
				$scope.logout();
				$scope.getUserInfo();
			}
		}
	};
	
	$scope.login = function() {
		$scope.$parent.setPopup(window.PATH.auth.loginUrl, true);
		$rootScope.$emit('devkit.blur', true);
	};

	$scope.logout = function() {
		delete window.localStorage.access_token;
		delete window.localStorage.refresh_token;
		$scope.user = 'undefined';
	};
	
	$scope.getUserInfo = function() {
		var promise = $http({
			method: 'GET',
	        url:  window.PATH.auth.userInfo,
	        headers: {
	          'Authorization': 'Bearer ' + window.localStorage.access_token
	        },
	        withCredentials: true
	    })
	    .then(function(result) {
			if(result.status == 200) {
				$scope.user = result.data;
			}
			else {
				$scope.logout();
				$scope.login();
			}
		});
	};
	
	// listen for a message from the iframe
	window.addEventListener('message', function(e) {
		$scope.$apply(function(){

			// save tokens to localStorage
			window.localStorage.access_token = e.data.accessToken;
			window.localStorage.refresh_token = e.data.refreshToken;

			// hide popup
			$scope.$parent.setBlur(false);
			$scope.$parent.setPopup('', false);

			// set userinfo
			$scope.getUserInfo();
		});
	});
}

AuthController.$inject = ['$scope', '$http'];

app.controller("AuthController", AuthController);