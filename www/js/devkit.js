window.onload = function(){
	
	
	var editor = CodeMirror(document.getElementById('codemirror'), {
		value: 	"function myScript(){\n\treturn 100;\n}\n",
		mode:  	"javascript",
		theme: 	"monokai",
		lineNumbers: true
	});
	
	
}

var app = angular.module('devkit', []);

app.controller("appCtrl", function($scope, $rootScope) {
	
	$scope.project = {
		id: 'nl.athom.hello',
		name: 'Hello World'
	}
	
});

app.controller("sidebarCtrl", function($scope, $rootScope) {
	
	$scope.items = [
		{
			name: 'nl.athom.hello',
			type: 'folder',
			children: [
				{
					name: 'assets',
					type: 'folder',
					children: [
						{
							name: 'icon.svg',
							type: 'file'
						}
						
					]
				},
				{
					name: 'animations',
					type: 'folder',
					children: [
						{
							name: 'rainbow.js',
							type: 'file'
						}
						
					]
				}
			]
		}
	]
	
});

app.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind('click', function (e) {
                e.stopPropagation();
            });
        }
    };
 });