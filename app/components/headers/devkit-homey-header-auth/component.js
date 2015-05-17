var HeaderAuthController = function($scope, $rootScope, $http)
{	
	$scope.apiRoot = window.CONFIG.paths.apiRoot;
	$scope.user = undefined;
	$scope.activeHomey = $rootScope.activeHomey = undefined;
	
	$scope.$watch("user", function(){
		$rootScope.user = $scope.user;
	});
	
	$scope.$watch("activeHomey", function(){
		$rootScope.activeHomey = $scope.activeHomey;
	});
	
	if(window.localStorage.user) {
		$scope.user = JSON.parse(window.localStorage.user);
	}
	
	$scope.changeActiveHomey = function( homey_id ){
		window.localStorage.activeHomey = homey_id;
		$scope.activeHomey = window.localStorage.activeHomey;
//		$rootScope.activeHomey = $scope.activeHomey;
	}
	
	$rootScope.$on('header.auth.getActiveHomey', function(){
		$scope.changeActiveHomey( $scope.activeHomey );
	});
	
	if(window.localStorage.activeHomey) {
		$scope.changeActiveHomey( window.localStorage.activeHomey );
	}
	
	$scope.init = function() {
		if($scope.user == undefined) {
			if(window.localStorage.access_token && window.localStorage.refresh_token) {
				$scope.getUserInfo();
			}
		}
	};
	
	$scope.login = function() {
		$scope.$parent.setPopup(window.CONFIG.paths.login, true);
		$rootScope.$emit('devkit.blur', true);
	};

	$scope.logout = function() {
		delete window.localStorage.access_token;
		delete window.localStorage.refresh_token;
		delete window.localStorage.user;
		delete window.localStorage.activeHomey;
		$scope.user = undefined;
		$scope.activeHomey = undefined;
	};
	
	$scope.getUserInfo = function() {
		$http({
			method: 'GET',
	        url: window.CONFIG.paths.apiRoot + '/user/me',
	        headers: {
	          'Authorization': 'Bearer ' + window.localStorage.access_token
	        },
	        withCredentials: true
	    })
	    .then(function(result) {		    
			if(result.status == 200) {
				$scope.user = result.data;
				window.localStorage.user = JSON.stringify(result.data);
				
				// set first Homey as active
				if( result.data.homeys.length > 0 ) {
					$scope.changeActiveHomey( result.data.homeys[0]._id );
				}
				
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
		gui.Shell.openExternal(window.CONFIG.paths.appManager + "/apps?app_id=" + manifest.id);
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

HeaderAuthController.$inject = ['$scope', '$rootScope', '$http'];

app.controller("HeaderAuthController", HeaderAuthController);


/*
	
var AuthController = function($scope, $auth)
{
	
	$scope.user = {};

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
}

AuthController.$inject = ['$scope', '$auth'];

app.controller("AuthController", AuthController);

*/