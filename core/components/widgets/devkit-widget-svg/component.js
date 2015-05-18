app
.controller("svgWidgetCtrl", function( $scope, $rootScope ){

	$scope.src = $scope.file_path;

	$rootScope.$on('editor.saved.' + $scope.file_path, function(){
		$scope.src = $scope.file_path + '?rand=' + Math.random()
	});

});