var hooks = hooks || [];

function Hook(path) {
	var path = path || {};

	return {
		register: function (name, callback ) {
			if(typeof name != 'undefined') {
				if( 'undefined' == typeof(hooks[path] ) )
	      		hooks[path] = []
	 
				if( 'undefined' == typeof(hooks[path][name] ) )
					hooks[path][name] = []
				hooks[path][name].push( callback )
			}
		},

		call: function (name, arguments ) {
			if(typeof name != 'undefined') {
		      	if(typeof hooks[path][name] !== 'undefined') {
		      		for( i = 0; i < hooks[path][name].length; ++i ) {
		      			if( true != hooks[path][name][i]( arguments ) ) { 
		      				break; 
		      			}
		      		}
		      	}
		    }
				    	
		}
	};
}
