var fs 		= require('fs-extra');
var path 	= require('path');
var semver	= require('semver');

app.controller("manifestViewCtrl", function( $scope, $rootScope, $http, $q, $events, $timeout ){

	$scope.manifest = angular.fromJson( $scope.file.code );
	var code;

	var hook = Hook('global');

	$timeout(function() {
		$scope.init();
	});

	$scope.init = function() {
		$scope.file._changed = false;
	}
	
	$scope.$watch('manifest', function(){
		$scope.file._changed = true;

		hook.call('onManifestChange', $scope.manifest);
	}, true);

	$events.beforeSave($scope.file.path, function(cb) {
		var manifest = $scope.manifest;

		if(semver.valid(manifest.version)) {
			hook.call('onManifestSave', manifest);

			cb({
				code: angular.toJson( manifest, true )
			});
		}
		else {
			//TODO: Add version number.
			alert('Invalid Version Number');
			// console.log('Invalid Version');
		}
	});
});