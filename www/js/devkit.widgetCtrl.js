app.controller("widgetCtrl", function($scope, $rootScope) {
	
	$scope.widgets = [
		{
			id: 'test',
			title: 'Test'
		}
	]
	
	$scope.widgetPath = function( widget ){
		console.log(widget)
		return './editor/widgets/' + widget.id + '.html';
	}
	
});