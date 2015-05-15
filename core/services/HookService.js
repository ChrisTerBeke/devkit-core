var Hook = {
	hooks: [],

	register: function (path, name, callback ) {
		var path = path || '';

		console.log(path, name, callback);

		if(typeof name != 'undefined') {
			console.log('i got here! DEBUG 1');

			if( 'undefined' == typeof( Hook.hooks[path] ) )
      		Hook.hooks[path] = []
 
			if( 'undefined' == typeof( Hook.hooks[path][name] ) )
				Hook.hooks[path][name] = []
			Hook.hooks[path][name].push( callback )
		}
	},

	call: function (path, name, arguments ) {
		if(typeof name != 'undefined') {
			console.log('i got here! DEBUG 2');
	      	if(typeof Hook.hooks[path][name] !== 'undefined') {
	      		for( i = 0; i < Hook.hooks[path][name].length; ++i ) {
	      			if( true != Hook.hooks[path][name][i]( arguments ) ) { 
	      				break; 
	      			}
	      		}
	      	}
	    }
			    	
	}
}