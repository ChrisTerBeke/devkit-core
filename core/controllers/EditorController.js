var EditorController = function($rootScope, $scope, $file, $rootScope)
{
	// add close command to queue (why?) 
	// OBSELETE FUNCTION?
  //   windowEventsFactory.addToQueue('close', function() {
		// window.localStorage.files_open = '';

		// var files_open = [];

		// console.log('close command', $scope.files);

		// for( var file_path in $scope.$parent.files ) {
		// 	files_open.push( file_path );
		// }

		// window.localStorage.files_open = files_open.join(',');
  //   });
	var win = gui.Window.get();

	win.on('close', function() {
		this.hide(); // Pretend to be closed already
		window.localStorage.files_open = '';

		var files_open = [];

		console.log('close command', $scope.files);

		for( var file_path in $scope.files ) {
			files_open.push( file_path );
		}

		window.localStorage.files_open = files_open.join(',');

		this.close(true);
	});


	$scope.init = function() {
		if(window.localStorage.files_open) {
			var files_open = window.localStorage.files_open.split(',');
			console.log(files_open);
			for( var file_path in files_open) {
				$file.open(files_open[file_path]);
			}
		}
	}

	$scope.init();
	// var hook = Hook('global');

	// hook.register('onFileOpened',
	// 	function (e) {
	//         $scope.update();
	// 	}
	// );

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

		console.log('files', $scope.files);
	}
	
	$rootScope.$on('service.file.open', function(){
		$scope.update();
	});
	
	$rootScope.$on('service.file.close', function(){
		$scope.update();
	});
}

EditorController.$inject = ['$rootScope', '$scope', '$file', '$rootScope'];

app.controller("EditorController", EditorController);