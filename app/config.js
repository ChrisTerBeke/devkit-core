window.CONFIG = {};

// paths
window.CONFIG.paths = {
	root:		window.location.protocol + '//' + window.location.hostname + ':' + window.location.port,
	login:		'',
	user:		'',
	appManager:	'',
	apiRoot:	''
};

// url whitelist
window.CONFIG.whitelist = [
	'self',
	'file://',
	'http://localhost:8080/**'
];