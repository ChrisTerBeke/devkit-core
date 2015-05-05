var EditorController = function($rootScope, $scope, $file, windowEventsFactory, $rootScope)
{
	// add close command to queue (why?)
    windowEventsFactory.addToQueue('close', function() {
		window.localStorage.files_open = '';

		var files_open = [];

		for( var file_path in $scope.files ) {
			files_open.push( file_path );
		}

		window.localStorage.files_open = files_open.join(',');
    });

	// open file
    $scope.open = function(file_path) {
    	$file.open(file_path);
    }

	// close current file
	$scope.close = function(file_path) {
		$file.close(file_path);
	}
	
	$scope.isChanged = function( file_path ) {
		return $file.isChanged( file_path );
	}
	
	$scope.getEditorPath = function( view ) {
		return $rootScope.modules['editor'][view];
	}
	
	$scope.update = function(){
		$scope.files = $file.files;
		$scope.active = $file.active;
		$scope.$apply();
	}
	
	$rootScope.$on('service.file.open', function(){
		$scope.update();
	});
	
	$rootScope.$on('service.file.close', function(){
		$scope.update();
	});
}

EditorController.$inject = ['$rootScope', '$scope', '$file', 'windowEventsFactory', '$rootScope'];

app.controller("EditorController", EditorController);