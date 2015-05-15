window.CONFIG = {};

// paths
window.CONFIG.paths = {
	root:		window.location.protocol + '//' + window.location.hostname + ':' + window.location.port,
	login:		'https://sdk.formide.com',
	user:		'https://api2.formide.com/auth/me',
	appManager:	'https://apps.formide.com',
	apiRoot:	'https://api2.formide.com'
};

// url whitelist
window.CONFIG.whitelist = [
	'self',
	'file://',
	'http://localhost:8080/**',
	'http://*.formide.com/**',
	'https://*.formide.com/**'
];