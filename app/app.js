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
// nope..

// themes
loadModule('formide', 		'theme',	'./core/components/themes/formide/');

// APP
// editors
loadModule('manifest', 		'editor',	'./app/components/editors/devkit-printr-editor-manifest/');
loadModule('viewer', 		'editor',	'./app/components/editors/devkit-printr-editor-viewer/', ['printr.viewer']);

// headers
loadModule('auth', 			'header',	'./app/components/headers/devkit-printr-header-auth/');
loadModule('upload', 		'header',	'./app/components/headers/devkit-printr-header-upload/');
loadModule('title', 		'header',	'./app/components/headers/devkit-printr-header-title/');

// widgets
// nope..

// themes
loadModule('custom_icons',	'theme',	'./app/components/themes/custom_icons/');
loadModule('custom_icons',	'theme',	'./app/components/themes/formide/');

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
		},
		{
			ext: ".json",
			config: {
				editor: "manifest"
			}
		},
		{
			ext: ".stl",
			config: {
				editor: "viewer"
			}
		}
	]);
}]);