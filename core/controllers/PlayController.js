app.controller("playCtrl", ['$scope', '$rootScope', '$play', function($scope, $rootScope, $play) {

	$scope.status = {};
	$scope.shouldBeEnabled = [];

	$rootScope.$on('play.status', function(e, status) {
		console.log(status);
		$scope.status = status;
	});

	$scope.playstop = function() {
		$play.playstop($scope.status);
	};
}]);