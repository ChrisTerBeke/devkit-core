var path = require('path');

app.controller("CodemirrorController", ['$scope', '$rootScope', '$http', '$events', '$timeout', function( $scope, $rootScope, $http, $events, $timeout) {

	var file_path = $scope.file.path;
	var file_ext = path.extname( file_path );

	$scope.codemirrorOpts = {
		lineNumbers: true,
		indentWithTabs: true,
		styleActiveLine: true,
		lineWrapping: true,
        autoCloseTags: true,
        theme: "solarized dark",
		onLoad: function( _editor ){

			$scope.editor = _editor;

			// fix hidden bug
			$timeout( function(){
				_editor.refresh();
				_editor.focus();
				_editor.clearHistory();
				$scope.files[ $scope.active ]._changed = false;
			}, 1 );

			// Events			
			_editor.on("change", function( _editor, changeObj ){

				$rootScope.$broadcast('editor.change', changeObj);
				$rootScope.$broadcast('editor.change.' + $scope.$parent.active, changeObj);

				$scope.files[ $scope.active ]._changed = true;
			});
		}
	};

	switch( file_ext ) {
		case '.html':
			$scope.codemirrorOpts.mode = 'htmlmixed';		
			break;
		case '.js':
			$scope.codemirrorOpts.mode = 'javascript';
			break;
		case '.css':
			$scope.codemirrorOpts.mode = 'css';
			$scope.codemirrorOpts.lint = true;
			$scope.codemirrorOpts.gutters = ["CodeMirror-lint-markers"];
			break;
		case '.md':
			$scope.codemirrorOpts.mode = 'markdown';
			break;
		case '.svg':
			$scope.codemirrorOpts.mode = 'application/xml';
			break;
		default:
			// default to extension mode
			var defaultmode = file_ext.substring(1);
			if( typeof CodeMirror.modes[ defaultmode ] != 'undefined' ) {
				$scope.codemirrorOpts.mode = defaultmode;
			}
			break;

	}

    $rootScope.$on('editor.focus.' + $scope.file.path, function(){
	    setTimeout(function(){
			$scope.editor.refresh();
			$scope.editor.focus();
		}, 1);
    });

}]);