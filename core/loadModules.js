var path	= require('path');
var fs		= require('fs');

function injectDependency (filename, filetype)
{

	console.log('injectDependency');
    if (filetype == 'js')
    {
        var fileref = document.createElement('script');
        fileref.setAttribute('type','text/javascript');
        fileref.setAttribute('src', filename);
    }
    else if (filetype == 'css')
    {
        var fileref = document.createElement('link');
        fileref.setAttribute('rel', 'stylesheet');
        fileref.setAttribute('type', 'text/css');
        fileref.setAttribute('href', filename);
    }

    if (typeof fileref != 'undefined')
        document.getElementsByTagName('head')[0].appendChild(fileref)
}

function loadModule (module, type, dir, dependencies)
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

	var self = this;
    console.log('load');

	// load optional dependencies
	var dependencies_path = path.join(dir, 'dependencies');
	fs.exists(dependencies_path, function(exists) {
		if(!exists) return;
		fs.readdir(dependencies_path, function (err, files) {
            if (err) throw err;
            
            files.forEach(function(file){
                if( path.extname(file) == '.js') {
                    self.injectDependency( path.join(dependencies_path, file), 'js');
                } else if( path.extname(file) == '.css') {
                    self.injectDependency( path.join(dependencies_path, file), 'css');
                }			           
	        });
        });
    });

	var css_path = path.join(dir, 'component.css');
	fs.exists(css_path, function(exists) {
		if(exists) {
        	self.injectDependency( css_path	, 'css');
        }	
	});
	var js_path = path.join(dir, 'component.js');
	fs.exists(js_path, function(exists) {
		if(exists) {
        	self.injectDependency( js_path	, 'js');
        }
	});
	
	angularModules.push({
		module: module,
		type: type,
		dir: dir
	});
}
