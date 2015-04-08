app.controller("authCtrl", function($scope, $rootScope, $http, $filter) {
	
	$scope.url = '';
	$scope.visible = false;
	
	$rootScope.sharedVars = {
		activeHomey: false
	}
	
	$rootScope.$watch('sharedVars.activeHomey', function() {
		if( $rootScope.sharedVars.activeHomey !== false ) {
			window.localStorage.activeHomey = $rootScope.sharedVars.activeHomey
		}
	});
	
	$scope.change = function( data ) {
		alert('data')
		alert(data)
	}
	
	$rootScope.$on('auth.login', function(){
		$scope.login();
	});
	
	$rootScope.$on('auth.logout', function(){
		$scope.logout();
	});
	
	$scope.login = function(){
		$scope.url = 'https://devkit.athom.nl/auth';
		$scope.visible = true;
		
		$rootScope.$emit('devkit.blur', true);
		
	}
	
	$scope.logout = function(){
		$rootScope.user = {};
		
		delete window.localStorage.access_token;
		delete window.localStorage.refresh_token;
		delete window.localStorage.activeHomey;
		
		$scope.login();		
	}
	
	$scope.getUserInfo = function(){
		
		$http
			.get('https://api.athom.nl/user/me')
			.success(function( data ){
												
				$rootScope.user.logged_in = true;
				
				$rootScope.user.firstname 	= data.firstname;
				$rootScope.user.lastname 	= data.lastname;
				$rootScope.user.email 		= data.email;
				$rootScope.user.avatar 		= data.avatar;
				
			})
			.error(function( data ){
				console.log(data)
			});
		
	}
	
	$scope.getHomeys = function(){
		
		$http
			.get('https://api.athom.nl/homey')
			.success(function( homeys ){
				$rootScope.user.homeys = homeys;
				
				if( homeys.length > 0 ) {
				
					// if we have a prefered active homey, set it
					if( typeof window.localStorage.activeHomey == 'string' ) {
						
						// find if we still have access to that homey
						if( $filter('filter')( $rootScope.user.homeys, { _id: window.localStorage.activeHomey }, true ).length > 0 ) {
							$rootScope.sharedVars.activeHomey = window.localStorage.activeHomey;							
						} else {
							// select first Homey as active by default	
							$rootScope.sharedVars.activeHomey = homeys[0]._id;
						}
						
					} else {
						// select first Homey as active by default	
						$rootScope.sharedVars.activeHomey = homeys[0]._id;
					}
				} else {
					alert("You don't have access to any Homeys!");
				}
				
			})
			.error(function( data ){
				console.log(data)
			});
	}

	// listen for a message from the iframe
	window.addEventListener('message', function(e) {		
		$scope.$apply(function(){
			
			// save tokens to localStorage
			window.localStorage.access_token = e.data.accessToken;
			window.localStorage.refresh_token = e.data.refreshToken;
						
			$rootScope.$emit('devkit.blur', false);
			$scope.visible = false;
			$scope.url = '';
			
			$scope.getUserInfo();
			$scope.getHomeys();
			
		});
	});
			
	if(	typeof $rootScope.user == 'undefined' ) {

		$rootScope.user = {};
				
		if( typeof window.localStorage.access_token == 'undefined' || typeof window.localStorage.refresh_token == 'undefined' ) {
			$scope.login();
		} else {
			$scope.getUserInfo();
			$scope.getHomeys();
		}
	}
	
});