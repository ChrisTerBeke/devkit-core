var EditorController = function($rootScope, $scope, $file, $project, $rootScope, $timeout)
{
	var win = gui.Window.get();

	win.on('close', function() {
		this.hide(); // Pretend to be closed already
		$project.setOpenFiles(['']);

		var files_open = [];

		for( var file_path in $scope.files ) {
			files_open.push( file_path );
		}

		$project.setOpenFiles(files_open);

		this.close(true);
	});

	$scope.init = function() {
		if($project.getOpenFiles()) {
			var files_open = $project.getOpenFiles();

			for( var file_path in files_open) {
				$file.open(files_open[file_path]);
			}
		}
	}

	$timeout(function() {
		$scope.init();
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
	}
	
	$rootScope.$on('menu.file-close', function(){
		$scope.close();
	});
	
	$rootScope.$on('service.file.open', function(){
		$scope.update();
	});
	
	$rootScope.$on('service.file.close', function(){
		$scope.update();
	});

	$rootScope.$on('service.file.save', function(){
		$scope.update();
	});
}

EditorController.$inject = ['$rootScope', '$scope', '$file', '$project', '$rootScope', '$timeout'];

app.controller("EditorController", EditorController);