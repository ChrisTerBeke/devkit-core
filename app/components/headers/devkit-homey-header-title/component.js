var fs		= require('fs');
var path	= require('path');

var HeaderTitleController = function($scope, $rootScope)
{
	
	$scope.manifest = {};
	
    $scope.update = function(){
	    
	    if( typeof window.localStorage.project_dir == 'undefined' ) return;
	    
	    var manifestPath = path.join(window.localStorage.project_dir, 'app.json');
	    
	    if( fs.existsSync(manifestPath) ) {	    
		    var manifestContents = fs.readFileSync( manifestPath ).toString();
		    
		    try {
				$scope.manifest = JSON.parse(manifestContents);	    
			} catch(e){
				$scope.manifest.name.en = 'Warning: invalid app.json!';
				$scope.manifest.id = e.toString();
			}		
		}
    }

	var hook = Hook('global');
	hook.register('onManifestSave', function (e) {
		$scope.update();
	});

	$rootScope.$on('service.project.ready', function(){
		$scope.update();		
	});

	$scope.update();
    
}

HeaderTitleController.$inject = ['$scope', '$rootScope'];

app.controller("HeaderTitleController", HeaderTitleController);