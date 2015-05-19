var os 			= require('os');
var fs			= require('fs-extra');
var path		= require('path');

var events 		= {};

var ApplicationController = function($scope, $rootScope, $timeout, $stoplight, $file, $events, $templateCache, ngDialog, $http)
{
	var gui = require('nw.gui');
	var win = gui.Window.get();

	var hook = Hook('global');

	$scope.loaded = false;
	$scope.platform = os.platform();

	$scope.focus = true;
	$scope.blurred = false;

	$scope.files = {}; // files open
	$scope.fileHistory = [];
	$scope.path = false; // current project path

	var obj = {content:null};

	$scope.setBlur = function(blur)
	{
		$scope.blurred = blur;
	}

	$scope.setFocus = function(focus)
	{
		$scope.focus = focus;
	}

	$scope.newFile = function() {
		$rootScope.$emit('service.project.new.file');
	}

	$scope.newFolder = function() {
		$rootScope.$emit('service.project.new.folder');
	}

	$scope.stoplight = $stoplight;

	$scope.file = {};

	$scope.file.open = function(file_path)
	{
    	$file.open( file_path );
    }

	// close current file
	$scope.file.close = function(file_path)
	{
    	$file.close( file_path );
    }

	// safe file
	$scope.file.save = function()
	{
    	$file.save();
    }

	// get file info
	$scope.file.getInfo = function(file_path)
	{
    	$file.getInfo(file_path);
    }

	// get file icon
	$scope.file.icon = function(file_path)
	{
    	$file.icon(file_path);
    }
    
	window.addEventListener('load', function()
	{
		$scope.loaded = true;
	});

    /* TODO: Merge this somehow, make it more elegeant*/

    win.on('focus', function() 
    {
		$scope.setFocus(true);
    });

    win.on('blur', function() 
    {
		$scope.setFocus(false);
    });

	window.addEventListener('blur', function() 
	{
		$scope.setFocus(false);
	});

	window.addEventListener('focus', function() 
	{
		$scope.setFocus(true);
	});


	/* TODO: Make a service of this, that generates a menubar based on a JSON input. */

	// menu

	var menuBar = new gui.Menu({
		type: "menubar"
	});
	
	if( process.platform == 'darwin' ) {	
		menuBar.createMacBuiltin("Devkit", {
			hideWindow: true
		});
	} else {
		var menuItem = new gui.MenuItem({ label: 'File' });
		
		var submenu = new gui.Menu();
			submenu.append(new gui.MenuItem({ label: 'Item 1' }));
			submenu.append(new gui.MenuItem({ label: 'Item 2' }));
			submenu.append(new gui.MenuItem({ label: 'Item 3' }));
			
		menuItem.submenu = submenu;
		menuBar.append(menuItem);
		
		menuBar.append(new gui.MenuItem({ label: 'Edit' }));
		menuBar.append(new gui.MenuItem({ label: 'View' }));
		
		console.log(menuBar.items)
	}

	win.menu = menuBar;

	menuBar.items[0].submenu.insert( new gui.MenuItem({ type: 'separator' }), 2 );

	menuBar.items[0].submenu.insert(new gui.MenuItem({
		label: 'Preferences...',
		click: function() {
			$scope.$apply(function() {
				$scope.toggleSettings();
			});
		},
		key: ',',
		modifiers: 'cmd'
	}), 3);

	// app menu
	menuBar.items[0].submenu.insert(new gui.MenuItem({
		label: 'Check for updates...',
		click: function() {
			alert('this feature will come soon...');
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
			$scope.newFile();
		},
		key: 'n',
		modifiers: 'cmd'
	}));
	
	newSubmenu.append(new gui.MenuItem({
		label: 'Folder',
		click: function() {
			$scope.newFolder();
		},
		key: 'n',
		modifiers: 'cmd+alt'
	}));

	newSubmenu.append(new gui.MenuItem({
		label: 'Project...',
		click: function() {
			$rootScope.$emit('service.project.create');
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
			$rootScope.$emit('service.project.open');
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
			$scope.$apply(function() {
				$file.close();
			});
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
			$scope.$apply(function() {
				$file.save();
			});
		},
		key: 's',
		modifiers: 'cmd'
	}),6);

	file.insert(new gui.MenuItem({
		label: 'Save All',
		click: function() {
    		$rootScope.$emit('service.file.saveall');
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
			$rootScope.$emit('project.run');
		},
		key: 'r',
		modifiers: 'cmd'
	}), 0);

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

}

ApplicationController.$inject = ['$scope', '$rootScope', '$timeout', '$stoplight', '$file', '$events', '$templateCache', 'ngDialog', '$http'];

app.controller("ApplicationController", ApplicationController);
