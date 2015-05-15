var fs 				= require('fs');
var	path			= require('path');
var archiver 		= require('archiver');
var request			= require('request');
var semver			= require('semver');

var FormideUploadController = function($scope, $rootScope, $file) {
	
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
	
	var manifest = JSON.parse(fs.readFileSync(window.localStorage.project_dir + '/app.json', 'utf8'));

	$scope.manifest = manifest;

	hook.register('onManifestSave',
		function (e) {
	        fs.readFile(window.localStorage.project_dir + '/app.json', 'utf8', function read(err, data) {
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
	
	$scope.createApp = function(rootPath) { // do custom things when creating a new project
    	fs.readdir(rootPath, function(err, files) {
        	if (err) return console.log(err);
        	
        	if(files.length > 0) {
            	return alert("This directory is not empty!");
            }
            
        	fs.mkdirSync(rootPath + "/assets");
        	fs.mkdirSync(rootPath + "/scripts");
            fs.writeFileSync(rootPath + "/app.json", JSON.stringify($scope.manifestTemplate));
            fs.writeFileSync(rootPath + "/scripts/app.js", "");
            fs.writeFileSync(rootPath + "/index.html", '<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>My Awesome App</title>
	<script data-main="scripts/app.js"></script>
	<link rel="stylesheet" href="style.css">
</head>
<body>
	<h1>Hello World!</h1>
</body>
</html>');
            fs.writeFileSync(rootPath + "/style.css", "");
    	});
	};

	$scope.uploadApp = function() {
		$scope.status = "checking"; // change status to checking
		$scope.message = "";
		
		if($scope.hasSession()) {
			$scope.compressAndUpload();	
		}
		else {
			$scope.status = "failed";
			alert('Not logged in!');
		}
	};
	
	$scope.hasSession = function() {
		return window.localStorage.access_token !== undefined;
	};
	
	$scope.goToAppManager = function() {
		var projectDir = window.localStorage.project_dir;
		var manifest = fs.readFileSync(projectDir + '/app.json', 'utf8');
		manifest = JSON.parse(manifest);
		gui.Shell.openExternal(window.CONFIG.paths.appManager + "/apps?app_id=" + manifest.id);
	};
	
	$scope.viewApp = function() {
    	var projectDir = window.localStorage.project_dir;
        gui.Shell.openExternal("file:///" + projectDir + '/index.html');
	};

	$scope.openManifest = function() {
		$file.open(window.localStorage.project_dir + '/app.json');
	}

	$scope.compressAndUpload = function() {
		
		var projectDir = window.localStorage.project_dir;
		var zipFile = projectDir + '/app.zip';
		var zip = fs.createWriteStream(zipFile);
		var archive = archiver('zip');
		var manifest = fs.readFileSync(projectDir + '/app.json', 'utf8');
		manifest = JSON.parse(manifest);

		$scope.manifest = manifest;

		if(semver.valid(manifest.version) == null) {
			$scope.status = 'failed';
			$scope.message = 'Invalid version number. Use semver!';
			return;
		}
		
		$scope.status = "uploading"; // change status to uploading
		
		archive.pipe(zip);
		
		archive.bulk([{
			expand: true,
			cwd: projectDir,
			src: ['**']
		}]);
		
		archive.finalize(function(err, bytes) {
			if(err) {
				console.log(err);
			}
		});
		
		zip.on('close', function() {
			var r = request({
				url: window.CONFIG.paths.apiRoot + '/apps/upload?access_token=' + window.localStorage.access_token,
				method: 'post',
				strictSSL: false
			}, function(err, httpResponse, body) {
				if (err) return console.log(err);
				var response = JSON.parse(body);
				if(response.success) {
					$scope.status = "uploaded";
					$scope.message = "";
				}
				else {
					$scope.status = "failed";
					$scope.message = response.message;

					alert('Failed ' + response.message);
				}
				
                manifest.version = semver.inc(manifest.version, 'patch');
				fs.writeFileSync(window.localStorage.project_dir + '/app.json', JSON.stringify(manifest), 'utf8');
				
				fs.unlink(zipFile);
				$scope.$apply();
			});
			
			var form = r.form();
			form.append('version', manifest.version); // TODO: auto update manifest version after upload?
			form.append('app_id', manifest.id);
			form.append('app_file', fs.createReadStream(zipFile, {filename: 'app.zip', contentType: 'application/zip'}));
		});
	};
	
	$rootScope.$on('project.run', function() { // TODO: maybe create a hook for this?
    	$scope.viewApp();
	});
	
	$rootScope.$on('service.project.createInDirectory', function(e, data) { // TODO: maybe create a hook for this?
        $scope.createApp(data);
    });
};

FormideUploadController.$inject = ['$scope', '$rootScope', '$file'];

app.controller("FormideUploadController", FormideUploadController);