var fs 		= require('fs-extra');
var path 	= require('path');

app.controller("viewerController", function( $scope, $rootScope, $timeout, $http, $q, $events ){
    console.log('file', $scope.file);

    $scope.viewerConfig =
	{
        "init": [
            {
                name: "setIdleRotationTimeout",
                args: [false]
            },
            {
                name: "enableSmoothAnimation",
                args: [true]
            },
            {
                name: "setLightColor",
                args: [255, 254, 250]
            },
            {
                name: "setBackgroundColor",
                args: [255, 255, 255]
            },
            {
            	name: "showPrintBed",
            	args: [true, 'xyz'],
                timeout: 500
            }
        ]
    };

    var json = [
        {
            name: "addModel",
            args: [$scope.file.path],
            callbackFunctions: [
                {
                    name: "setModelColor",
                    args: ['{newId}', 100, 100, 100]
                },
                {
                    name: "zoomToFit",
                    args: []
                }
            ]
        }
    ];

    // if(modelCounter > 0) {
    //     json[0].callbackFunctions.push({
    //         name: "removeAllModels",
    //         args: []
    //     });
    // }

    $timeout(function() {
    	appendCalls(json);
    	console.log('called', json);
    }, 5000);
    


});