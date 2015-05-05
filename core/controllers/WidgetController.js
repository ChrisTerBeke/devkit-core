var WidgetController = function($scope, $rootScope)
{
	$scope.getWidgetPath = function( name ) {
		return $rootScope.modules['widget'][name];
	}
}

WidgetController.$inject = ['$scope', '$rootScope'];

app.controller("WidgetController", WidgetController);