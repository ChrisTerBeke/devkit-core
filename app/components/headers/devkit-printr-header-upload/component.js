var fs 				= require('fs');
var	path			= require('path');
var archiver 		= require('archiver');
var request			= require('request');

var FormideUploadController = function($scope, $rootScope) {
	
	$scope.run = function() {
		if($scope.hasSession()) {
			$scope.compressAndUpload();	
		}
		else {
			alert('Not logged in!');
		}
	};
	
	$scope.hasSession = function() {
		return window.localStorage.access_token !== undefined;
	};
	
	$scope.compressAndUpload = function() {
		
		var projectDir = localStorage.getItem('project_dir');
		var zipFile = projectDir + '/app.zip';
		var zip = fs.createWriteStream(zipFile);
		var archive = archiver('zip');
		
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
			console.log('Uploading app...');
			
			var r = request({
				url: 'https://api2.formide.com/apps/upload?access_token=' + window.localStorage.access_token,
				method: 'post',
				strictSSL: false
			}, function(err, httpResponse, body) {
				if (err) return console.log(err);
				var response = JSON.parse(body);
				if(response.success) {
					console.log('upload ok');
					// do something
				}
				else {
					console.log('upload failed', response);
					// do something
				}
			});
			
			var form = r.form();
			form.append('version', '1.0.0'); // TODO: get version from manifest and auto update after uploading?
			form.append('app_id', ''); // TODO: get app id from manifest
			form.append('app_file', fs.createReadStream(zipFile, {filename: 'app.zip', contentType: 'application/zip'}));
		});
	};
};

FormideUploadController.$inject = ['$scope', '$rootScope'];

app.controller("FormideUploadController", FormideUploadController);