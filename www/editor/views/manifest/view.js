var fs 		= require('fs-extra');
var path 	= require('path');

app.controller("manifestViewCtrl", function( $scope, $rootScope, $http, $q ){
	
	$scope.manifest = angular.fromJson( $scope.file.code );
	$rootScope.project.metadata = $scope.manifest;
	$scope.file._changed = false;
	$scope.iconUrlTemplate = $rootScope.project.path + '/assets/icon.svg';
	
	$scope.languages = $rootScope.languages;
	$scope.activeLanguage = 'en';
	
	$scope.iconUrl = $scope.iconUrlTemplate + '?r=' + Math.random();
	
	$scope.$watch('manifest', function(){
		$scope.file._changed = true;
	}, true);
	
    $rootScope.$on('editor.saveRequest.' + $scope.file.path, function(){
	    
	    var manifest = angular.copy( $scope.manifest );
		
		manifest.permissions = manifest.permissions.filter(function(tag){ return tag; }).map(function(tag) { return tag.text; });
		
		manifest.interfaces.speech.triggers.forEach(function( trigger ){
			for( var synonym_lang in trigger.synonyms ) {
				var synonyms = trigger.synonyms[synonym_lang].filter(function(tag){ return tag; }).map(function(tag) { return tag.text; });
				if( synonyms.length > 0 ) { 
					trigger.synonyms[synonym_lang] = synonyms;
				} else {
					delete trigger.synonyms[synonym_lang];
				}
			}
		});
	     	    
		$scope.file.code = angular.toJson( manifest, true );
		$rootScope.$emit('editor.performSave');
    });
    
	$scope.autocompletePermissionTags = function( query ){
		return $http.get('./res/autocomplete/permissions.json');
	}
	
	$scope.autocompleteInterfacesMobileFiles = function( query, ext ) {
		// get files
		var cssdir = path.join( $rootScope.project.path, 'mobile', ext );
		return fs.readdirSync( cssdir ).filter(function(file){
			return path.extname( file ) == '.' + ext;
		});
	}
    
    $scope.autocompleteSynonyms = function( query ) {
	    return [];
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
    
    
    $scope.addFlowTrigger = function(){
	    if( typeof $scope.manifest.flow == 'undefined' ) $scope.manifest.flow = {};
	    if( typeof $scope.manifest.flow.triggers == 'undefined' ) $scope.manifest.flow.triggers = [];
	    $scope.manifest.flow.triggers.push({
			method: '',
			title: {
				en: ''
			}
	    });
    }
    $scope.removeFlowTrigger = function( trigger ) {
		var index = $scope.manifest.flow.triggers.indexOf(trigger);
		$scope.manifest.flow.triggers.splice(index, 1);     
    }
    
    $scope.addSpeechTrigger = function(){
	    $scope.manifest.interfaces.speech.triggers.push({
			id: '',
			importance: 0.3,
			synonyms: {
				"en": []
			}
	    });
    }
    
    $scope.removeSpeechTrigger = function( trigger ) {
		var index = $scope.manifest.interfaces.speech.triggers.indexOf(trigger);
		$scope.manifest.interfaces.speech.triggers.splice(index, 1);     
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