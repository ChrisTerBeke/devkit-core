var fs 			= require('fs');

var tmp 		= require('tmp');
var request		= require('request');
var archiver	= require('archiver');

app.controller("homeyCtrl", function($scope, $rootScope) {
	
	$scope.running = false;
	$scope.uploading = false;
	$scope.status = '';
	$scope.debugwindow = undefined;
	
	$scope.homey = {
		ssl: false,
		address: 'localhost'
	}
	
	$rootScope.$on('homey.run', function(){
		$scope.run( false );
		$scope.$apply();
	});
	$rootScope.$on('homey.runbrk', function(){
		$scope.run( true );
		$scope.$apply();
	});
	
	$scope.playstop = function(){
		if( $scope.running ) {
			$scope.stopRunning();
		} else if( $scope.uploading ) {
			$scope.stopUploading();
		} else {
			$scope.run();
		}
	}
	
	$scope.run = function( brk ){
		$scope.uploading = true;
		
		// create zip
		$scope.status = 'Creating archive...';
		$scope.$apply();
		
		pack( $rootScope.project.path, function( tmppath ){
			
			// send to homey
			$scope.status = 'Uploading to Homey...';
			$scope.$apply();
			upload( tmppath, brk, function( response ){
				
				$scope.uploading = false;
								
				if( response instanceof Error ) {
					$scope.status = response.message;
					$scope.running = false;
				} else {
					$scope.status = 'Running...';
					
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
	
	$scope.stopRunning = function(){
		$scope.running = false;
	}
	
	$scope.stopUploading = function(){
		$scope.uploading = false;		
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

function upload( tmppath, brk, callback ) {
	
	// POST the tmp file to Homey
	request.post({
		url: 'http://localhost:8000/api/manager/devkit/run/',
		headers: {
    		'Authorization': 'Bearer acediaacedia'
		},
		formData: {
		    app: fs.createReadStream(tmppath),
		    brk: brk
	    }
	}, function( err, data, response ){
				
		if( err ) return callback( new Error(err) );
					    			
		response = JSON.parse(response);
		callback( response );
		
		/*
	    */
	    
	});
	
}