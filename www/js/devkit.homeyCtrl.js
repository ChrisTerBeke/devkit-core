var fs 			= require('fs');

var tmp 		= require('tmp');
var request		= require('request');
var archiver	= require('archiver');

app.controller("homeyCtrl", function($scope, $rootScope, $filter) {
	
	$scope.running = false;
	$scope.uploading = false;
	$scope.status = '';
	$scope.debugwindow = undefined;
	
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
		
		// create zip
		$scope.status = 'Creating archive...';
		$scope.statusCode = 'zipping';
		$scope.$apply();
		
		pack( $rootScope.project.path, function( tmppath ){
			
			// send to homey
			$scope.status = 'Uploading to Homey...';
			$scope.uploading = true;
			$scope.$apply();
			
			upload( homey, tmppath, brk, function( err, response ){
				
				if( err ) {
					$scope.statusCode = 'error';
					$scope.status = err.toString();
					return;
				}
								
				if( response instanceof Error ) {
					$scope.status = response.message;
				} else {
					$scope.status = 'Running...';
					$scope.statusCode = 'running';
					
					// show devtools	
					var url = ( $scope.homey.ssl ? 'https' : 'http' ) + 
						'://' +	$scope.homey.address + ':' + response.result.webport + 
						'/debug?port=' + response.result.appport
					
					if(typeof debugwindow != 'undefined' ) {
						debugwindow.close();					
					}
					
					var gui = require('nw.gui');	
				    $scope.debugwindow = gui.Window.open( url,{
					    toolbar: false,
					    frame: true					    
				    });
					
				}
				$scope.$apply();
				
			});
		});
	}
	
	$scope.stopZipping = function(){
		$scope.statusCode = 'idle';
		$scope.status = '';
	}
	
	$scope.stopUploading = function(){
		$scope.statusCode = 'idle';
		$scope.status = '';
	}
	
	$scope.stopRunning = function(){
		$scope.statusCode = 'idle';
		$scope.status = '';
	}
	
	$scope.stopError = function(){
		$scope.statusCode = 'idle';
		$scope.status = '';
	}
	
});

function pack( app_path, callback ){
	
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

function upload( homey, tmppath, brk, callback ) {
					
	// POST the tmp file to Homey
	request.post({
		url: 'http://' + homey.ip_internal + ':8000/api/manager/devkit/run/',
		headers: {
    		'Authorization': 'Bearer acediaacedia'
		},
		formData: {
		    app: fs.createReadStream(tmppath),
		    brk: brk
	    }
	}, function( err, data, response ){
				
		if( err ) {
			return callback(err);
		}
					    			
		response = JSON.parse(response);
		callback( null, response );
		
		/*
	    */
	    
	});
	
}