var viewerConfig;
var DEBUG = true;
var unityLoaded = true;
var jsonInit = [];
var vc;

function configPrintrViewer(config) {
    viewerConfig = config;

    console.log('configFile', config);

    for (var fnId in config.init) {
        callPlayerFunction(config.init[fnId]);
    }
}

function initPrintrViewer(json) {
    unityLoaded = true;

    window.PATH = window.PATH || {};
    window.PATH.public = window.PATH.public  || '';

    window.PATH.api = window.PATH.api || 'http://api.formide.com';

    vc = new V3(document.getElementById("v3"), {
        api: {
            baseUrl: window.PATH.api,
            accessToken: "ycyM50QPErFa0roRCpQ61YzkFKUPtb1VqKwtkYkO"
        },
        models: {
            xyzprinter:            window.PATH.public + "/assets/data/models/simplePrinter.dae",
            deltaprinter:          window.PATH.public + "/assets/data/models/deltaPrinter.dae",
            scalePivot:            window.PATH.public + "/assets/data/models/scalePivot.obj",
            translatePivot:        window.PATH.public + "/assets/data/models/translatePivot.obj",
            rotatePivot:           window.PATH.public + "/assets/data/models/rotatePivot.obj",
            ruler:                 window.PATH.public + "/assets/data/models/ruler.obj",
            rotationRuler:         window.PATH.public + "/assets/data/models/rulerRotation.obj"
        },
        materials: {
            scalePivot:            window.PATH.public + "/assets/data/materials/scalePivot.mtl",
            translatePivot:        window.PATH.public + "/assets/data/materials/translatePivot.mtl",
            rotatePivot:           window.PATH.public + "/assets/data/materials/rotatePivot.mtl",
            ruler:                 window.PATH.public + "/assets/data/materials/ruler.mtl",
            virtualGrid:           window.PATH.public + "/assets/data/materials/virtualGrid.tga"
        }
    });

    console.log('Loaded Printer Init');

    var resizeElement = document.getElementById("threejs-viewer"),
        resizeCallback = function() {
            var width = document.getElementById("threejs-viewer").offsetWidth;
            var height = Math.round((width / 4) * 3);

            vc.setCanvasSize(width, height);

            console.log(document.getElementById("threejs-viewer").offsetWidth);
    };
    addResizeListener(resizeElement, resizeCallback);
}

function appendCalls(json) {
    for (var fnId in json) {
        callPlayerFunction(json[fnId]);
    }
}

if(typeof angular !== 'undefined') 
{
    console.log('loaded');
    angular.module('printr.viewer', []).directive('printrViewer', function() 
    {
        return {
            scope: {
                config: '=',
                width: '=',
                height: '='
            },
            restrict: 'E',
            replace: false,
            template: '<section class="threejs-viewer" id="threejs-viewer"><canvas id="v3" style="width: 100%; display: block;"></canvas></section>',
            controller: function($scope, $element) {
                
                 console.log('loaded viewer');
                initPrintrViewer();

                $scope.zoomIn = function() {
                    console.log('zoomIn');
                    callPlayerFunction({
                        name: "zoomCameraIn",
                        args: [1, true]
                    });
                }

                $scope.zoomOut = function() {
                    console.log('zoomOut');
                    callPlayerFunction({
                        name: "zoomCameraOut",
                        args: [1, true]
                    });
                }
            },
            link: function (scope, element, attr) 
            {
                console.log(scope.config);
                if(typeof scope.config === 'undefined') 
                {
                    configPrintrViewer({
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
                                args: [241, 241, 241]
                            },
                            {
                                name: "showPrintBed",
                                args: [true, 'xyz'],
                                timeout: 500
                            }
                        ]
                    });
                }
                else 
                {
                    configPrintrViewer(scope.config);
                }

                scope.size = {};
                scope.size.width = (scope.width === undefined) ? '100%' : scope.width + 'px';
                scope.size.height = (scope.height === undefined) ? '100%' : scope.height + 'px';

                console.log('scope', scope);
            }
        }
    });
}

