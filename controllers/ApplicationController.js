var os 			= require('os');
var fs			= require('fs-extra');
var path		= require('path');

var events 		= {};

var ApplicationController = function($scope, $rootScope, $timeout, $stoplight, $file, $events, $templateCache, ngDialog, $http)
{
	var gui = require('nw.gui');
	var win = gui.Window.get();

	var hook = Hook('global');

	// TODO: dynamically
	$timeout(function(){
		$scope.loaded = true;
	}, 700);
	
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

	// save file
	$scope.file.save = function()
	{
    	$file.save();
    }
    
    // save file through menu
    $rootScope.$on('menu.save', function(){
	   $scope.file.save(); 
    });

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

}

ApplicationController.$inject = ['$scope', '$rootScope', '$timeout', '$stoplight', '$file', '$events', '$templateCache', 'ngDialog', '$http'];

app.controller("ApplicationController", ApplicationController);
