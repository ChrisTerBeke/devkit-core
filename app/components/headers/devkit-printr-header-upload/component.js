var fs 				= require('fs');
var	path			= require('path');
var archiver 		= require('archiver');
var request			= require('request');
var semver			= require('semver');
var tmp             = require('tmp');

var FormideUploadController = function($scope, $rootScope) {
	
	$scope.status = "idle";
	$scope.manifest = "";
	$scope.message = "";

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
		gui.Shell.openExternal(window.CONFIG.paths.appManager + "?app_id=" + manifest.id);
	};
	
	$scope.viewApp = function() {
    	var projectDir = window.localStorage.project_dir;
        gui.Shell.openExternal("file:///" + projectDir + '/index.html');
	};

	$scope.compressAndUpload = function() {
		
		var projectDir = window.localStorage.project_dir;
		var zipFile = tmp.fileSync();
		var zip = fs.createWriteStream(zipFile.name);
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
				zipFile.removeCallback();
				$scope.$apply();
			});
			
			var form = r.form();
			form.append('version', manifest.version); // TODO: auto update manifest version after upload?
			form.append('app_id', manifest.id);
			form.append('app_file', fs.createReadStream(zipFile.name, {filename: 'app.zip', contentType: 'application/zip'}));
		});
	};
};

FormideUploadController.$inject = ['$scope', '$rootScope'];

app.controller("FormideUploadController", FormideUploadController);