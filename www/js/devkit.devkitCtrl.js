var os 			= require('os');
var fs 			= require('os');
var path		= require('path');

app.controller("devkitCtrl", function($scope, $rootScope, $http) {
	
	// variables
	$rootScope.project = {};
	$scope.platform = os.platform();
	
	// methods
	$scope.load = function( project_dir ){
		
		$rootScope.project.path = project_dir;
		
		// load metadata
		var metadata = fs.readFileSync( path.join( project_dir, 'app.json' ) ).toString();
			metadata = JSON.parse( metadata );			
		$rootScope.project.metadata = metadata;
		
		$rootScope.$emit('project.loaded');
				
		// save for restart
		window.localStorage.project_dir = project_dir;
		
	}
		
	$scope.run = function(){
		alert('run')
	}
	
	$scope.open = function(){	
		var directorychooser = document.getElementById('directorychooser');
		directorychooser.addEventListener("change", function(evt) {
			$scope.load( this.value );
		}, false)
		directorychooser.click();
	}
	
	// load previous project, if available 
	window.addEventListener('load', function(){
		if( typeof window.localStorage.project_dir == 'string' ) {
			$scope.load( window.localStorage.project_dir );
		}
	});
	
	// progressbar
	$scope.progressbar = 0;
	
    $rootScope.$on('progressbar', function( event, percent ) {
	    console.log('progressbar', percent * 100 + '%')
		$scope.progressbar = percent;
    });
    
	$scope.autocompletePermissionTags = function( query ){
		return $http.get('./res/autocomplete/permissions.json');
	}
	
	// stoplight button methods
	$scope.minimize = function(){
		var gui = require('nw.gui');
		var win = gui.Window.get();
		win.minimize();
	}
	$scope.close = function(){
		var gui = require('nw.gui');
		var win = gui.Window.get();
		win.close();
	}
	$scope.zoom = function(){
		var gui = require('nw.gui');
		var win = gui.Window.get();
		win.maximize();
		
		if( typeof $rootScope.maximized == 'undefined' ) {
			$rootScope.maximized = true;
		} else {
			$rootScope.maximized = !$rootScope.maximized;
		}
	}
	
	
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
		click: $scope.run,
		key: 'r',
		modifiers: 'cmd'
	}));
	
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