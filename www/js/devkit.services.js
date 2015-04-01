/*
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
*/

app.factory('windowEventsFactory', [function(){
	
	var result = {};
	var queue = {};
	
	result.addToQueue = function( event, callback ){		
		if( !Array.isArray(queue[ event ]) ) queue[ event ] = [];
		queue[ event ].push( callback );		
	}
	
	result.runQueue = function( event ) {
		queue[ event ].forEach(function(callback){
			callback.call();
		});
	}
	
	return result;
	
}]);