app.run(['$rootScope', '$timeout', '$play', '$ocLazyLoad', '$file', function($rootScope, $timeout, $play, $ocLazyLoad, $file) {
	$timeout(function() {

		// lazy load codemirror
		$ocLazyLoad.load('devkit-editor-codemirror');

		 // lazy load markdown widget
		$ocLazyLoad.load('markdown');

		// lazy load svg widget
		$ocLazyLoad.load('svg');

		$file.setConfig([
			{
				ext: ".js",
				dir: "/animations",
				config: {
					widgets: [ 'markdown' ]
				}
			},
			{
				ext: ".svg",
				config: {
					widgets: [ 'svg' ]
				}
			},
			{
				ext: ".md",
				config: {
					widgets: [ 'markdown' ]
				}
			}
		]);

		$play.status('loading...');

	}, 100);
}]);

app.config(function($ocLazyLoadProvider) {

	$ocLazyLoadProvider.config({
		debug: true,
		modules: [
			{
				name: 'markdown',
				serie: true,
				files: [
					'./widgets/markdown/MarkdownController.js',
					'./widgets/markdown/markdown.css',
					'./widgets/markdown/markdown.html'
				]
			},
			{
				name: 'svg',
				serie: true,
				files: [
					'./widgets/svg/SvgController.js',
					'./widgets/svg/svg.css',
					'./widgets/svg/svg.html'
				]
			},
			{
				name: 'devkit-editor-codemirror',
				serie: true,
				files: [
					'./bower_components/devkit-editor-codemirror/js/codemirror/lib/codemirror.js',
					'./bower_components/devkit-editor-codemirror/js/codemirror/mode/javascript/javascript.js',
					'./bower_components/devkit-editor-codemirror/js/angular-ui-codemirror/ui-codemirror.js',
					'./bower_components/devkit-editor-codemirror/js/CodemirrorController.js',
					'./bower_components/devkit-editor-codemirror/css/codemirror.css',
					'./bower_components/devkit-editor-codemirror/codemirror.html'
				]
			}
		]
	});

});