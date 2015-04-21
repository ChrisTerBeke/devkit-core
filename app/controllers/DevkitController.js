var os 			= require('os');
var fs 			= require('os');
var path		= require('path');

var DevkitController = function($scope, $file, $q) {
	$rootScope.project = {};
	$scope.loaded = false;
	$scope.platform = os.platform();
	$scope.focus = true;
	$scope.blurred = false;
}

DevkitController.$inject = ['$scope', '$sidebar', '$q'];

app.controller("DevkitController", DevkitController);

app.controller("devkitCtrl", function($scope, $rootScope, $http, windowEventsFactory) {
	
	// variables
	$rootScope.project = {};
	$scope.loaded = false;
	$scope.platform = os.platform();
	$scope.focus = true;
	$scope.blurred = false;
	
	$rootScope.languages = [
		{
			code: 'en',
			name: 'English'
		},
		{
			code: 'nl',
			name: 'Dutch'
		},
		{
			code: 'fr',
			name: 'French'
		},
		{
			code: 'de',
			name: 'German'
		},
		{
			code: 'es',
			name: 'Spanish'
		}
	];

	// window focus/blurring	
	var gui = require('nw.gui');
    var win = gui.Window.get();
    win.on('focus', function() {
		$scope.$apply(function(){
		    $scope.focus = true;			
		});
    });
    win.on('blur', function() {
		$scope.$apply(function(){
		    $scope.focus = false;
		});
    });
	window.addEventListener('blur', function(){
		$scope.$apply(function(){
		    $scope.focus = false;			
		});
	});
	window.addEventListener('focus', function(){
		$scope.$apply(function(){
		    $scope.focus = true;			
		});
	});
	
	win.on('close', function() {
		
		// hide ourselves first
		$scope.$apply(function(){
			$scope.loaded = false;
		});
		
		// fire all callbacks
		windowEventsFactory.runQueue('close');
				
		// close for real
		this.close(true);
		
	});
	
	$rootScope.$on('devkit.blur', function( event, blur ){
		$scope.blurred = blur;
	});
	
	// methods
	$scope.emit = function( event, data ){
		$rootScope.$emit( event, data );
	}
	
	// $scope.load = function( project_dir ){
		
	// 	$rootScope.project.path = project_dir;
		
	// 	// load metadata
	// 	var metadata = fs.readFileSync( path.join( project_dir, 'app.json' ) ).toString();
	// 		metadata = JSON.parse( metadata );			
	// 	$rootScope.project.metadata = metadata;
		
	// 	$rootScope.$emit('project.loaded');
				
	// 	// save for restart
	// 	window.localStorage.project_dir = project_dir;
		
	// }
	
	// $scope.open = function(){	
	// 	var directorychooser = document.getElementById('directorychooser');
	// 	directorychooser.addEventListener("change", function(evt) {
	// 		$scope.load( this.value );
	// 	}, false)
	// 	directorychooser.click();
	// }
	
	window.addEventListener('load', function(){
		$scope.loaded = true;
		
		// load previous project, if available 
		if( typeof window.localStorage.project_dir == 'string' ) {
			$scope.load( window.localStorage.project_dir );
		}
		
		// load previous files, if available
		if( typeof window.localStorage.files_open != 'undefined' ) {
			
			var files_open = window.localStorage.files_open.split(',');
			
			if( files_open.length < 1 ) return;
						
			files_open.forEach(function( file_path ){
				if( fs.existsSync(file_path) ) {
					$rootScope.$emit('editor.open', file_path );
				}
			});
			
		} else {
			window.localStorage.files_open = '';
		}
		
	});
		
	// stoplight button methods
	// $scope.minimize = function(){
	// 	var gui = require('nw.gui');
	// 	var win = gui.Window.get();
	// 	win.minimize();
	// }
	// $scope.close = function(){
	// 	var gui = require('nw.gui');
	// 	var win = gui.Window.get();
	// 	win.close();
	// }
	// $scope.zoom = function(){
	// 	var gui = require('nw.gui');
	// 	var win = gui.Window.get();
	// 	win.maximize();
		
	// 	if( typeof $rootScope.maximized == 'undefined' ) {
	// 		$rootScope.maximized = true;
	// 	} else {
	// 		$rootScope.maximized = !$rootScope.maximized;
	// 	}
	// }
	
	
	// menu
	var gui = require('nw.gui');
	var win = gui.Window.get();
	
	var osxMenuBar = new gui.Menu({
		type: "menubar"
	});
	osxMenuBar.createMacBuiltin("Homey Devkit", {
		hideWindow: true
	});
	
	osxMenuBar.items[0].submenu.insert( new gui.MenuItem({ type: 'separator' }), 2 );
			
	osxMenuBar.items[0].submenu.insert(new gui.MenuItem({
		label: 'Preferences...',
		click: function() {
			alert('preferences');
		},
		key: ',',
		modifiers: 'cmd'
	}), 3);
	
	win.menu = osxMenuBar;
					
	// app menu
	osxMenuBar.items[0].submenu.insert(new gui.MenuItem({
		label: 'Check for updates...',
		click: function() {
			alert('Update');
		}
	}), 1);
	
	// file menu
	var file = new gui.Menu();
	
	var newMenu = new gui.MenuItem({
		label: 'New'
	});
	
	var newSubmenu = new gui.Menu();
	newSubmenu.append(new gui.MenuItem({
		label: 'File',
		click: function() {
			project.create();
		},
		key: 'n',
		modifiers: 'cmd'
	}));
	
	newSubmenu.append(new gui.MenuItem({
		label: 'Project...',
		click: function() {
			project.create();
		},
		key: 'n',
		modifiers: 'cmd+shift'
	}));
	
	newMenu.submenu = newSubmenu;
	file.insert(newMenu, 0);
	
	file.insert(new gui.MenuItem({
		type: 'separator'
	}),1);
	
	file.insert(new gui.MenuItem({
		label: 'Open Project',
		click: function() {
			$scope.open();
		},
		key: 'o',
		modifiers: 'cmd'
	}),2);
	
	file.insert(new gui.MenuItem({
		type: 'separator'
	}),3);
	
	file.insert(new gui.MenuItem({
		label: 'Close tab',
		click: function() {
			$rootScope.$emit('editor.close');
		},
		key: 'w',
		modifiers: 'cmd'
	}),4);
	
	file.insert(new gui.MenuItem({
		type: 'separator'
	}),5);
	
	file.insert(new gui.MenuItem({
		label: 'Save',
		click: function() {
			$rootScope.$emit('editor.saveRequest');
		},
		key: 's',
		modifiers: 'cmd'
	}),6);
	
	file.insert(new gui.MenuItem({
		label: 'Save All',
		click: function() {
			$rootScope.$emit('editor.saveall');
		},
		key: 's',
		modifiers: 'cmd+shift'
	}),7);
	
	win.menu.insert(new gui.MenuItem({
		label: 'File',
		submenu: file
	}), 1);
			
			
	// project menu
	var project = new gui.Menu();
	
	project.insert(new gui.MenuItem({
		label: 'Run',
		click: function(){
			$rootScope.$emit('homey.run');
		},
		key: 'r',
		modifiers: 'cmd'
	}), 0);
	
	project.insert(new gui.MenuItem({
		label: 'Run and Break',
		click: function(){
			$rootScope.$emit('homey.runbrk');
		},
		key: 'r',
		modifiers: 'cmd+shift'
	}), 1);
	
	project.insert(new gui.MenuItem({
		label: 'REFRESH',
		click: function(){
			window.location.reload( true );
		},
		key: '§',
		modifiers: 'cmd'
	}),2);
	
	win.menu.insert(new gui.MenuItem({
		label: 'Project',
		submenu: project
	}), 3);
	
	// text menu
	var text = new gui.Menu();
	
	text.insert(new gui.MenuItem({
		type: 'checkbox',
		label: 'Wrap lines',
		click: function(){
				
		},
		checked: true,
		key: 'w',
		modifiers: 'cmd+alt'
	}));
	
	win.menu.insert(new gui.MenuItem({
		label: 'Text',
		submenu: text
	}), 4);
	
});