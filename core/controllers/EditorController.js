var EditorController = function($scope, $file, windowEventsFactory, $rootScope)
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
    	$scope.$parent.file.open(file_path);
    }

	// close current file
	$scope.close = function(file_path) {
		$scope.$parent.file.close(file_path);
	}
	
	$scope.getEditorPath = function( view ) {
		return $rootScope.modules['editor'][view];
	}
}

EditorController.$inject = ['$scope', '$file', 'windowEventsFactory', '$rootScope'];

app.controller("EditorController", EditorController);