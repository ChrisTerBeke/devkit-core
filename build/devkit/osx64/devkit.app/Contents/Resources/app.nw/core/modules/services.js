var module = module || {};

module.services = angular.module('module.services', [
	'sdk.auth',
	'sdk.events',
	'sdk.file',
	'sdk.sidebar',
	'sdk.stoplight',
	'sdk.play',
	'sdk.moduleload',
	'service.windowEventsFactory'
]);