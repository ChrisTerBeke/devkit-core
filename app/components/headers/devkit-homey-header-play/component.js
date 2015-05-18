var fs		= require('fs');
var path	= require('path');

var tmp 		= require('tmp');
var request		= require('request');
var archiver	= require('archiver');

var HeaderPlayController = function($scope, $rootScope, $filter)
{
		
	var logsEl = document.getElementById('logs');
	
	$scope.playing 		= false;
	$scope.uploading 	= false;
	$scope.stopping 	= false;
	$scope.status 		= false;
	
	$rootScope.$watch("user", function(){
		$scope.user = $rootScope.user;
	});
	
	$rootScope.$watch("activeHomey", function(){		
		$scope.homey = $filter('filter')( $rootScope.user.homeys, { _id: $rootScope.activeHomey }, true )[0];
		logsEl.src = 'http://' + $scope.homey.ip_internal + '/manager/devkit/#/?token=' + $scope.homey.token;
	});
	
	$scope.playpause = function(){
			
		if( typeof $scope.homey == 'undefined' ) {
			alert('Please select a Homey first');
			return;
		}
		
		if( $scope.stopping ) return;
		//if( $scope.uploading ) return;
			
		if( $scope.playing ) {
			$scope.stop( $scope.homey.ip_internal, 80, $scope.homey.token );
		} else {
			$scope.play( $scope.homey.ip_internal, 80, $scope.homey.token, false );
		}
	}
	
	$scope.play = function( address, port, token, brk ) {
		
		address = address || '127.0.0.1';
		port = port || 80;
		brk = brk || false;
						
		// create zip
		$scope.status = 'Creating archive...';
		$scope.statusCode = 'zipping';
		
		$scope.pack( window.localStorage.project_dir, function( tmppath ){
									
			// send to homey
			$scope.$apply(function(){
				$scope.status = 'Uploading to Homey...';
				$scope.uploading = true;
			});
			
			$scope.upload( tmppath, address, port, token, brk, function( err, response ){
				
				$scope.$apply(function(){
					
					$scope.uploading = false;
								
					if( err ) {
						$scope.statusCode = 'error';
						$scope.status = err.toString();
						return;
					}
					
					if( response.status != 200 ) {
						$scope.statusCode = 'error';
						$scope.status = response.result.toString();
						return;					
					}
									
					if( response instanceof Error ) {
						$scope.statusCode = 'error';
						$scope.status = response.message;
						return;
					}
						
					$scope.status = 'Running';
					$scope.playing = true;
					$scope.running_app = response.result.app_id;
					
					// show logs
					logsEl.src = 'http://' + address + '/manager/devkit/#/?app=' + response.result.app_id;
					logsEl.parentElement.classList.add('visible-1');
					setTimeout(function(){
						logsEl.parentElement.classList.add('visible-2');
					}, 1);
			    });				
			});
		});
	}
	
	$scope.stop = function( address, port, token ){
		
		$scope.stopping = true;
		$scope.playing = false;
		$scope.status = 'Stopping ' + $scope.running_app + '...';
		
		// hide logs
		
		logsEl.parentElement.classList.remove('visible-2');
		setTimeout(function(){
			logsEl.parentElement.classList.remove('visible-1');
		}, 300);
		
		$scope.request = request.del({
			url: 'http://' + address + ':' + port + '/api/manager/devkit/' + $scope.running_app,
			headers: {
	    		'Authorization': 'Bearer ' + token
			}
		}, function( err, data, response ){
			if( err ) return callback(err);
			
			$scope.$apply(function(){
				$scope.status = false;
				$scope.stopping = false;
			});
		});
	}
	
	// functions for packing & uploading
	$scope.pack = function( app_path, callback ){
	
		// create a temporary file
		tmp.file(function(err, tmppath, fd, cleanupCallback) {
						
			var output = fs.createWriteStream(tmppath);
			
			output.on('close', function() {
	    		callback( tmppath );
			});
			
			var archive = archiver('zip');
			
			archive.on('error', function(err) {
				throw err;
			});
			
			archive.pipe(output);
			
			archive
				.directory( app_path, '' )
				.finalize();
				
		});
	}
	
	$scope.upload = function( tmppath, address, port, token, brk, callback ) {
							
		// POST the tmp file to Homey
		$scope.request = request.post({
			url: 'http://' + address + ':' + port + '/api/manager/devkit/',
			headers: {
	    		'Authorization': 'Bearer ' + token
			}
		}, function( err, data, response ){
			if( err ) return callback(err);
			callback( null, JSON.parse(response) );
		});
		
		var form = $scope.request.form();
		form.append('app', fs.createReadStream(tmppath));
		form.append('brk', brk.toString());
		
	}
    
}

HeaderPlayController.$inject = ['$scope', '$rootScope', '$filter'];

app.controller("HeaderPlayController", HeaderPlayController);

// logs
window.addEventListener('load', function(){
	
	var logsWrapEl = document.createElement("div");
	logsWrapEl.id = 'logs-wrap';
	document.body.appendChild(logsWrapEl);
	
	var logsEl = document.createElement("iframe");
	logsEl.id = 'logs';
	logsWrapEl.appendChild(logsEl);
	
});