app.controller("codemirrorViewCtrl", function( $scope, $rootScope, $http ){
			
	$scope.codemirrorOpts = {
		lineNumbers: true,
//		theme: 'monokai',
		mode: 'javascript',
		indentWithTabs: true,
		onLoad: function( _editor ){
		
			// fix hidden bug
			setTimeout( function(){
				_editor.refresh();
				_editor.focus();
			}, 1 );
			
			// Events
			_editor.on("change", function( _editor, changeObj ){
				
				var file = $scope.$parent.$parent.file;
											
				$rootScope.$broadcast('editor.change', changeObj);
								
				$scope.files[ $scope.active ]._changed = true;
			});
		}
	};
	
    $rootScope.$on('editor.saveRequest.' + $scope.file.path, function(){	    	    
		$rootScope.$emit('editor.performSave');
    });
	
});