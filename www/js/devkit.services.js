var homeyServices = angular.module('homeyServices', ['ngResource']);

homeyServices.factory('Homey', ['$resource', function($resource){
	return $resource('/manager/devkit/', {}, {
		query: {
			method:'GET',
			params:{
				phoneId: 'phones'
			},
			isArray: true
		}
	});
}]);