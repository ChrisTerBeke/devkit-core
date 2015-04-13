//Set main paths here.
window.PATH = window.PATH || {};

window.PATH.root 			=	window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;

window.PATH.api 			= 	window.PATH.root + '/api';

window.PATH.socket 			= 	window.location.protocol + '//' + window.location.hostname + ':4000';

window.PATH.app 			= 	window.PATH.root + '/app';

window.PATH.public 			= 	window.PATH.root + '/public';

window.PATH.assets 	= 		{
	javascripts: window.PATH.public + '/assets/javascripts/application.js',
	stylesheets: window.PATH.public + '/assets/stylesheets/application.css'
}

window.PATH.tmp 			= 	window.PATH.public + '/tmp';

window.PATH.partials 		= 	window.PATH.app + '/views/partials';

window.PATH.modelfiles 		= 	{
	uploadPath				: 	'',
	downloadPath 			: 	window.PATH.api + '/download?hash={1}&encoding=true'
};

window.PATH.auth			=	{
	login						: 	window.PATH.api + '/auth/login',
	logout						: 	window.PATH.api + '/auth/logout',
	session						: 	window.PATH.api + '/auth/session'
}

window.PATH.login 			= 	'/login';