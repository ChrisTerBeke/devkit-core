app.run(['$rootScope', '$timeout', '$play', '$file', function($rootScope, $timeout, $play, $file) {
	
		// devmode
    	require('nw.gui').Window.get().showDevTools();
		
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

//CORE
// editors
loadModule('codemirror', 		'editor',	'./core/components/editors/devkit-editor-codemirror/', ['ui.codemirror']);

// widgets
loadModule('svg', 			'widget',	'./core/components/widgets/devkit-widget-svg/');
loadModule('markdown', 		'widget',	'./core/components/widgets/devkit-widget-markdown/');

// headers
// nope..

// themes
// nope..

// USER
// editors
loadModule('manifest', 		'editor',	'./app/components/editors/devkit-homey-editor-manifest/');

// headers
loadModule('auth', 			'header',	'./app/components/headers/devkit-homey-header-auth/');
loadModule('title', 			'header',	'./app/components/headers/devkit-homey-header-title/');

// widgets
// nope..

// themes
loadModule('custom_icons',	'theme',	'./app/components/themes/custom_icons/');

angular.element(document).ready(function() {
	require('nw.gui').Window.get().showDevTools();
});