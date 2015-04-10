var fs 			= require('fs');

var tmp 		= require('tmp');
var request		= require('request');
var archiver	= require('archiver');

app.controller("homeyCtrl", function($scope, $rootScope, $filter) {
	
	$scope.running = false;
	$scope.uploading = false;
	$scope.status = '';
	$scope.statusCode = 'idle';
	$scope.debugwindow = undefined;
	
	$scope.homey_ip = '0.0.0.0';
	$scope.request = undefined;
	$scope.running_app = undefined;
	
	$rootScope.$on('homey.run', function(){
		$scope.run( false );
		$scope.$apply();
	});
	$rootScope.$on('homey.runbrk', function(){
		$scope.run( true );
		$scope.$apply();
	});
	
	$scope.playstop = function(){
		if( $scope.statusCode == 'zipping' ) {
			$scope.stopZipping();
		} else if( $scope.statusCode == 'uploading' ) {
			$scope.stopUploading();
		} else if( $scope.statusCode == 'running' ) {
			$scope.stopRunning();
		} else if( $scope.statusCode == 'error' ) {
			$scope.stopError();
		} else if( $scope.statusCode == 'idle' ) {
			$scope.run( false );
		}
	}
	
	$scope.run = function( brk ){
						
		if( ! $rootScope.sharedVars.activeHomey ) return;
				
		var homey = $filter('filter')( $rootScope.user.homeys, { _id: $rootScope.sharedVars.activeHomey }, true )[0];
		$scope.homey_ip = homey.ip_internal;
		
		// create zip
		$scope.status = 'Creating archive...';
		$scope.statusCode = 'zipping';
		$scope.$apply();
		
		$scope.pack( $rootScope.project.path, function( tmppath ){
			
			// send to homey
			$scope.status = 'Uploading to Homey...';
			$scope.uploading = true;
			$scope.$apply();
			
			$scope.upload( tmppath, brk, function( err, response ){
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
	
	$scope.stopZipping = function(){
		$scope.statusCode = 'idle';
		$scope.status = '';
	}
	
	$scope.stopUploading = function(){
		$scope.request.abort();		
		$scope.statusCode = 'idle';
		$scope.status = '';
	}
	
	$scope.stopRunning = function(){
		$scope.statusCode = 'idle';
		$scope.status = '';
					
		if(typeof $scope.debugwindow != 'undefined' ) {
			$scope.debugwindow.close();					
		}
		
		$scope.request = request.del({
			url: 'http://' + $scope.homey_ip + ':8000/api/manager/devkit/' + $scope.running_app,
			headers: {
	    		'Authorization': 'Bearer acediaacedia'// + window.localStorage.access_token
			}
		});
		
		
	}
	
	$scope.stopError = function(){
		$scope.statusCode = 'idle';
		$scope.status = '';
	}
	
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
	
});