app.controller("animationWidgetCtrl", function( $scope, $rootScope, $http ){
	
	$scope.animation = function(){
		return [];
	};

	// animate on filechange
	$scope.$on('editor.change', function(){
		$scope.animate();
	});
	
	$scope.animate = function(){
		
		$scope.animation = $scope.$parent.files[ $scope.$parent.active ].path;
		var animation = require( $scope.$parent.files[ $scope.$parent.active ].path );
			animation = animation();
			
		console.log( animation );
	}
	
});