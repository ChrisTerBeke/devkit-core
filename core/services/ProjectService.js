angular.module('sdk.project', []).factory('$project', [ '$rootScope', '$file', function ( $rootScope, $file) {
	
	var factory = {};
	
	factory.path = false;

	factory.update = function(project_dir) {	   
    	var filetree = readdirSyncRecursive( project_dir, true );	

        return filetree;
    }

    factory.load = function(project_dir){
        window.localStorage.project_dir = project_dir;

		return factory.update(project_dir);
        
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