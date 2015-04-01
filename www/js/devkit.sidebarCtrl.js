var path 		= require('path');

var open		= require("open");
var fs			= require('fs-extra')
var watchTree 	= require("fs-watch-tree").watchTree;
var trash		= require('trash');

app.controller("sidebarCtrl", function($scope, $rootScope) {
	
	$scope.filetree = {};
	
	$rootScope.$on('project.loaded', function(){
			
		// watch for any changes in the directory
		var watch = watchTree($rootScope.project.path, function (event) {
			$scope.update();
		});

		$scope.update();
		
	});
	
	// open a new file on sidebar click
	$scope.open = function( file_path ){
		$rootScope.$emit('editor.open', file_path );
	}
	
	$scope.update = function(){
		$scope.filetree = readdirSyncRecursive( $rootScope.project.path, true );
		$scope.$apply();
	}
	
	$scope.showCtxmenu = function( item, event ){
		
		// create context menu	
		var gui = require('nw.gui');
	
		// Create an empty menu
		var ctxmenu = new gui.Menu();
		
		// Add some items
		if( item ) {
			ctxmenu.append(new gui.MenuItem({ label: 'Open', click: function(){
				$rootScope.$emit('editor.open', item.path );				
			}}));
			ctxmenu.append(new gui.MenuItem({ label: 'Open With Default Editor', click: function(){
				open( item.path );
			}}));
			ctxmenu.append(new gui.MenuItem({ label: 'Open File Location', click: function(){
				open( path.dirname( item.path ) );
			}}));
			ctxmenu.append(new gui.MenuItem({ type: 'separator' }));
			ctxmenu.append(new gui.MenuItem({ label: 'Duplicate', click: function(){
				
				// duplicate file or folder, but create `filename copy[ n]` when a duplicate already exists. this was fun to do :)
				function newPath( file_path, index ) {
					
					index = index || false;
					
					var filename = path.basename( file_path );
					var folder = path.dirname( file_path );
					
					if( fs.statSync( file_path ).isFile() ) {
												
						var ext = path.extname( filename );
						var base = path.basename( filename, ext );
						
						if( index ) {
							var new_filename = base + ' copy ' + index.toString() + ext;
						} else {
							var new_filename = base + ' copy' + ext;
						}
						
					} else {
						var new_filename = filename + ' copy'	
						if( index ) new_filename += ' ' + index.toString();					
					}
					
					var new_path = path.join( folder, new_filename );
					return new_path;					
				}
				
				var new_path = newPath( item.path );
				
				var i = 2;
				while( fs.existsSync( new_path ) ) {
					new_path = newPath( item.path, i++ );
				}
								
				fs.copySync( item.path, new_path );
				
			}}));
			ctxmenu.append(new gui.MenuItem({ type: 'separator' }));
			ctxmenu.append(new gui.MenuItem({ label: 'Move to Trash...', click: function(){
				if( confirm( "Are you sure you want to remove " + item.name + " to the trash?" ) ) {
					trash([ item.path ]);
				}
			}}));
			ctxmenu.append(new gui.MenuItem({ type: 'separator' }));
		}
		ctxmenu.append(new gui.MenuItem({ label: 'New Folder' }));
		ctxmenu.append(new gui.MenuItem({ label: 'New File' }));
		
		// Popup as context menu
		ctxmenu.popup( event.clientX, event.clientY );
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