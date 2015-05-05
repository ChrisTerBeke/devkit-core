angular.module('sdk.project', []).factory('$project', [ '$rootScope', '$file', function ( $rootScope, $file ) {
	
	var factory = {};
	
	factory.path = false;

    factory.load = function(project_dir){

        // save for restart
        window.localStorage.project_dir = project_dir;
        factory.path = project_dir;
        
        $rootScope.$emit('service.project.ready');
        
		// load previous files, if available
		/*
		if( typeof window.localStorage.files_open != 'undefined' )
		{
			var files_open = window.localStorage.files_open.split(',');

			if( files_open.length < 1 ) return;

			files_open.forEach(function( file_path )
			{
				if( fs.existsSync(file_path) )
				{
					$file.open(file_path);
					// $rootScope.$emit('editor.open', file_path );
				}
			});

		}
		else {
			window.localStorage.files_open = '';
		}
		*/
        
    }
    
    factory.select = function(){
	    var self = this;
        var directorychooser = document.getElementById('directorychooser');
        directorychooser.addEventListener("change", function(evt) {
            self.load( this.value );
        }, false)
        directorychooser.click();
    }

    return factory;
    
}]);