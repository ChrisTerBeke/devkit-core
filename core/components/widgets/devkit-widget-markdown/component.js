app.controller("markdownWidgetCtrl", function( $scope, $rootScope, $sce ){

	$scope.html = '';
	
	$scope.$watch('file.code', function(code){
		
		$scope.html = $sce.trustAsHtml( markdown.toHTML( code ) );
		
	});
});