angular.module('sdk.file', []).factory('$file', ['$rootScope', '$http', '$timeout', '$q', function ($rootScope, $http, $timeout, $q) {
	    
	var factory = {};
	
	factory.files = {};
	factory.active = false;
	factory.history = [];

	$rootScope.editorConfig = [];

    factory.open = function( file_path )
    {
    	console.log('open', file_path);

	    // only load the file when it's not already open
	    if( !factory.isOpen( file_path ) ) {
			
		    var info = factory.getInfo( file_path );

		    // create a file entry
		    factory.files[ file_path ] = {
			    name		: path.basename( file_path ),
			    icon		: info.icon,
			    path		: file_path,
			    code		: fs.readFileSync( file_path ).toString(),
			    _changed	: false,
			    _view		: info.editor,
			    _widgets	: info.widgets
		    }
		    
	    }
	    
	    // set the file to active
	    factory.active = file_path;
	    
	    // set the history
		factory.history = factory.history.filter(function( file_path_history ){
			return file_path_history != file_path;
		});
	    factory.history.push( file_path );
		
		// notify everyone
	    $rootScope.$emit('service.file.open', file_path );
	    $rootScope.$emit('service.file.focus', file_path );
		$rootScope.$emit('editor.focus.' + file_path );

	}
	
	factory.isOpen = function( file_path )
	{
		return typeof factory.files[ file_path ] != 'undefined';
	}
	
	factory.isChanged = function( file_path ) {
		return factory.files[ file_path ]._changed;
	}

    // close an item
    factory.close = function( file_path )
    {
	    
	    file_path = file_path || factory.active;
	    
	    // check for unsaved changes
	    var should_delete = false;
	    if( factory.files[ file_path ]._changed )
	    {
			if( confirm("There are unsaved changes, close " + factory.files[ file_path ].name + " anyway?" ) ) {
				should_delete = true;
		    }
	    } else {
		    should_delete = true;
		}
		
		if( should_delete ) {
			
			// delete from files
		    delete factory.files[ file_path ];
		    
		    // delete from history
			factory.history = factory.history.filter(function( file_path_history ){
				return file_path_history != file_path;
			});
						
			// set last tab as active
			if( factory.history.length > 0 ) {
				var lastFile = factory.history[ factory.history.length-1 ];
				factory.open( lastFile )
			} else {
				factory.active = undefined;
			}
	    }
	    
	    
	    $rootScope.$emit('service.file.close', file_path);

    }

    // write the file to disk
    factory.save = function( file_path )
    {
	    
	    file_path = file_path || factory.active;
	    
    	if(typeof beforeSave[ file_path ] !== 'undefined') 
    	{
	        var data = $q.all(beforeSave[ file_path ])
	   		.then(function(response) 
	   		{
	   			for(var i = 0; i < response.length; i++) 
	   			{
	   				response[i](function(data) 
	   				{
						factory.files[ file_path ] = angular.extend(factory.files[ file_path ], data);
					});
	   			}
	   			saveFile( file_path )
			});
    	}
    	else 
    	{
    		saveFile( file_path )
    	}
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
				    widgets: configItem.config.widgets || widgets,
				    ext: file.ext,
				}
			}
		}

		return {
		    editor: editor,
		    widgets: widgets,
		    ext: file.ext,
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

    function saveFile( file_path ) {
	    
	    console.log('saveFile', file_path)

	    var activeFile = factory.files[ file_path ];
	    
	    console.log( 'factory.files', factory.files )

	    console.log('active file on save', file_path);

	    fs.writeFileSync( file_path, activeFile.code );

		activeFile._changed = false;

		$rootScope.$emit('editor.saved');
		$rootScope.$emit('editor.saved.' + activeFile.path);
    }
}]);