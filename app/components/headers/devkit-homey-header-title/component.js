var fs		= require('fs');
var path	= require('path');

var TitleController = function($scope, $rootScope, $project)
{
	
	$scope.name = '';
	$scope.id = '';
	
	var manifest_path = path.join($project.path, 'app.json');
	
	fs.readFile( manifest_path, function( err, data ) {
		if( err ) throw err;
		
		var manifest = JSON.parse( data.toString() );
		
		$scope.$apply(function(){
			$scope.name = manifest.name.en;
			$scope.id	= manifest.id;
		});
	});
	
    $rootScope.$on('service.project.ready', function(){
		alert($project.path)	    
    });
    
    
}

TitleController.$inject = ['$scope', '$rootScope', '$project'];

app.controller("TitleController", TitleController);