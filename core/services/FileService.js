angular.module('sdk.file', [])
    .factory('$file', ['$rootScope', '$http', '$timeout', '$q', function ($rootScope, $http, $timeout, $q) {
	var factory = {};

	$rootScope.editorConfig = [];

    factory.open = function(/* file,  */file_path, files, fileHistory/* , file_path_history */)
    {

	    // add the file if it's not already open
	    if( typeof this.activeFile(files, file_path) == 'undefined' ) {

		    var info = this.getInfo( file_path );

		    // create a file entry
		    files[ file_path ] = {
			    name		: path.basename( file_path ),
			    icon		: factory.icon( file_path ),
			    path		: file_path,
			    code		: fs.readFileSync( file_path ).toString(),
			    _changed	: false,
			    _view		: info.view,
			    _widgets	: info.widgets
		    }

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
	    }

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

		return
	    {
		    active: active
	    }

    }

    // write the file to disk
    factory.save = function(files, active)
    {

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
	    file_path = file_path.replace($rootScope.project.path, '');

	    // determine the view.
	    var file = path.parse( file_path );

	    // default to codemirror
	    var view = 'codemirror';
	    var widgets = [];
/*
	    // find a specific one
		// "/app.json"
	    if( file.base == 'app.json' && file.dir == '/' ) {
		    view = 'manifest';
		    widgets = [];
		}

		// "/animations/*.js"
	    if( file.ext == '.js' && file.dir == '/animations' ) {
		    view = 'codemirror';
		    widgets = [ 'ledring' ];
		}

		// "*.svg"
	    if( file.ext == '.svg' ) {
		    view = 'codemirror';
		    widgets = [ 'svg' ];
		}
*/
		for(var i in $rootScope.editorConfig) {
			var configItem = $rootScope.editorConfig[i];
			console.log(configItem);
			console.log(file);
			if(file.ext === configItem.ext && file.dir === configItem.dir) {
				console.log('test');
				return {
				    view: configItem.config.view,
				    widgets: configItem.config.widgets
				}
			}
		}

		return {
		    view: view,
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