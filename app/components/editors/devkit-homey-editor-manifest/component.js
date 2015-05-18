var fs 		= require('fs');
var fse		= require('fs-extra');
var path 	= require('path');

var semver	= require('semver');

var EditorManifestController = function( $scope, $rootScope, $http, $q, $events )
{
	
	$scope.manifest = angular.fromJson( $scope.file.code );
		
	$scope.file._changed = false;
	
	$scope.languages = [
		{
			code: 'en',
			name: 'English'
		},
		{
			code: 'nl',
			name: 'Dutch'
		},
		{
			code: 'de',
			name: 'German'
		},
		{
			code: 'fr',
			name: 'French'
		},
		{
			code: 'es',
			name: 'Spanish'
		}
	];
	$scope.activeLanguage = 'en';
	
	var hook = Hook('global');
	
	$scope.$watch('manifest', function(){
		$scope.file._changed = true;
		hook.call('onManifestChange', $scope.manifest);
	}, true);

	$events.beforeSave($scope.file.path, function(cb) {
		var manifest = $scope.manifest;

		if(semver.valid(manifest.version)) {
		
			// replace autocomplete entries
			manifest.permissions = manifest.permissions.filter(function(tag){ return tag; }).map(function(tag) { return tag.text; });
			
			manifest.speech.forEach(function( trigger ){
				for( var synonym_lang in trigger.synonyms ) {
					var synonyms = trigger.synonyms[synonym_lang].filter(function(tag){ return tag; }).map(function(tag) { return tag.text; });
					if( synonyms.length > 0 ) { 
						trigger.synonyms[synonym_lang] = synonyms;
					} else {
						delete trigger.synonyms[synonym_lang];
					}
				}
			});

			// save the file
			cb({
				code: angular.toJson( manifest, true )
			});
			
			hook.call('onManifestSave', manifest);
		}
		else {
			//TODO: Add version number.
			alert('Invalid Version Number');
			// console.log('Invalid Version');
		}
	});
    
    // permissions
	$scope.autocompletePermissionTags = function( query ){
		return $http.get('./app/components/editors/devkit-homey-editor-manifest/assets/autocomplete/permissions.json');
	}
	
	// mobile
	$scope.autocompleteInterfacesMobileFiles = function( query, ext ) {
		// get files
		var cssdir = path.join( $rootScope.project.path, 'mobile', ext );
		return fs.readdirSync( cssdir ).filter(function(file){
			return path.extname( file ) == '.' + ext;
		});
	}
    
    // speech
    /*
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
    */
    
    $scope.addSpeechTrigger = function(){
	    
	    $scope.manifest.speech = $scope.manifest.speech || [];
	    
	    $scope.manifest.speech.push({
			id: '',
			importance: 0.3,
			synonyms: {
				"en": []
			}
	    });
    }
    
    $scope.removeSpeechTrigger = function( trigger ) {
		var index = $scope.manifest.speech.indexOf(trigger);
		$scope.manifest.speech.splice(index, 1);     
    }
    
    // flow
    $scope.addFlowTrigger = function(){
	    $scope.manifest.flow = $scope.manifest.flow || {};
	    $scope.manifest.flow.triggers = $scope.manifest.flow.triggers || [];
	    
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
    
    $scope.addFlowArg = function( trigger ){
	    trigger.args = trigger.args || [];
	    trigger.args.push({
		    name: '',
		    type: 'text',
		    placeholder: {}
	    })
    }
    
    $scope.removeFlowArg = function( trigger, arg ){
		var index = trigger.args.indexOf(arg);
		trigger.args.splice(index, 1);  
    }
    
    // icon
	var iconUrlTemplate = path.join( window.localStorage.project_dir, 'assets', 'icon.svg');
	$scope.iconUrl = iconUrlTemplate + '?r=' + Math.random();
	
    $scope.received = function( event, file ) {
	    
	    if( file.type != 'image/svg+xml' ) {
		    alert('Only svg files are allowed for your app icon');
		    return;
	    }
	    
	    var assets_path = path.join( window.localStorage.project_dir, 'assets' );
	    var icon_path 	= path.join( assets_path, 'icon.svg' );
	    
		if( fs.existsSync( icon_path ) ) {
			if( ! confirm("Overwrite existing icon?") ) {
				return;
			}
		}

		fse.ensureDir(assets_path, function (err) {				
			fse.copy( file.path, icon_path, {}, function( err  ){
				if (err) return console.error(err)
				$scope.$apply(function(){
					$scope.iconUrl = iconUrlTemplate + '?r=' + Math.random();
				});
			});		
		});
		
    }
	
	/*
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
    */
    	
}

EditorManifestController.$inject = ['$scope', '$rootScope', '$http', '$q', '$events'];

app.controller("EditorManifestController", EditorManifestController);