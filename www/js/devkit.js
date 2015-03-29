var os 			= require('os');
var fs 			= require('fs');
var path 		= require('path');

var watchTree = require("fs-watch-tree").watchTree;

//require('nw.gui').Window.get().showDevTools()

var app = angular.module('devkit', ['ui.codemirror', 'cfp.hotkeys', 'ngTagsInput']);

var keycombos = [ 'ctrl+s', 'ctrl+w' ];

app.controller("devkitCtrl", function($scope, $rootScope, $http, hotkeys) {
	
	$rootScope.project = {
		path: '/Users/emile/GitHub/nl.athom.hello/',
		metadata: {
			"id": "nl.athom.hello",
			"version": "1.0.0",
			"name": {
				"en": "Hello World",
				"nl": "Hallo wereld"
			},
			"description": {
				"en": "Example app for Homey"
			},
			"author": {
				"name": "Emile Nijssen",
				"website": "http://www.emilenijssen.nl"
			},
			"dependencies": {
				"socket.io": "^1.1.0"
			},
			"permissions": [
				"homey:manager:speech-input"
			],
			"interfaces": {
				"speech": {
					"triggers": [
						{
							"id": "hello",
							"importance": 0.6,
							"synonyms": {
								"en": [ "hello", "hi", "hey" ],
								"nl": [ "hallo", "hai", "hoi", "hey" ]
							}
						}
					]
				}
			}
		}
	}
		
	$scope.run = function(){
		alert('run')
	}
	
	$scope.platform = os.platform();
	
	// progressbar
	$scope.progressbar = 0;
	
    $rootScope.$on('progressbar', function( event, percent ) {
	    console.log(percent)
		$scope.progressbar = percent;
    });
	
	// bind hotkeys
	keycombos.forEach(function(combo){
		
		var combo_ = combo;
		
		// replace CTRL by CMD on OSX
		if( os.platform() == 'darwin' ) {
			combo_ = combo_.replace('ctrl', 'meta');
		}
				
		hotkeys.add({
			combo: combo_,
			callback: function(){
				$rootScope.$emit('keycombo.' + combo);
			}
		});
		
	});
	
	$scope.autocompletePermissionTags = function( query ){
		return $http.get('permissions.json');
	}
	
});


	
function readdirSyncRecursive( dir, root ) {
	
	root = root || false;
	
	var result = [];
	
	var contents = fs.readdirSync( dir );
	contents.forEach(function(item){
		
		var item_path = path.join(dir, item);
		var item_stats = fs.lstatSync( item_path );
		
		if( item_stats.isDirectory() ) {
			
			result.push({
				name: item,
				path: path.join(dir, item),
				type: 'folder',
				stats: item_stats,
				children: self.readdirSyncRecursive( item_path )
			});
			
		} else {
			
			result.push({
				name: item,
				path: path.join(dir, item),
				type: 'file',
				stats: item_stats
			});
				
		}			
		
	});
	
	if( root ) {	
		return [{
			type: 'folder',
			name: path.basename( dir ),
			path: dir,
			children: result,
			stats: fs.lstatSync( dir )
		}];	
	} else {
		return result;
	}
	
}

app.controller("sidebarCtrl", function($scope, $rootScope) {
	
	// open a new file on sidebar click
	$scope.open = function( path ){
		$rootScope.$emit('editor.open', path);
	}
	
	$scope.update = function(){
		$scope.filetree = readdirSyncRecursive( $rootScope.project.path, true );
	}

	$scope.update();
		
	// watch for any changes in the directory
	var watch = watchTree($rootScope.project.path, function (event) {
		$scope.update();
		$scope.$apply();
	});
	
});

app.controller("editorCtrl", function($scope, $rootScope) {
    
	$scope.files = {}; // files open
	$scope.active = undefined; // currently viewing
	
	// open a new file
    $rootScope.$on('editor.open', function( event, file_path ) {
		$scope.open( file_path )
    });
    
    $rootScope.$on('keycombo.ctrl+s', function(){
		$scope.save();
    });
    
    $rootScope.$on('keycombo.ctrl+w', function(){
		$scope.close();
    });
	
	// codemirror related
	// TODO: move this to a seperate controller? file? i dunno!
	$scope.codemirrorOpts = {
		lineNumbers: true,
		theme: 'monokai',
		mode: 'javascript',
		indentWithTabs: true,
		onLoad: function( _editor ){
		
			// fix hidden bug
			setTimeout( function(){
				_editor.refresh();
				_editor.focus();
			}, 1 );
			
			// Events
			_editor.on("change", function( _editor, changeObj ){
				console.log('change', changeObj)
				
				$scope.files[ $scope.active ]._changed = true;
			});
		}
	};
	    
    $scope.open = function( file_path ){
	    
	    // add the file if it's not already open
	    if( typeof $scope.files[ file_path ] == 'undefined' ) {
		    		    
		    // create a file entry
		    $scope.files[ file_path ] = {
			    name: path.basename( file_path ),
			    icon: '', // todo
			    path: file_path,
			    code: fs.readFileSync( file_path ).toString(),
			    _changed: false
		    } 
	    }
	    
	    $scope.active = file_path;
    }
    
    // close an item
    $scope.close = function( file_path ) {
	    
	    if( typeof $scope.active == 'undefined' ) return;
	    
	    var activeFile = $scope.files[ $scope.active ];
	    
	    // check for unsaved changes
	    if( activeFile._changed ) {
		    if( confirm("There are unsaved changes, close " + activeFile.name + " anyway?" ) ) {
			    delete $scope.files[ $scope.active ];
		    }
	    } else {
		    delete $scope.files[ $scope.active ];
	    }
		
		// set last tab as active
		// TODO: set last viewed tab as active
		if( Object.keys($scope.files).length > 0 ) {			
			$scope.active = $scope.files[Object.keys($scope.files)[Object.keys($scope.files).length - 1]].path;
		}
    }
    
    $scope.save = function(){
	    if( typeof $scope.active == 'undefined' ) return;
	    
	    $rootScope.$emit('progressbar', 0);
	    
	    var activeFile = $scope.files[ $scope.active ];
	    
	    fs.writeFileSync( activeFile.path, activeFile.code );
	    
	    $rootScope.$emit('progressbar', 1);
				
		activeFile._changed = false;
    }
    
    $scope.view = function( file_path ) {
	    
	    file_path = file_path.replace($rootScope.project.path, '');
	    
	    // determine the view. default = codemirror
	    var file = path.parse( file_path );	    
	    var view = 'codemirror';
	    
	    if( file.base == 'app.json' && file.dir == '' ) view = 'manifest';	    
	    
	    return 'editor/views/' + view + '.html';
    }
    
});

app.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
            });
        }
    };
});