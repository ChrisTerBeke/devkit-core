var module = module || {};

angular.module('sdk.moduleload', [])
    .factory('$module', ['$rootScope', '$timeout', '$http', '$q', '$templateCache', function ($rootScope, $timeout, $http, $q, $templateCache) {
    var factory = {};

    $rootScope.modules = {};

    factory.injectDependency = function(filename, filetype)
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

    factory.load = function(module, type, path)
    {
        var path = path || './widgets/';

        var moduleName = module;

        var module = 'devkit-' + type + '-' + module;

        var absPath = path + module + '/';

        var self = this;

		fs.exists(absPath + 'dependencies', function(exists) {
			if(exists) {
		        fs.readdir(absPath + 'dependencies', function (err, files) {
		            if (!err) {
		                for(var i = 0; i < files.length; i++) {
		                    if(files[i].match(/\.[^.]+$/)[0] == '.js') {
		                        self.injectDependency(absPath + 'dependencies/' + files[i], 'js');
		                    }
		                }
		            }
		            else {
		                throw err;
		            }
		        });
        	}
        });

        // $timeout(function() {
        self.injectDependency(absPath + module + '.css', 'css');
        self.injectDependency(absPath + module + '.js', 'js');

        $http.get(absPath + module + '.html')
        .then(function(result)
        {
            $templateCache.put(module + '.html', result.data);
            $timeout(function() {
                $rootScope.modules[type] = $rootScope.modules[type] || [];
                $rootScope.modules[type].push(module + '.html');
            }, 1000);
        });
    }


    return factory;
}]);