app.run(['$rootScope', '$timeout', '$play', function($rootScope, $timeout, $play) {
	$timeout(function() {
		$play.status('loading...');
	}, 100);
}]);