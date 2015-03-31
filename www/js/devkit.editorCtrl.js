app.controller("editorCtrl", function($scope, $rootScope) {
    
	$scope.files = {}; // files open
	$scope.active = undefined; // currently viewing
	$scope.Object = Object;
	
	// open a new file
    $rootScope.$on('editor.open', function( event, file_path ) {
		$scope.open( file_path )
    });
    
    $rootScope.$on('editor.saveRequest', function(){
		$rootScope.$emit('editor.saveRequest.' + $scope.active);
    });
    
    $rootScope.$on('editor.performSave', function(){
		$scope.save();
    });
    
    $rootScope.$on('editor.close', function(){
		$scope.close();
    });
    
    $rootScope.$on('devkit.close', function(){
	    
		window.localStorage.files_open = '';
		
		var files_open = [];
		
		for( var file_path in $scope.files ) {
			files_open.push( file_path );
		}
		
		window.localStorage.files_open = files_open.join(',');
		
    });
	    
    $scope.open = function( file_path ){
	    
	    // add the file if it's not already open
	    if( typeof $scope.files[ file_path ] == 'undefined' ) {
		    
		    var info = $scope.getInfo( file_path );
		    		    		    
		    // create a file entry
		    $scope.files[ file_path ] = {
			    name		: path.basename( file_path ),
			    icon		: $scope.icon( file_path ),
			    path		: file_path,
			    code		: fs.readFileSync( file_path ).toString(),
			    _changed	: false,
			    _view		: info.view,
			    _widgets	: info.widgets
		    }
		    
	    }
	    
	    $scope.active = file_path;
	    $scope.$apply();
	    
	}
    
    // close an item
    $scope.close = function( file_path ) {
	    
	    if( typeof $scope.active == 'undefined' ) return;
	    
	    var activeFile = $scope.files[ $scope.active ];
	    
	    // check for unsaved changes
	    if( activeFile._changed ) {
		    if( confirm("There are unsaved changes, close " + activeFile.name + " anyway?" ) ) {
			    delete $scope.files[ $scope.active ];
				window.localStorage.open_files.remove( file_path );
		    }
	    } else {
		    delete $scope.files[ $scope.active ];
			window.localStorage.open_files.remove( file_path );
	    }
		
		// set last tab as active
		// TODO: set last viewed tab as active
		if( Object.keys($scope.files).length > 0 ) {			
			$scope.active = $scope.files[Object.keys($scope.files)[Object.keys($scope.files).length - 1]].path;
		} else {
			$scope.active = undefined;
		}
    }

    // write the file to disk	    
    $scope.save = function(){
	    
	    if( typeof $scope.active == 'undefined' ) return;
	    
	    $rootScope.$emit('progressbar', 0);
	    
	    var activeFile = $scope.files[ $scope.active ];
	    
	    fs.writeFileSync( activeFile.path, activeFile.code );
	    
	    $rootScope.$emit('progressbar', 1);
				
		activeFile._changed = false;
		
		$rootScope.$emit('editor.saved');
    }
    
    // get info (which views & widgets)
    $scope.getInfo = function( file_path ) {
	    
	    file_path = file_path.replace($rootScope.project.path, '');
	    
	    // determine the view.
	    var file = path.parse( file_path );
	    
	    // default to codemirror
	    var view = 'codemirror';
	    var widgets = [];
		
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
		
	    return {
		    view: view,
		    widgets: widgets
		}
	    
    }
    
    $scope.icon = function( file_path ){
	    return '';
    }
    
});