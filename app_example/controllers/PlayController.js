app.controller("PlayController", function($scope, $rootScope, $filter) {

	$rootScope.$on('play.playstop', function(data) {
		console.log(data);
	});

// 	$rootScope.$emit('play.enable');

// 	$rootScope.$emit('play.disable');

	$rootScope.$emit('play.status', {
		status: 'loading...'
	});
});