var gui			= require('nw.gui');
var path_		= require('path'); // auch

var open		= require("open");
var fs			= require('fs-extra')
var trash		= require('trash');
var watchTree 	= require("fs-watch-tree").watchTree;
	
angular.module('sdk.sidebar', []).factory('$sidebar', [ '$rootScope', '$file', '$project', '$http', '$timeout', '$q', function ($rootScope, $file, $project, $http, $timeout, $q) {
	var factory = {};
	
	// various
	factory.renaming = false;

	// Selected items
	factory.selected = [];
	
    factory.select = function(path, event) {

        // multiple selection
        if( event.metaKey || event.ctrlKey ) {
            if( factory.selected.indexOf(path) > -1 ) {
                factory.selected = factory.selected.filter(function(path_) {
                    return path_ != path;
                });
            }
            else {
                factory.selected.push( path );
            }
        }
        else {
            factory.selected = [ path ];
        }
    }

    factory.isSelected = function( path ) {
        return factory.selected.indexOf(path) > -1;
    }
    
    // Expanded items
	factory.expanded = [];
	
    factory.expand = function( path, expanded ) {
	    if( expanded ) {
        	factory.expanded.push( path );	    
		} else {
			var index = factory.expanded.indexOf(path);	
			factory.expanded.splice(index, 1);	
		}
    }

    factory.isExpanded = function( path ) {
        return factory.expanded.indexOf(path) > -1;
    }

    // rename a file
    factory.isRenaming = function( path ){
	    return factory.renaming === path;
    }
    factory.rename = function( item ){
	    var newName = item.name;
        var itemFolder = path_.dirname( item.path );
        var newPath = path_.join( itemFolder, newName );
        
        if( fs.existsSync( newPath ) ) {
	       return alert("That filename already exists!");
        }

        fs.rename( item.path, newPath, function(){
	        factory.update();
        });

        factory.renaming = false;
	    
    }

	// open a file (or directory)
	factory.open = function( path ) {
		if( fs.lstatSync( path ).isDirectory() ) {
            factory.expanded.push(path);
        } else {
            $file.open( path );
        }
	}

    factory.keyPress = function( event, item ) {
        console.log( event, item );
    }

    factory.update = function( ) {	    
        factory.filetree = readdirSyncRecursive( $project.path, true );
		$rootScope.$emit('service.sidebar.tree.update');
    }

    factory.dropped = function( event, file, dropped_path ) {
	    
	    dropped_path = dropped_path || $project.path;
	    
	    console.log('event', event, 'file', file, 'dropped_path', dropped_path)
	    
        var filename = path_.basename( file.path );

        // if dropped on a file, get the file's parent folder
        if( fs.lstatSync(dropped_path).isFile() ) {
            var new_path = path_.dirname( dropped_path );
        }
        else {
            var new_path = path_.join( dropped_path, filename );
        }

        // prevent overwriting
        if( fs.existsSync( new_path ) ) {
            if( !confirm('Overwrite `' + filename + '`?') ) return;
        }

        fs.copy( file.path, new_path, {}, function(err){});
    }
    
	factory.showCtxMenu = function( item, event ){
		
		// Create an empty menu
		var ctxmenu = new gui.Menu();
		
		// Add some items
		if( item ) {
		
			// multiple selection
			if( factory.isSelected(item.path) ) {
				if( event.metaKey || event.ctrlKey ) {
					factory.selected.push( item.path );
				} else {
					factory.selected = [ item.path ];
				}
			}
			
			ctxmenu.append(new gui.MenuItem({ label: 'Open', click: function(){
				factory.selected.forEach(function( item_path ){
					$file.open( item_path );					
				});				
			}}));
			ctxmenu.append(new gui.MenuItem({ label: 'Open With Default Editor', click: function(){
				factory.selected.forEach(function( item_path ){
					open( item_path );
				});
			}}));
			ctxmenu.append(new gui.MenuItem({ label: 'Open File Location', click: function(){
				factory.selected.forEach(function( item_path ){
					open( path_.dirname( item_path ) );
				});
			}}));
			ctxmenu.append(new gui.MenuItem({ type: 'separator' }));
			ctxmenu.append(new gui.MenuItem({ label: 'Move to Trash...', click: function(){
				
				if( factory.selected.length > 1 ) {
					if( confirm( "Are you sure you want to remove " + factory.selected.length + " items to the trash?" ) ) {
						factory.selected.forEach(function( item_path ){
							trash([ item_path ]);
						});
					}				
				} else {
					if( confirm( "Are you sure you want to remove `" + item.name + "` to the trash?" ) ) {
						trash([ item.path ]);
					}
				}
			}}));
			
			// single file options
			if( factory.selected.length == 1 ) {
				ctxmenu.append(new gui.MenuItem({ label: 'Rename...', click: function(){
					factory.renaming = item.path;
				}}));
			}
			
			ctxmenu.append(new gui.MenuItem({ label: 'Duplicate', click: function(){
				
				factory.selected.forEach(function( item_path ){
					var new_path = newPath( item_path );
					
					var i = 2;
					while( fs.existsSync( new_path ) ) {
						new_path = newPath( item_path, i++ );
					}
									
					fs.copySync( item_path, new_path );
				});
				
			}}));
			ctxmenu.append(new gui.MenuItem({ type: 'separator' }));
		}
		
		// always visible options
		ctxmenu.append(new gui.MenuItem({ label: 'New Folder', click: function(){		
			var newFolderName = 'Untitled Folder';			
			
			if( typeof item == 'undefined' ) {
				var folder = $project.path;
			} else {
				var folder = item.path;
			}
			
			fs.ensureDir( path_.join( folder, newFolderName) );
		}}));
		ctxmenu.append(new gui.MenuItem({ label: 'New File', click: function(){
		
			var newFileName = 'Untitled File';
			
			if( typeof item == 'undefined' ) {
				var folder = $project.path;
			} else {
				
				if( fs.statSync( item.path ).isFile() ) {
					var folder = path_.dirname( item.path );
				} else {
					var folder = item.path;
				}
			}
			
			var newFilePath = path_.join( folder, newFileName);
									
			fs.ensureFile( newFilePath );
			factory.renaming = newFilePath;
			// TODO: focus rename element
			
		} }));
		
		// Popup as context menu
		ctxmenu.popup( event.clientX, event.clientY );
	}
	
    $rootScope.$on('service.project.ready', function(){
	   	
		// filetree
		// watch for changes
		var watch = watchTree($project.path, function (event) {
			factory.filetree = factory.update();
		});
	
		// initial scan
		factory.filetree = factory.update();
		
	});

    return factory;
    
}]);

// Duplicate file or folder, but create `filename copy[ n]`
// when a duplicate already exists.
// This was fun to do :)
function newPath( file_path, index ) {
    index = index || false;

    var filename = path_.basename( file_path );
    var folder = path_.dirname( file_path );

    if( fs.statSync( file_path ).isFile() ) {
        var ext = path_.extname( filename );
        var base = path_.basename( filename, ext );

        if( index ) {
            var new_filename = base + ' copy ' + index.toString() + ext;
        }
        else {
            var new_filename = base + ' copy' + ext;
        }

    }
    else {
        var new_filename = filename + ' copy'
        if( index ) new_filename += ' ' + index.toString();
    }

    var new_path = path_.join( folder, new_filename );
    return new_path;
}

// read a dir's contents recursively
function readdirSyncRecursive( dir, root ) {
    root = root || false;
    var result = [];
    var contents = fs.readdirSync( dir );

    contents.forEach(function(item) {
        var item_path = path_.join(dir, item);
        var item_stats = fs.lstatSync( item_path );

        if( item_stats.isDirectory() ) {
            result.push({
                name: item,
                path: path_.join(dir, item),
                type: 'folder',
                stats: item_stats,
                children: readdirSyncRecursive( item_path )
            });

        }
        else {
            result.push({
                name: item,
                path: path_.join(dir, item),
                type: 'file',
                stats: item_stats,
                ext: path_.extname(item).replace(".", ""),
            });
        }
    });

    if( root ) {
        return [{
            type: 'folder',
            name: path_.basename( dir ),
            path: dir,
            children: result,
            stats: fs.lstatSync( dir )
        }];
    }
    else {
        return result;
    }
}