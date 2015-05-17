var fs		= require('fs');
var path	= require('path');

var tmp 		= require('tmp');
var request		= require('request');
var archiver	= require('archiver');

var HeaderPlayController = function($scope, $rootScope, $filter)
{
	
	$scope.playing = false;
	$scope.uploading = false;
	$scope.status = '';
	
	$rootScope.$watch("user", function(){
		$scope.user = $rootScope.user;
	});
	
	$rootScope.$watch("activeHomey", function(){
		$scope.activeHomey = $rootScope.activeHomey;
	});
	
	$scope.playpause = function(){
		if( $scope.playing ) {
			$scope.stop();
		} else {
			$scope.play();
		}
	}
	
	$scope.play = function( brk ) {
		
		$scope.playing = true;
		
		brk = brk || false;
		
		var homey = $filter('filter')( $rootScope.user.homeys, { _id: $rootScope.activeHomey }, true )[0];
		$scope.homey_ip = homey.ip_internal;
				
		// create zip
		$scope.status = 'Creating archive...';
		$scope.statusCode = 'zipping';
		
		console.log(window.localStorage.project_dir)
		
		$scope.pack( window.localStorage.project_dir, function( tmppath ){
						
			// send to homey
			$scope.status = 'Uploading to Homey...';
			$scope.uploading = true;
			
			$scope.upload( tmppath, brk, function( err, response ){
				$scope.uploading = false;
				$scope.$apply(function(){
								
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
						
					$scope.status = 'Running...';
					$scope.statusCode = 'running';
					$scope.running_app = response.result.id;
					
					// show devtools	
					var url = ( false ? 'https' : 'http' ) + 
						'://' +	homey.ip_internal + ':' + response.result.webport + 
						'/debug?port=' + response.result.appport
					
					var gui = require('nw.gui');	
				    $scope.debugwindow = gui.Window.open( url, {
					    toolbar: false,
					    frame: true				    
				    });
			    });				
			});
		});
	}
	
	$scope.stop = function(){
		$scope.playing = false;	
		$scope.status = '';
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
	
	$scope.upload = function( tmppath, brk, callback ) {
							
		// POST the tmp file to Homey
		$scope.request = request.post({
			url: 'http://' + $scope.homey_ip + ':8000/api/manager/devkit/',
			headers: {
	    		'Authorization': 'Bearer acediaacedia'// + window.localStorage.access_token
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