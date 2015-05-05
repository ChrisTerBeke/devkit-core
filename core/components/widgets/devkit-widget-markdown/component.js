angular.module('module.modules').controller("markdownWidgetCtrl", function( $scope, $rootScope, $timeout ){

	$timeout(function(){
		$scope.update();
	}, 100);

	$rootScope.$on('editor.change.' + $scope.file_path, function(){
		console.log('test');
		$timeout(function(){
			$scope.update();
		}, 100)
	});

	$scope.update = function(){
		$scope.code = $scope.$parent.files[ $scope.$parent.active ].code;
	}
});

console.log('I loaded markdown.js');