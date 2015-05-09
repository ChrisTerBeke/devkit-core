 var path	= require('path');
var fs		= require('fs');

var module = module || {};

angular.module('sdk.moduleload', [])
    .factory('$module', ['$rootScope', '$timeout', '$http', '$q', '$templateCache', function ($rootScope, $timeout, $http, $q, $templateCache) {
    var factory = {};

    $rootScope.modules = {};

    // factory.injectDependency = function(filename, filetype)
    // {

    // 	console.log('injectDependency');
    //     if (filetype == 'js')
    //     {
    //         var fileref = document.createElement('script');
    //         fileref.setAttribute('type','text/javascript');
    //         fileref.setAttribute('src', filename);
    //     }
    //     else if (filetype == 'css')
    //     {
    //         var fileref = document.createElement('link');
    //         fileref.setAttribute('rel', 'stylesheet');
    //         fileref.setAttribute('type', 'text/css');
    //         fileref.setAttribute('href', filename);
    //     }

    //     if (typeof fileref != 'undefined')
    //         document.getElementsByTagName('head')[0].appendChild(fileref)
    // }

    factory.load = function(module, type, dir)
    {
  //       var self = this;
  //       console.log('load');

		// // load optional dependencies
		// var dependencies_path = path.join(dir, 'dependencies');
		// fs.exists(dependencies_path, function(exists) {
		// 	if(!exists) return;
		// 	fs.readdir(dependencies_path, function (err, files) {
	 //            if (err) throw err;
	            
	 //            files.forEach(function(file){
  //                   if( path.extname(file) == '.js') {
  //                       self.injectDependency( path.join(dependencies_path, file), 'js');
  //                   } else if( path.extname(file) == '.css') {
  //                       self.injectDependency( path.join(dependencies_path, file), 'css');
  //                   }			           
		//         });
	 //        });
  //       });

		// var css_path = path.join(dir, 'component.css');
		// fs.exists(css_path, function(exists) {
		// 	if(exists) {
	 //        	self.injectDependency( css_path	, 'css');
	 //        }	
		// });
		// var js_path = path.join(dir, 'component.js');
		// fs.exists(js_path, function(exists) {
		// 	if(exists) {
	 //        	self.injectDependency( js_path	, 'js');
	 //        }
		// });

		var html_path = path.join(dir, 'component.html');
		fs.exists(html_path, function(exists) {
			if(exists) {
				fs.readFile( html_path, function(err, data){
		            if (err) throw err;
				            
					$templateCache.put(html_path, data.toString());
					
					$rootScope.$apply(function () {
			            $rootScope.modules[type] = $rootScope.modules[type] || {};
		            	$rootScope.modules[type][module] = html_path;
			        });
				});
			}
		});
    }


    return factory;
}]);