var module = module || {};

module.services = angular.module('module.services', [
	'sdk.auth',
	'sdk.file',
	'sdk.sidebar',
	'sdk.stoplight',
	'sdk.play',
	'service.windowEventsFactory'
]);