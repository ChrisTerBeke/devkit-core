var module = module || {};

module.services = angular.module('module.services', [
	'sdk.events',
	'sdk.file',
	'sdk.stoplight',
	'sdk.moduleload',
	'sdk.popup',
	'sdk.project',
	'sdk.menu'
]);