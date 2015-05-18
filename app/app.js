/*
 * Use this area to load your modules. Some module have been pre-loaded for you like codemirror, some widgets and custom icons
 */
 
//CORE
// editors
loadModule('codemirror', 	'editor',	'./core/components/editors/devkit-editor-codemirror/', ['ui.codemirror']);

// widgets
loadModule('svg', 			'widget',	'./core/components/widgets/devkit-widget-svg/');
loadModule('markdown', 		'widget',	'./core/components/widgets/devkit-widget-markdown/');

// APP
// editors
loadModule('manifest', 		'editor',	'./app/components/editors/devkit-homey-editor-manifest/');

// headers
loadModule('title', 		'header',	'./app/components/headers/devkit-homey-header-title/');
loadModule('auth', 			'header',	'./app/components/headers/devkit-homey-header-auth/');
loadModule('play', 			'header',	'./app/components/headers/devkit-homey-header-play/');

// widgets
// nope..

// themes
loadModule('custom_icons',	'theme',	'./app/components/themes/custom_icons/');
loadModule('athom',			'theme',	'./app/components/themes/athom/');
loadModule('font-awesome',	'theme',	'./app/components/themes/font-awesome/');

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
		/*
		{
			ext: ".md",
			config: {
				widgets: [ 'markdown' ]
			}
		},
		*/
		{
			base: 'app.json',
			dir: '/',
			config: {
				editor: "manifest"
			}
		}
	]);
}]);