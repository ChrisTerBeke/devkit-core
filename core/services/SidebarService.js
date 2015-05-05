angular.module('sdk.sidebar', [])
    .factory('$sidebar', ['$file', '$http', '$timeout', '$q', function ($file, $http, $timeout, $q) {
	var factory = {};

	factory.selected = [];

    factory.select = function(selected, event, path) {
        var selected = selected || {};

        // multiple selection
        if( event.metaKey || event.ctrlKey ) {
            if( selected.indexOf(path) > -1 ) {
                selected = factory.selected.filter(function(path_) {
                    return path_ != path;
                });
            }
            else {
                selected.push( path );
            }
        }
        else {
            selected = [ path ];
        }

        return selected;
    }

    factory.load = function(project_dir){
        // $rootScope.project.path = project_dir;

        // console.log('i loaded');

        // load metadata
        var metadata = fs.readFileSync( path.join( project_dir, 'app.json' ) ).toString();
            metadata = JSON.parse( metadata );

        // var watch = watchTree(project_dir, function (event) {
        //     // $scope.filetree = $sidebar.update();
        //     return {
        //         path: project_dir,
        //         metadata: metadata,
        //         filetree: factory.update();
        //     };
        // });

        // $scope.filetree = $sidebar.update();
        // $rootScope.project.metadata = metadata;
        // $rootScope.$emit('project.loaded');

        // save for restart
        window.localStorage.project_dir = project_dir;

        return {
            path: project_dir,
            metadata: metadata,
            // filetree: factory.update();
        };
    }

    factory.open = function(){
	    var self = this;
        var directorychooser = document.getElementById('directorychooser');
        directorychooser.addEventListener("change", function(evt) {
            self.load( this.value );
        }, false)
        directorychooser.click();
    }

    //TODO rewrite this function
    // rename a file
    factory.submitRename = function( item ) {
        var currentPath = item.path;
        var itemFolder = path.dirname( item.path );
        var newPath = path.join( itemFolder, item.name );

        fs.rename( currentPath, newPath );

        item.renaming = false;
    }

    factory.isSelected = function( path ) {
        return factory.selected.indexOf(path) > -1;
    }

    //TODO rewrite this function

    // open a new file on sidebar click
/*
    factory.open = function( item )
    {

        if( fs.lstatSync( item.path ).isDirectory() )
        {
            item.expanded = !item.expanded;
        }
        else
        {
            $rootScope.$emit('editor.open', item.path );
        }
    }
*/

	factory.openFile = function(item, files, fileHistory) {
		if( fs.lstatSync( item.path ).isDirectory() ) {
            item.expanded = !item.expanded;
        }
        else {
            console.log('open', files, fileHistory);
            return $file.open(/* file,  */item.path, files, fileHistory/* , file_path_history */);

            // // $rootScope.$emit('editor.open', item.path );


            // $scope.active = open.active;

            // $scope.files = open.files;
            // $scope.fileHistory = open.fileHistory;
        }
	}

    factory.keyPress = function( event, item ) {
        console.log( event, item );
    }


    //TODO: Update this function
    factory.update = function(project_dir) {
        var dir = readdirSyncRecursive( project_dir, true );
        return dir;
        // $scope.$apply();
    }

    factory.dropped = function( event, file, dropped_path ) {
        var filename = path.basename( file.path );

        // if dropped on a file, get the file's parent folder
        if( fs.lstatSync(dropped_path).isFile() ) {
            var new_path = path.dirname( dropped_path );
        }
        else {
            var new_path = path.join( dropped_path, filename );
        }

        // prevent overwriting
        if( fs.existsSync( new_path ) ) {
            if( !confirm('Overwrite `' + filename + '`?') ) return;
        }

        fs.copy( file.path, new_path, {}, function(err){});
    }

    function readdirSyncRecursive( dir, root ) {
        root = root || false;
        var result = [];
        var contents = fs.readdirSync( dir );

        contents.forEach(function(item) {
            var item_path = path.join(dir, item);
            var item_stats = fs.lstatSync( item_path );
            var file = path.parse(item_path);

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
                    ext: file.ext.replace(".", ""),
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
        }
        else {
            return result;
        }
    }

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

    return factory;
}]);