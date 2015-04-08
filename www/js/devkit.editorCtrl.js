app.controller("editorCtrl", function($scope, $rootScope, windowEventsFactory) {
    
	$scope.files = {}; // files open
	$scope.active = undefined; // currently viewing
	$scope.fileHistory = [];
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
		$scope.close( $scope.active );
    });
    
    windowEventsFactory.addToQueue('close', function(){
	    
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
	    
		$scope.fileHistory =  $scope.fileHistory.filter(function( file_path_history ){
			return file_path_history != file_path;
		});
	    $scope.fileHistory.push( file_path );
	    	    
	    $rootScope.$emit('editor.focus.' + file_path );
	    
//	    $scope.$apply();
	    
	}
    
    // close an item
    $scope.close = function( file_path ) {
	    	    
	    var activeFile = $scope.files[ file_path ];
	    
	    // check for unsaved changes
	    if( activeFile._changed ) {
			    if( confirm("There are unsaved changes, close " + activeFile.name + " anyway?" ) ) {
			    delete $scope.files[ file_path ];
		    }
	    } else {
		    delete $scope.files[ file_path ];
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
		$scope.fileHistory =  $scope.fileHistory.filter(function( file_path_history ){
			return file_path_history != file_path;
		});
						
		// set last tab as active
		if( $scope.fileHistory.length > 0 ) {
			var lastFile = $scope.fileHistory[ $scope.fileHistory.length-1 ];
			$scope.open( lastFile )
		} else {
			$scope.active = undefined;
		}
		
    }

    // write the file to disk	    
    $scope.save = function(){
	    
	    if( typeof $scope.active == 'undefined' ) return;
	   
	    var activeFile = $scope.files[ $scope.active ];
	    
	    fs.writeFileSync( activeFile.path, activeFile.code );
				
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