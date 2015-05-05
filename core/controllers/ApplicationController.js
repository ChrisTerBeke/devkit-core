var os 			= require('os');
// var fs 			= require('fs');
var fs			= require('fs-extra');
var path		= require('path');

var open		= require("open");
var watchTree 	= require("fs-watch-tree").watchTree;
var trash		= require('trash');

var events 		= {};


var ApplicationController = function($scope, $timeout, $auth, $stoplight, $sidebar, $file, $events, windowEventsFactory, $templateCache)
{
	var gui 		= require('nw.gui');
	var win 		= gui.Window.get();

	$scope.loaded = false;
	$scope.platform = os.platform();

	$scope.focus = true;
	$scope.blurred = false;

	$scope.popup = {};
	$scope.popup.url = '';
	$scope.popup.visible = false;

	$scope.files = {}; // files open
	$scope.active = undefined; // currently viewing
	$scope.fileHistory = [];

	$scope.project = {};

	$scope.setBlur = function(blur)
	{
		$scope.blurred = blur;
	}

	$scope.setFocus = function(focus)
	{
		$scope.focus = focus;
	}

	$scope.setPopup = function(url, visible)
	{
		$scope.popup.url = url;
		$scope.popup.visible = visible;
	}

	$scope.closePopup = function()
	{
		$scope.setBlur(false);
		$scope.setPopup('', false);
		$scope.user.status = 'logged-out';
	}

	$scope.updateFiletree = function(project_dir) 
	{
		var watch = watchTree(project_dir, function (event) {
			$scope.filetree = $sidebar.update(project_dir);
		});

		$scope.filetree = $sidebar.update(project_dir);

		console.log('filetree', $scope.filetree);
	}

	$scope.stoplight = $stoplight;

	$scope.file = {};

	$scope.file.open = function(file_path)
	{
    	var open = $file.open(/* file,  */file_path, $scope.files, $scope.fileHistory/* , file_path_history */);

    	$scope.active = open.active;

    	$scope.files = open.files;
    	$scope.fileHistory = open.fileHistory;
    }

	// close current file
	$scope.file.close = function(file_path)
	{
    	$file.close(/* file,  */file_path, $scope.files, $scope.fileHistory/* , file_path_history */);
    }

	// safe file
	$scope.file.save = function()
	{
    	$file.save($scope.files, $scope.active);
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

	win.on('close', function()
	{
		// hide ourselves first
		$scope.$apply(function() {
			$scope.loaded = false;
		});

		// fire all callbacks
		windowEventsFactory.runQueue('close');

		// close for real
		this.close(true);
	});

	window.addEventListener('load', function()
	{
		$timeout(function()
		{
			$scope.loaded = true;

			// load previous project, if available
			if( typeof window.localStorage.project_dir == 'string' )
			{
				$scope.project = $sidebar.load( window.localStorage.project_dir );

				// var watch = watchTree($rootScope.project.path, function (event) {
				// 	$scope.filetree = $sidebar.update();
				// });

				// $scope.filetree = $sidebar.update();
				$scope.updateFiletree( window.localStorage.project_dir);
			}

			/*
			// load previous files, if available
			if( typeof window.localStorage.files_open != 'undefined' )
			{
				var files_open = window.localStorage.files_open.split(',');

				if( files_open.length < 1 ) return;

				files_open.forEach(function( file_path )
				{
					if( fs.existsSync(file_path) )
					{
						$scope.file.open(file_path);
						// $rootScope.$emit('editor.open', file_path );
					}
				});

			}
			else {
				window.localStorage.files_open = '';
			}
			*/
		}, 100);
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
			$sidebar.open();

			$scope.updateFiletree(window.localStorage.project_dir);
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
			$scope.file.close();
			// $rootScope.$emit('editor.close');
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
			$scope.file.save();
			// $rootScope.$emit('editor.saveRequest'); /*where is this called?*/
		},
		key: 's',
		modifiers: 'cmd'
	}),6);

	file.insert(new gui.MenuItem({
		label: 'Save All',
		click: function() {
			$rootScope.$emit('editor.saveall'); /* again, where is this called*/
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
			// $rootScope.$emit('homey.runbrk');
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

}

ApplicationController.$inject = ['$scope', '$timeout', '$auth', '$stoplight', '$sidebar', '$file', '$events', 'windowEventsFactory', '$templateCache'];

app.controller("ApplicationController", ApplicationController);
