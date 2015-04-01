app.controller("manifestViewCtrl", function( $scope, $rootScope, $http, $q ){
	
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
    
	$scope.autocompletePermissionTags = function( query ){
		return $http.get('./res/autocomplete/permissions.json');
	}
    
    $scope.autocompleteSynonyms = function( query ) {
		return $q(function(resolve, reject) {
			$http
				.get('http://words.bighugelabs.com/api/2/ffa216479deb64dc5d75cba46f27b682/' + query + '/json')
				.success(function( data ){					
					resolve( data.noun.syn );					
				})
				.error(function(data){
					reject();
				});
		});
    }
	
});