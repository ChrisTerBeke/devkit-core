function distOrSrcPath(env) {
	return (env == 'development') ? '/src' : '/dist';
}

// Put general configuration here.

window.ENV 	= window.ENV || {};

window.ENV.name 			=	'devkit';

window.ENV.type				= 	'development'; //development || testing || production

window.DEBUG				=	(window.ENV.type == 'development' || window.ENV.type == 'testing') ? true : false;