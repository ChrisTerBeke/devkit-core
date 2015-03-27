var app = angular.module('devkit', []);

app.controller("appCtrl", function($scope, $rootScope) {
	
	$scope.project = {
		name: 'Hello World'
	}
	
});

app.controller("sidebarCtrl", function($scope, $rootScope) {
	
	$scope.items = [
		{
			name: 'assets',
			type: 'folder',
			childs: [
				{
					name: 'assets',
					type: 'folder'
				}
				
			]
		}
	]
	
});