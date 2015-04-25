app.run(['$rootScope', '$timeout', '$play', '$ocLazyLoad', function($rootScope, $timeout, $play, $ocLazyLoad) {
	$timeout(function() {
		$ocLazyLoad.load([
			'./bower_components/devkit-editor-codemirror/js/codemirror/lib/codemirror.js',
			'./bower_components/devkit-editor-codemirror/js/codemirror/mode/javascript/javascript.js',
			'./bower_components/devkit-editor-codemirror/js/angular-ui-codemirror/ui-codemirror.js',
			'./bower_components/devkit-editor-codemirror/js/CodemirrorController.js',
			'./bower_components/devkit-editor-codemirror/css/codemirror.css',
			'./bower_components/devkit-editor-codemirror/codemirror.html'
		]);
		$play.status('loading...');
	}, 100);
}]);