angular.module('custom.play', [])
    .factory('$customPlay', ['$rootScope', '$http', '$timeout', '$q', function ($rootScope, $http, $timeout, $q) {
	var factory = {};

	$rootScope.$on('play.playstop', function(e, data) {
		console.log(data);
	});

	factory.enable = function() {
		$rootScope.$emit('play.enable');
	};

	factory.disable = function() {
		$rootScope.$emit('play.disable');
	};

	factory.status = function(status) {
		$rootScope.$emit('play.status', {
			status: status
		});
	};

    return factory;
}]);