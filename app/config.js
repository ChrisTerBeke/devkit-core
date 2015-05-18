window.CONFIG = {};

// paths
window.CONFIG.paths = {
	root:		window.location.protocol + '//' + window.location.hostname + ':' + window.location.port,
	login:		'https://devkit.athom.nl/auth',
	apiRoot:	'https://api.athom.nl'
};

// url whitelist
window.CONFIG.whitelist = [
	'self',
	'file://',
	'http://localhost:8080/**',
	'http://*.athom.nl/**',
	'https://*.athom.nl/**'
];