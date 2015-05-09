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
// nope..

// APP
// editors
<<<<<<< HEAD:app/app.js
loadModule('manifest', 		'editor',	'./app/components/editors/devkit-printr-editor-manifest/');
loadModule('viewer', 		'editor',	'./app/components/editors/devkit-printr-editor-viewer/', ['printr.viewer']);

// headers
loadModule('upload', 		'header',	'./app/components/headers/devkit-printr-header-upload/');
=======
loadModule('manifest', 		'editor',	'./app_example/components/editors/devkit-homey-editor-manifest/');

// headers
loadModule('auth', 			'header',	'./app_example/components/headers/devkit-homey-header-auth/');
loadModule('title', 		'header',	'./app_example/components/headers/devkit-homey-header-title/');
>>>>>>> 2e586e85ee5ee253653caa8ffc8ca699eb9202d6:app_example/app.js

// widgets
// nope..

// themes
<<<<<<< HEAD:app/app.js
loadModule('custom_icons',	'theme',	'./app/components/themes/custom_icons/');
loadModule('custom_icons',	'theme',	'./app/components/themes/formide/');
=======
loadModule('custom_icons',	'theme',	'./app_example/components/themes/custom_icons/');
>>>>>>> 2e586e85ee5ee253653caa8ffc8ca699eb9202d6:app_example/app.js

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