var AuthController = function($scope, $rootScope, $http)
{	
	$scope.user = undefined;
	
	if(window.localStorage.user) {
		$scope.user = JSON.parse(window.localStorage.user);
	}
	
	$scope.init = function() {
		if($scope.user == undefined) {
			if(window.localStorage.access_token && window.localStorage.refresh_token) {
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
		delete window.localStorage.user;
		$scope.user = undefined;
	};
	
	$scope.getUserInfo = function() {
		$http({
			method: 'GET',
	        url: window.PATH.auth.userInfo,
	        headers: {
	          'Authorization': 'Bearer ' + window.localStorage.access_token
	        },
	        withCredentials: true
	    })
	    .then(function(result) {
			if(result.status == 200) {
				$scope.user = result.data;
				window.localStorage.user = JSON.stringify(result.data);
			}
			else {
				$scope.refreshAccessToken();
			}
		});
	};
	
	$scope.refreshAccessToken = function() {
		$http({
			method: 'POST',
			url: window.PATH.auth.loginUrl + '/refresh',
			data: {
				refresh_token: window.localStorage.refresh_token
			}
		})
		.then(function(result) {
			if(result.status == 200) {
				if(result.data.code != 200) {
					console.log(result);
				}
				else {
					// save tokens to localStorage
					window.localStorage.access_token = result.data.accessToken;
					window.localStorage.refresh_token = result.data.refreshToken;
					$scope.getUserInfo();
				}
			}
			else {
				console.log(result);
			}
		});
	};

	$scope.goToAppManager = function() {
		var projectDir = window.localStorage.project_dir;
		var manifest = fs.readFileSync(projectDir + '/app.json', 'utf8');
		manifest = JSON.parse(manifest);
		gui.Shell.openExternal(window.PATH.appManager + "?app_id=" + manifest.id);
	};
	
	// listen for a message from the iframe
	window.addEventListener('message', function(e) {
		$scope.$apply(function() {

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

AuthController.$inject = ['$scope', '$rootScope', '$http'];

app.controller("AuthController", AuthController);