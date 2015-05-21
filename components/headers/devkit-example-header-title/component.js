var fs 				= require('fs');
var	path			= require('path');
var archiver 		= require('archiver');
var request			= require('request');
var semver			= require('semver');

var ExampleHeaderController = function($scope, $rootScope, $file, $project) {
	
	$scope.status = "idle";
	$scope.manifest = "";
	$scope.message = "";
	$scope.manifestTemplate = {
        "id": "Your app ID",
        "version": "0.0.1",
        "name": "Your app name",
        "description": "This app does awesome things!",
        "author": {
            "name": "Your name",
            "email": "Your email"
        }
    };

	var hook = Hook('global');

	if($project.getPath()) {
		var manifest = JSON.parse(fs.readFileSync($project.getPath() + '/app.json', 'utf8'));

		$scope.manifest = manifest;
	}
	
	$rootScope.$on('service.project.ready', function() {
		var manifest = JSON.parse(fs.readFileSync($project.getPath() + '/app.json', 'utf8'));

		$scope.manifest = manifest;
	});

	$scope.openManifest = function() {

		$file.open($project.getPath() + '/app.json');
	}

	hook.register('onManifestSave',
		function (e) {
	        fs.readFile($project.getPath() + '/app.json', 'utf8', function read(err, data) {
			    if (err) {
			        throw err;
			    }
			    manifest = JSON.parse(data);

			    $scope.$apply(function() {
					$scope.manifest = manifest;
				});
			});
		}
	);
};

ExampleHeaderController.$inject = ['$scope', '$rootScope', '$file', '$project'];

app.controller("ExampleHeaderController", ExampleHeaderController);