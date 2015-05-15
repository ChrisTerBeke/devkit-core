/*
 * Use this area to load your modules. Some module have been pre-loaded for you like codemirror, some widgets and custom icons
 */
 
//CORE
// editors
loadModule('codemirror', 	'editor',	'./core/components/editors/devkit-editor-codemirror/', ['ui.codemirror']);

// widgets
loadModule('svg', 			'widget',	'./core/components/widgets/devkit-widget-svg/');
loadModule('markdown', 		'widget',	'./core/components/widgets/devkit-widget-markdown/');

// headers
loadModule('header_title',	'header',	'./core/components/headers/devkit-example-header-title/');

// themes
loadModule('theme_dark',	'theme',	'./core/components/themes/theme_dark/');
loadModule('theme_light',	'theme',	'./core/components/themes/theme_light/');

loadModule('custom_icons',	'theme',	'./core/components/themes/custom_icons/');


// APP
// editors

// headers

// widgets

// themes



/*
 * Use this area to define global settings for your app like the file editor config and devtools
 */
app.run(['$rootScope', '$timeout', '$file', function($rootScope, $timeout, $file) {
	
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
		}
	]);
}]);