angular.module('sdk.play', []).factory('$play', ['$rootScope', function ($rootScope) {
	var factory = {};

	factory.playstop = function(status) {
		$rootScope.$emit('play.playstop', status);
	};

	factory.status = function(status) {
		$rootScope.$emit('play.status', status);
	};

	factory.enable = function() {
		$rootScope.$emit('play.enable');
	};

	factory.disable = function() {
		$rootScope.$emit('play.disable');
	};

    return factory;
}]);