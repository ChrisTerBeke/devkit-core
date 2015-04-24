app.controller("playCtrl", function($scope, $rootScope, $filter)
{
	$scope.status = '';
	$scope.shouldBeEnabled;

	$scope.playstop = function(){
		$rootScope.$emit('play.playstop', $scope.status); // listen to this in your custom play controller
	}

	$rootScope.$on('play.enable', function() { // listen to enable event (trigger in your custom play controller
		$scope.shouldBeEnabled = true;
	});

	$rootScope.$on('play.disable', function() { // listen to disable event (trigger in your custom play controller
		$scope.shouldBeEnabled = false;
	});

	$rootScope.$on('play.status', function(status) { // listen to status event (trigger in your custom play controller
		$scope.status = status;
	});
});