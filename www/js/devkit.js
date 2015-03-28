var fs 			= require('fs');
var path 		= require('path');

var watchTree = require("fs-watch-tree").watchTree;

require('nw.gui').Window.get().showDevTools()

var app = angular.module('devkit', ['ui.codemirror']);

app.controller("devkitCtrl", function($scope, $rootScope) {
	
	$rootScope.project = {
		path: '/Users/emile/GitHub/nl.athom.hello/',
		metadata: {
			id: 'nl.athom.hello',
			name: 'Hello World'
		}
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
	
	// watch for any changes in the directory
	$scope.filetree = readdirSyncRecursive( $rootScope.project.path, true );

	var watch = watchTree($rootScope.project.path, function (event) {
		$scope.editor.filetree = readdirSyncRecursive( $rootScope.project.path, true );
		$scope.$apply();
	});
	
	// open a new file on sidebar click
	$scope.open = function( path ){
		$rootScope.$emit('editor.open', path);
	}
	
});

app.controller("editorCtrl", function($scope, $rootScope) {
    
	$scope.files = []; // files open
	$scope.active = ''; // currently viewing
	
	// open a new file
    $rootScope.$on('editor.open', function( event, file_path ) {
		$scope.open( file_path )
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
			});
		}
	};
	    
    $scope.open = function( file_path ){
	    
	    // check if the file is already open
	    var already_open = false;
	    $scope.files.forEach(function( file ){
			if( file.path == file_path ) {
				already_open = true;
			}
	    });
	    
	    if( !already_open ) {
		    		    
		    // create a file entry
		    $scope.files.push({
			    name: path.basename( file_path ),
			    icon: '', // todo
			    path: file_path,
			    code: fs.readFileSync( file_path ).toString()
		    });	    
	    }
	    
	    $scope.active = file_path;
    }
    
    // close an item
    $scope.close = function( file_path ) {
	    
	    // TODO check for unsaved changes
	    
		$scope.files = $scope.files.filter(function( file ){
			if( file.path == file_path ) return false;
			return true;
		});
		
		// set last tab as active
		// TODO: set last viewed tab as active
		$scope.active = $scope.files[ $scope.files.length-1 ].path;
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

app.controller("fileCtrl", function($scope, $rootScope) {
	
	// create codemirror instance
	$scope.code = 'alert("hoi!")';
	
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