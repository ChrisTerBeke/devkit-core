app.run(['$rootScope', '$timeout', '$play', '$file', '$module', function($rootScope, $timeout, $play, $file, $module) {
	
		// devmode
    	require('nw.gui').Window.get().showDevTools();

		// load modules
		
		// CORE
		// editors
		$module.load('codemirror', 		'editor',	'./core/components/editors/devkit-editor-codemirror/');
		
		// widgets
		$module.load('svg', 			'widget',	'./core/components/widgets/devkit-widget-svg/');
		$module.load('markdown', 		'widget',	'./core/components/widgets/devkit-widget-markdown/');
		
		// headers
		// nope..

		// themes
		// nope..
		
		// USER
		// editors
		$module.load('manifest', 		'editor',	'./app/components/editors/devkit-homey-editor-manifest/');

		// headers
		$module.load('auth', 			'header',	'./app/components/headers/devkit-homey-header-auth/');
		$module.load('title', 			'header',	'./app/components/headers/devkit-homey-header-title/');
		
		// widgets
		// nope..
		
		// themes
		$module.load('custom_icons',	'theme',	'./app/components/themes/custom_icons/');
		
		
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
		
}]);