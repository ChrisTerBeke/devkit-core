var fs 		= require('fs-extra');
var path 	= require('path');

app.controller("manifestViewCtrl", function( $scope, $rootScope, $http, $q ){
	
	$scope.manifest = angular.fromJson( $scope.file.code );
	$rootScope.project.metadata = $scope.manifest;
	$scope.file._changed = false;
	$scope.iconUrlTemplate = $rootScope.project.path + '/assets/icon.svg';
	
	$scope.iconUrl = $scope.iconUrlTemplate + '?r=' + Math.random();
	
	$scope.$watch('manifest', function(){
		$scope.file._changed = true;
	}, true);
	
    $rootScope.$on('editor.saveRequest.' + $scope.file.path, function(){	    	    
		$scope.file.code = angular.toJson( $scope.manifest, true );
		$rootScope.$emit('editor.performSave');
    });
    
	$scope.autocompletePermissionTags = function( query ){
		return $http.get('./res/autocomplete/permissions.json');
	}
    
    $scope.autocompleteSynonyms = function( query ) {
		return $q(function(resolve, reject) {
			$http
				.get('http://words.bighugelabs.com/api/2/ffa216479deb64dc5d75cba46f27b682/' + query + '/json')
				.success(function( data ){					
					resolve( data.noun.syn );					
				})
				.error(function(data){
					reject();
				});
		});
    }
    
    $scope.addTrigger = function(){
	    $scope.manifest.interfaces.speech.triggers.push({
			id: '',
			importance: 0.3,
			synonyms: {
				"en": []
			}
	    });
    }
    
    $scope.received = function( event, file ) {
	    
	    if( file.type != 'image/svg+xml' ) {
		    alert('Only svg files are allowed for your app icon');
		    return;
	    }
	    
	    var assets_path = path.join( $rootScope.project.path, 'assets' );
	    var icon_path 	= path.join( assets_path, 'icon.svg' );
	    
		if( fs.existsSync( icon_path ) ) {
			if( ! confirm("Overwrite existing icon?") ) {
				return;
			}
		}
		
		fs.ensureDirSync( assets_path );
				
		fs.copy( file.path, icon_path, {}, function( err  ){
			if (err) return console.error(err)
	
			$scope.iconUrl = $scope.iconUrlTemplate + '?r=' + Math.random();
		});
		
    }
    	
});