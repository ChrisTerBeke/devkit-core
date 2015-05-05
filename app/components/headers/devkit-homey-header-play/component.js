var PlayController = function($scope, $rootScope)
{

	$scope.status = {};
	$scope.shouldBeEnabled = false;

	$scope.playstop = function() 
	{
		console.log('playstop');
		$rootScope.$emit('play.playstop', $scope.status);
	};

	$rootScope.$on('play.enable', function() 
	{
		$scope.shouldBeEnabled = true;
	});

	$rootScope.$on('play.disable', function() 
	{
		$scope.shouldBeEnabled = false;
	});

	$rootScope.$on('play.status', function(e, status) 
	{
		console.log(status);
		$scope.status = status;
	});
}

PlayController.$inject = ['$scope', '$rootScope'];

app.controller("PlayController", PlayController);