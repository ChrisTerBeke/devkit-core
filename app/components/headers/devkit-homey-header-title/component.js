var fs		= require('fs');
var path	= require('path');

var HeaderTitleController = function($scope, $rootScope)
{
	
	$scope.manifest = {};
	
    $scope.update = function(manifest){
	    
	    manifest = manifest || $scope.getManifest();
	    	    
	    if( manifest instanceof Error ) {
			$scope.manifest.name = { en: 'Warning: invalid app.json!' };
			$scope.manifest.id = manifest.toString();
		} else {
			$scope.manifest = angular.copy(manifest);			
		}
    }
    
    $scope.getManifest = function(){
	    if( typeof window.localStorage.project_dir == 'undefined' ) return;
	    
	    var manifestPath = path.join(window.localStorage.project_dir, 'app.json');
	    
	    if( fs.existsSync(manifestPath) ) {	    
		    var manifestContents = fs.readFileSync( manifestPath ).toString();
		    
		    try {
				return JSON.parse(manifestContents);	    
			} catch(e){
				return e;
			}		
		}
    }

	var hook = Hook('global');
	hook.register('onManifestSave', function (manifest) {
		$scope.update(manifest);
	});

	$rootScope.$on('service.project.ready', function(){
		$scope.update();		
	});

	$scope.update();
    
}

HeaderTitleController.$inject = ['$scope', '$rootScope'];

app.controller("HeaderTitleController", HeaderTitleController);