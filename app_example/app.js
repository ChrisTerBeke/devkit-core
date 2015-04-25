app.run(['$rootScope', '$timeout', function($rootScope, $timeout) {
	$timeout(function() {
		$rootScope.$emit('play.status', 'loading...');
	}, 100);
}]);