angular.module('sdk.file', [])
    .factory('$file', ['$rootScope', '$http', '$timeout', '$q', function ($rootScope, $http, $timeout, $q) {
	var factory = {};

	$rootScope.editorConfig = [];

    factory.open = function(/* file,  */file_path, files, fileHistory/* , file_path_history */)
    {

	    // add the file if it's not already open
	    if( typeof factory.activeFile(files, file_path) == 'undefined' ) {
	    	console.log('file undefined');
		    var info = factory.getInfo( file_path );

		    // create a file entry
		    files[ file_path ] = {
			    name		: path.basename( file_path ),
			    icon		: factory.icon( file_path ),
			    path		: file_path,
			    code		: fs.readFileSync( file_path ).toString(),
			    _changed	: false,
			    _view		: info.editor,
			    _widgets	: info.widgets
		    }

		    console.log('file undefined', files[ file_path ]);

	    }

/*
		var fileHistory = fileHistory.filter(function( file_path_history )
		{
			return file_path_history != file_path;
		});
*/

	    fileHistory.push( file_path );

	    $rootScope.$emit('editor.focus.' + file_path );

	    var json =
	    {
		    'active': file_path,
	    	'files': files,
	    	'fileHistory': fileHistory
	    };

	    return json;

//	    $scope.$apply();

	}

    // close an item
    factory.close = function(/* file,  */file_path, files, fileHistory/* , file_path_history */)
    {

	    var activeFile = this.activeFile(files, file_path);

	    // check for unsaved changes
	    if( activeFile._changed )
	    {
			    if( confirm("There are unsaved changes, close " + activeFile.name + " anyway?" ) ) {
			    delete files[ file_path ];
		    }
	    } else {
		    delete files[ file_path ];
	    }

		// set last tab as active
		// TODO: set last viewed tab as active
		/*
		if( Object.keys($scope.files).length > 0 ) {
			$scope.open( $scope.files[Object.keys($scope.files)[Object.keys($scope.files).length - 1]].path );
		} else {
			$scope.active = undefined;
		}
		*/

		// remove from file history
/*
		var fileHistory = fileHistory.filter(function( file_path_history )
		{
			return file_path_history != file_path;
		});
*/

		// set last tab as active
/*
		if( $scope.fileHistory.length > 0 )
		{
			var lastFile = fileHistory[ $scope.fileHistory.length-1 ];
			$scope.open(lastFile);
		}
		else
		{
			active = undefined;
		}
*/

		var json =
	    {
		    'active': file_path,
	    	'files': files,
	    	'fileHistory': fileHistory
	    };

	    return json;

    }

    // write the file to disk
    factory.save = function(files, active)
    {
    	console.log('before beforeSave');


    	console.log(beforeSave);
        $q.all(beforeSave)
          .then(
          function(results) {
            console.log('after beforeSave', results);
          },
          function(errors) {
            deferred.reject(errors);
          },
          function(updates) {
            deferred.update(updates);
          });


	    if( typeof active == 'undefined' ) return;

	    var activeFile = files[ active ];

	    fs.writeFileSync( activeFile.path, activeFile.code );

		activeFile._changed = false;

		$rootScope.$emit('editor.saved');
		$rootScope.$emit('editor.saved.' + activeFile.path);
    }

    factory.activeFile = function(files, file_path)
    {
    	return files[ file_path ];
    }

    // get info (which views & widgets)
    factory.getInfo = function( file_path )
    {
	    file_path = file_path.replace(window.localStorage.project_dir, '');

	    // determine the view.
	    var file = path.parse( file_path );

	    // default to codemirror
	    var editor = 'codemirror';
	    var widgets = [];

		for(var i in $rootScope.editorConfig) {
			var configItem = $rootScope.editorConfig[i];
			var extMatch = false;
			var dirMatch = false;
			var baseMatch = false;

			if(configItem.ext) {
				if(file.ext === configItem.ext) {
					extMatch = true;
				}
			}
			else {
				extMatch = true;
			}

			if(configItem.dir) {
				if(file.dir === configItem.dir) {
					dirMatch = true;
				}
			}
			else {
				dirMatch = true;
			}

			if(configItem.base) {
				if(file.base === configItem.base) {
					baseMatch = true;
				}
			}
			else {
				baseMatch = true;
			}

			if(extMatch && dirMatch && baseMatch) {
				return {
				    editor: configItem.config.editor || editor,
				    widgets: configItem.config.widgets || widgets
				}
			}
		}

		return {
		    editor: editor,
		    widgets: widgets
		}
    }

    factory.setConfig = function(config) {
	  	$rootScope.editorConfig = config;
    };

    factory.icon = function( file_path )
    {
	    return '';
    }

    return factory;
}]);