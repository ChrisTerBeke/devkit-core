var TitleController = function($scope, $auth)
{
	$scope.name = 'foo';
	$scope.bar = 'nl.athom.hello';
}

TitleController.$inject = ['$scope'];

app.controller("TitleController", TitleController);