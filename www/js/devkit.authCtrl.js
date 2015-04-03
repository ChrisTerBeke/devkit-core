app.controller("authCtrl", function($scope, $rootScope, $http) {
	
	$scope.url = '';
	$scope.visible = false;
	
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
		$scope.login();		
	}
	
	$scope.getUserInfo = function(){
		
		$http
			.get('https://api.athom.nl/homey')
			.success(function( data ){
				
				$rootScope.user.logged_in = true;
				
				$rootScope.user.firstname 	= data.firstname;
				$rootScope.user.lastname 	= data.lastname;
				$rootScope.user.email 		= data.email;
				$rootScope.user.homeys		= data.homeys;
				
			})
			.error(function( data ){
				console.log(data)
			});
		
	}

	// listen for a message from the iframe
	window.addEventListener('message', function(e) {		
		$scope.$apply(function(){
			
			$rootScope.user.access_token = e.data.accessToken;
			$rootScope.user.refresh_token = e.data.refreshToken;
			
			$rootScope.$emit('devkit.blur', false);
			$scope.visible = false;
			$scope.url = '';
			
			$scope.getUserInfo();
			
		});
	});
			
	if(	typeof $rootScope.user == 'undefined' ) {
		$scope.logout();
	}
	
});

/*	

	$rootScope.user = {
		id: '8924ru79823rh2938y9025',
		username: 'WeeJeWel',
		name_first: 'Emile',
		name_last: 'Nijssen',
		avatar: {
			small: 'https://avatars1.githubusercontent.com/u/319873?v=3&s=460'
		},
		homeys: [
			{
				"id": "28748901y412bn45iu2oh580",
				"name": "Emile's Homey"
			}
		]
	}
	
*/