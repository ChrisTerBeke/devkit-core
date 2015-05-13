var fs 		= require('fs-extra');
var path 	= require('path');

app.controller("manifestViewCtrl", function( $scope, $rootScope, $http, $q, $events, $timeout ){

	$scope.manifest = angular.fromJson( $scope.file.code );
	var code;

	$timeout(function() {
		$scope.init();
	});

	$scope.init = function() {
		$scope.file._changed = false;
	}
	
	$scope.$watch('manifest', function(){
		$scope.file._changed = true;
	}, true);

	$events.beforeSave($scope.file.path, function(cb) {
		cb({
			code: angular.toJson( $scope.manifest, true )
		});
	});
});