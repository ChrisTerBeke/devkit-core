app.controller("manifestViewCtrl", function( $scope, $rootScope, $http ){
	
	$scope.manifest = angular.fromJson( $scope.file.code );
	$rootScope.project.metadata = $scope.manifest;
	$scope.file._changed = false;
	
	$scope.$watch('manifest', function(){
		$scope.file._changed = true;
	}, true);
	
    $rootScope.$on('editor.saveRequest.' + $scope.file.path, function(){	    	    
		$scope.file.code = angular.toJson( $scope.manifest, true );
		$rootScope.$emit('editor.performSave');
    });
	
});