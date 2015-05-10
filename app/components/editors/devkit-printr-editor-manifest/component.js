var fs 		= require('fs-extra');
var path 	= require('path');

app.controller("manifestViewCtrl", function( $scope, $rootScope, $http, $q, $events ){

	$scope.manifest = angular.fromJson( $scope.file.code );
	//$rootScope.project.metadata = $scope.manifest;
	$scope.file._changed = false;

	var code;

	$scope.$watch('manifest', function(){
		$scope.file._changed = true;
	}, true);

	$events.beforeSave($scope.file.path, function(cb) {
		cb({
			code: angular.toJson( $scope.manifest, true )
		});
	});
});