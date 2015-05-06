var gui			= require('nw.gui');
var path		= require('path'); // auch

var open		= require("open");
var fs			= require('fs-extra')
var trash		= require('trash');
var watchTree 	= require("fs-watch-tree").watchTree;

var SidebarController = function($scope, $rootScope, $file, $timeout) {
	
	$scope.selected = [];
	$scope.renaming = false;
	$scope.expanded = [];
	$scope.filetree = {};
	
	$scope.init = function() {
		// load previous project, if available
		if(typeof window.localStorage.project_dir == 'string') {
			$scope.loadProject(window.localStorage.project_dir);
		}
	}
	
	/*
	 * load a project
	 */
	$scope.loadProject = function(rootPath) {
		window.localStorage.project_dir = rootPath;
        $scope.$parent.path = rootPath;
        
        // filetree
		// watch for changes
		watchTree($scope.$parent.path, function (event) { // $parent is ApplicationController
			$scope.update();
		});
	
		// initial scan
		$scope.update();
        $rootScope.$emit('service.project.ready');
	}
	
	/*
	 * select a project directory
	 */
	$scope.selectProject = function() {
        var directorychooser = document.getElementById('directorychooser');
        directorychooser.addEventListener("change", function(evt) {
            $scope.loadProject(this.value);
        }, false)
        directorychooser.click();
	}

	/*
	 * select filepath
	 */
	$scope.select = function(filePath, event) {
		
		// multiple selection
        if( event.metaKey || event.ctrlKey ) {
            if( $scope.selected.indexOf(filePath) > -1 ) {
                $scope.selected = $scope.selected.filter(function(path) {
                    return path != filePath;
                });
            }
            else {
                $scope.selected.push(filePath);
            }
        }
        else {
            $scope.selected = [filePath];
        }
	}

	/*
	 * check if given filePath is currently selected
	 */
	$scope.isSelected = function(filePath) {
		return $scope.selected.indexOf(filePath) > -1;
	}
	
	/*
	 * expand filePath
	 */
	$scope.expand = function(filePath, expanded) {
		if( expanded ) {
        	$scope.expanded.push(filePath);	    
		} else {
			var index = $scope.expanded.indexOf(filePath);	
			$scope.expanded.splice(index, 1);	
		}
	}
	
	$scope.newFile = function() {
		var newFileName = 'Untitled File';
			
		if(typeof item == 'undefined') {
			var folder = $scope.$parent.path; // $parent is ApplicationController
		}
		else {
			if( fs.statSync( item.path ).isFile() ) {
				var folder = path.dirname( item.path );
			} else {
				var folder = item.path;
			}
		}
		
		var newFilePath = path.join( folder, newFileName);
								
		fs.ensureFile( newFilePath );
		$scope.renaming = newFilePath;
		
		// TODO: focus rename element
	}
	
	$scope.newFolder = function() {
		var newFolderName = 'Untitled Folder';			
			
		if(typeof item == 'undefined') {
			var folder = $scope.$parent.path; // $parent is ApplicationController
		}
		else {
			var folder = item.path;
		}
		
		fs.ensureDir( path.join( folder, newFolderName) );
	}

	/*
	 * check if filePath is extended in sidebar
	 */
	$scope.isExpanded = function(filePath) {
		return $scope.expanded.indexOf(filePath) > -1;
	}
	
	/*
	 * rename a file
	 */
	$scope.rename = function(item) {
		var newName = item.name;
        var itemFolder = path.dirname(item.path);
        var newPath = path.join(itemFolder, newName);
        
        if(fs.existsSync(newPath)) {
	       return alert("That filename already exists!");
        }

        fs.rename(item.path, newPath, function() {
	        $scope.update();
        });
        
        $scope.renaming = false;
	}
	
	/*
	 * check if given filePath is currently being renamed
	 */
	$scope.isRenaming = function(filePath) {
		return $scope.renaming === filePath;
	}

	/*
	 * open a file (or directory)
	 */
	$scope.open = function(filePath) {
		if(fs.lstatSync(filePath).isDirectory()) {
            $scope.expanded.push(path);
        }
        else {
            $file.open(filePath);
        }
	}

	/*
	 * Update scope
	 */
	$scope.update = function() {
		$scope.filetree = readdirSyncRecursive( $scope.$parent.path, true ); // $parent is ApplicationController
	}
	
	/*
	 * On drop event
	 */
	$scope.dropped = function(event, file, dropped_path) {
		dropped_path = dropped_path || $scope.$parent.path;  // $parent is ApplicationController
	    
	    // console.log('event', event, 'file', file, 'dropped_path', dropped_path)
	    
        var fileName = path.basename(file.path);

        // if dropped on a file, get the file's parent folder
        if(fs.lstatSync(dropped_path).isFile()) {
            var new_path = path.dirname(dropped_path);
        }
        else {
            var new_path = path.join(dropped_path, fileName);
        }

        // prevent overwriting
        if(fs.existsSync(new_path)) {
            if( !confirm('Overwrite `' + fileName + '`?') ) return; // ask user to confirm file overwrite
        }

        fs.copy(file.path, new_path, {}, function(err) {
	        console.log(err); // an error occured when copying file, let us know in console
        });
	};
	
	/*
	 * Show a custom context menu for the sidebar (aka the right mouse button menu)
	 * TODO: create a nicer global method to construct menus
	 */
	$scope.showCtxMenu = function(item, event) {
		// Create an empty menu
		var ctxmenu = new gui.Menu();
		
		// Add some items
		if( item ) {
			// multiple selection
			if( $scope.isSelected(item.path) ) {
				if( event.metaKey || event.ctrlKey ) {
					$scope.selected.push( item.path );
				} else {
					$scope.selected = [ item.path ];
				}
			}
			
			ctxmenu.append(new gui.MenuItem({ label: 'Open', click: function(){
				$scope.selected.forEach(function( item_path ){
					$file.open( item_path );					
				});				
			}}));
			
			ctxmenu.append(new gui.MenuItem({ label: 'Open With Default Editor', click: function(){
				$scope.selected.forEach(function( item_path ){
					open( item_path );
				});
			}}));
			
			ctxmenu.append(new gui.MenuItem({ label: 'Open File Location', click: function(){
				$scope.selected.forEach(function( item_path ){
					open(path.dirname(item_path));
				});
			}}));
			
			ctxmenu.append(new gui.MenuItem({ type: 'separator' }));
			
			ctxmenu.append(new gui.MenuItem({ label: 'Move to Trash...', click: function(){
				if( $scope.selected.length > 1 ) {
					if( confirm( "Are you sure you want to remove " + $scope.selected.length + " items to the trash?" ) ) {
						$scope.selected.forEach(function( item_path ){
							trash([ item_path ]);
						});
					}				
				}
				else {
					if( confirm( "Are you sure you want to remove `" + item.name + "` to the trash?" ) ) {
						trash([ item.path ]);
					}
				}
				$scope.apply();
			}}));
			
			// single file options
			if( $scope.selected.length == 1 ) {
				ctxmenu.append(new gui.MenuItem({ label: 'Rename...', click: function(){
					$scope.renaming = item.path;
					$scope.apply();
				}}));
			}
			
			ctxmenu.append(new gui.MenuItem({ label: 'Duplicate', click: function(){
				$scope.selected.forEach(function( item_path ){
					var new_path = newPath( item_path );
					
					var i = 2;
					while( fs.existsSync( new_path ) ) {
						new_path = newPath( item_path, i++ );
					}
									
					fs.copySync( item_path, new_path );
					$scope.apply();
				});
				
			}}));
			
			ctxmenu.append(new gui.MenuItem({ type: 'separator' }));
		}
		
		// always visible options
		ctxmenu.append(new gui.MenuItem({ label: 'New Folder', click: function() {		
			$scope.newFolder();
		}}));
		
		// new file menu item
		ctxmenu.append(new gui.MenuItem({ label: 'New File', click: function(){
			$scope.newFile();
		} }));
		
		// Popup as context menu
		ctxmenu.popup( event.clientX, event.clientY );
	}
	
	/*
	 * Listen to open new project event
	 */
	$rootScope.$on('service.project.open', function() {
		$scope.selectProject();
	});
	
	/*
	 * Listen to new file event
	 */
	$rootScope.$on('service.project.new.file', function() {
		$scope.newFile();
	});
	
	/*
	 * Listen to new folder event
	 */
	$rootScope.$on('service.project.new.folder', function() {
		$scope.newFolder();
	});

	/*
	 * Listen to sidebar tree update event
	 */
	$rootScope.$on('service.sidebar.tree.update', function(){
		$scope.update();
	});
}

SidebarController.$inject = ['$scope', '$rootScope', '$file', '$timeout'];

app.controller("SidebarController", SidebarController);

/*
 * Duplicate file or folder, but create `filename copy[n]`
 * when a duplicate already exists.
 * This was fun to do :)
 */
function newPath( file_path, index ) {
    index = index || false;

    var filename = path.basename( file_path );
    var folder = path.dirname( file_path );

    if( fs.statSync( file_path ).isFile() ) {
        var ext = path.extname( filename );
        var base = path.basename( filename, ext );

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

    var new_path = path.join( folder, new_filename );
    return new_path;
}

/*
 * Read a dir's contents recursively
 */
function readdirSyncRecursive( dir, root ) {
    root = root || false;
    var result = [];
    var contents = fs.readdirSync( dir );

    contents.forEach(function(item) {
        var item_path = path.join(dir, item);
        var item_stats = fs.lstatSync( item_path );

        if( item_stats.isDirectory() ) {
            result.push({
                name: item,
                path: path.join(dir, item),
                type: 'folder',
                stats: item_stats,
                children: readdirSyncRecursive( item_path )
            });

        }
        else {
            result.push({
                name: item,
                path: path.join(dir, item),
                type: 'file',
                stats: item_stats,
                ext: path.extname(item).replace(".", ""),
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
    }
    else {
        return result;
    }
}