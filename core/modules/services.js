var module = module || {};

module.services = angular.module('module.services', [
	'sdk.events',
	'sdk.file',
	'sdk.stoplight',
	'sdk.play',
	'sdk.moduleload',
	'service.windowEventsFactory'
]);