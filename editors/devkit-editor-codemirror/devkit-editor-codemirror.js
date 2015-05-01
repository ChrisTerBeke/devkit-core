var path = require('path');

app.controller("CodemirrorController", ['$scope', '$rootScope', '$http', function( $scope, $rootScope, $http) {

	var file_path = $scope.file.path;
	var file_ext = path.extname( file_path );

	$scope.codemirrorOpts = {
		lineNumbers: true,
		indentWithTabs: true,
		styleActiveLine: true,
		lineWrapping: true,
        autoCloseTags: true,
        theme: 'solarized dark',
		onLoad: function( _editor ){

			$scope.editor = _editor;

			// fix hidden bug
			setTimeout( function(){
				_editor.refresh();
				_editor.focus();
			}, 1 );

			// Events
			_editor.on("change", function( _editor, changeObj ){

				var file = $scope.$parent.$parent.file;

				$rootScope.$broadcast('editor.change', changeObj);
				$rootScope.$broadcast('editor.change.' + $scope.$parent.active, changeObj);

				$scope.files[ $scope.active ]._changed = true;
			});
		}
	};

	switch( file_ext ) {
		case '.js':
			$scope.codemirrorOpts.mode = 'javascript';
			$scope.codemirrorOpts.lint = {
				node: true, // TODO: browser for web files
				curly: true,
				undef: true,
				predef: [ "Homey", "__" ]
			};
			$scope.codemirrorOpts.gutters = ["CodeMirror-lint-markers"];
			break;
		case '.css':
			$scope.codemirrorOpts.mode = 'css';
			$scope.codemirrorOpts.lint = true;
			/*
			$scope.codemirrorOpts.hint = true;
			$scope.codemirrorOpts.autohint = true;
			*/
			$scope.codemirrorOpts.gutters = ["CodeMirror-lint-markers"];
			break;
		case '.md':
			$scope.codemirrorOpts.mode = 'markdown';
			break;
		case '.svg':
			$scope.codemirrorOpts.mode = 'application/xml';
			break;

	}

    $rootScope.$on('editor.saveRequest.' + $scope.file.path, function(){
		$rootScope.$emit('editor.performSave');
    });

    $rootScope.$on('editor.focus.' + $scope.file.path, function(){
	    setTimeout(function(){
			$scope.editor.refresh();
			$scope.editor.focus();
		}, 1);
    });

}]);