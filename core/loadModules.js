var path	= require('path');
var fs		= require('fs');

function loadModule(module, type, dir, dependencies)
{
    var self = this;

    var dependencies = dependencies || [];

    if(dependencies.length > 0) 
    {
		dependencies.forEach(function(dependency)
		{
			modules.push(dependency);
		});
	}
	
	angularModules.push({
		module: module,
		type: type,
		dir: dir
	});
}
