//Set main paths here.
window.PATH = window.PATH || {};

window.PATH.root 			=	window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

window.PATH.auth			= {
	loginUrl: 'https://sdk.formide.com',
	userInfo: 'https://api2.formide.com/auth/me'
}

window.PATH.appManager = 'https://apps.formide.com';
window.PATH.apiRoot = 'https://api2.formide.com';