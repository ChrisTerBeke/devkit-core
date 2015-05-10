var fs 				= require('fs');
var	path			= require('path');
var archiver 		= require('archiver');
var request			= require('request');
var semver			= require('semver');

var FormideUploadController = function($scope, $rootScope) {
	
	$scope.status = "idle";
	$scope.message = "";
	
	$scope.run = function() {
		$scope.status = "checking"; // change status to checking
		
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
		gui.Shell.openExternal("https://apps.formide.com");
	};
	
	$scope.compressAndUpload = function() {
		
		var projectDir = localStorage.getItem('project_dir');
		var zipFile = projectDir + '/app.zip';
		var zip = fs.createWriteStream(zipFile);
		var archive = archiver('zip');
		var manifest = fs.readFileSync(projectDir + '/app.json', 'utf8');
		manifest = JSON.parse(manifest);
		
		if(semver.valid(manifest.version) == null) {
			$scope.status = 'failed';
			$scope.message = 'Invalid version number. Use semver!';
			return;
		}
		
		$scope.status = "uploading"; // change status to compressing
		
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
				url: 'https://api2.formide.com/apps/upload?access_token=' + window.localStorage.access_token,
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
				}
				$scope.$apply();
			});
			
			var form = r.form();
			form.append('version', manifest.version); // TODO: auto update manifest version after upload?
			form.append('app_id', manifest.id);
			form.append('app_file', fs.createReadStream(zipFile, {filename: 'app.zip', contentType: 'application/zip'}));
		});
	};
};

FormideUploadController.$inject = ['$scope', '$rootScope'];

app.controller("FormideUploadController", FormideUploadController);