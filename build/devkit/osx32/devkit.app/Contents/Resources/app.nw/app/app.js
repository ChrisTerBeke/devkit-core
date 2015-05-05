app.run(['$rootScope', '$timeout', '$play', '$ocLazyLoad', '$file', '$module', function($rootScope, $timeout, $play, $ocLazyLoad, $file, $module) {
	$timeout(function() {

		// load modules

		$module.load('svg', 'widget');

		$module.load('markdown', 'widget');

		$module.load('codemirror', 'editor', './editors/');

		$module.load('manifest', 'editor', './editors/');

		$module.load('auth', 'header', './headers/');

		// set editor config
		$file.setConfig([
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
			},
			{
				ext: ".json",
				config: {
					editor: "manifest"
				}
			}
		]);

		// set play button
		$play.status('loading...');

	}, 100);
}]);