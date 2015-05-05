var fs 		= require('fs-extra');
var path 	= require('path');

app.controller("manifestViewCtrl", function( $scope, $rootScope, $http, $q, $events ){
	console.log('manifest path', $scope.file.path);
	$scope.manifest = angular.fromJson( $scope.file.code );
	//$rootScope.project.metadata = $scope.manifest;
	$scope.file._changed = false;

	var code;
	//$scope.iconUrlTemplate = $rootScope.project.path + '/assets/icon.svg';

	//$scope.languages = $rootScope.languages;
	$scope.activeLanguage = 'en';

	$scope.iconUrl = $scope.iconUrlTemplate + '?r=' + Math.random();

	$scope.$watch('manifest', function(){
		$scope.file._changed = true;
	}, true);

	// $events.beforeSave($scope.file.path, function() {
	// 	// var manifest = angular.copy( $scope.manifest );

	// 	// console.log('manifest data', $scope.manifest);

	// 	return {
	// 		code: angular.toJson( $scope.manifest, true )
	// 	}
	// });

	$events.beforeSave($scope.file.path, function(cb) {
		cb({
			code: angular.toJson( $scope.manifest, true )
		});
	})

  //   $rootScope.$on('editor.saveRequest.' + $scope.file.path, function(){

  //   	console.log('save request');

	 //    var manifest = angular.copy( $scope.manifest );

		// manifest.permissions = manifest.permissions.filter(function(tag){ return tag; }).map(function(tag) { return tag.text; });

		// manifest.interfaces.speech.triggers.forEach(function( trigger ){
		// 	for( var synonym_lang in trigger.synonyms ) {
		// 		var synonyms = trigger.synonyms[synonym_lang].filter(function(tag){ return tag; }).map(function(tag) { return tag.text; });
		// 		if( synonyms.length > 0 ) {
		// 			trigger.synonyms[synonym_lang] = synonyms;
		// 		} else {
		// 			delete trigger.synonyms[synonym_lang];
		// 		}
		// 	}
		// });

		// $scope.file.code = angular.toJson( manifest, true );
		// $rootScope.$emit('editor.performSave');
  //   });

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