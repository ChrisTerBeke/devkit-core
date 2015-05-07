/**
 * V3, a user-friendly, multi-purpose model Viewer using THREE.js
 * @requires Three.js (r69)
 * @requires Tweenjs (0.6.0)
 * @requires signals.js (1.0.0)
 * @arg {Element} canvas the Canvas DOM Element to draw the viewer in.
 * @arg {Object} [settings] optional settings to overwrite the default settings
 *
 */
 var vwr;
V3 = function( canvas, settings )
{

    // main variables
    var scene;
    var renderer;
    var camera;
    var api;
    var managers = {};

	// default callback function
    function onEvent( response )
    {
		console.log( response );
    }

    V3.settings = {
        camera: {
            fov: 60,
            nearClip: 0.1,
            farClip: 100000,
            backgroundColor: 0xffffff
        },
        behaviour: {
            animationSpeed: 1200,
            selectionIntensity: 0.2
        },
        quality: {
            targetFPS: 30,
            shadows: true,
            shadowType: THREE.PCFSoftShadowMap,
            antialias: true
        },
        printer: {
            size: {
                x: 200,
                y: 200,
                z: 200
            },
            grid: 10,
            snap: true,
            type: 'xyz',
            thickness: 5
        },
        models: {
            xyzprinter: "data/models/simplePrinter.dae",
            deltaprinter: "data/models/deltaPrinter.dae",
            scalePivot: "data/models/scalePivot.obj",
            translatePivot: "data/models/translatePivot.obj",
            rotatePivot: "data/models/rotatePivot.obj",
            ruler: "data/models/ruler.obj",
            rotationRuler: "data/models/rulerRotation.obj"
        },
        materials: {
            scalePivot: "data/materials/scalePivot.mtl",
            translatePivot: "data/materials/translatePivot.mtl",
            rotatePivot: "data/materials/rotatePivot.mtl",
            ruler: "data/materials/ruler.mtl",
            virtualGrid: "data/materials/virtualGrid.tga"
        },
        api: {
            baseUrl: '',
            accessToken: ''
        }
    };

    V3.events = {
		startTransform: new signals.Signal(),
		endTransform: new signals.Signal(),
		modelSelected: new signals.Signal()
    };

    Object.deepExtend = function(destination, source) {
      for (var property in source) {
        if (source[property] && source[property].constructor &&
         source[property].constructor === Object) {
          destination[property] = destination[property] || {};
          arguments.callee(destination[property], source[property]);
        } else {
          destination[property] = source[property];
        }
      }
      return destination;
    };

    // merge default settings with settings
    if(settings !== undefined)
    {
        Object.deepExtend(V3.settings, settings);
    }

    // setup scene
    scene = new THREE.Scene();

    // setup renderer
    renderer = new THREE.WebGLRenderer(
    {
        canvas: canvas,
        antialias: V3.settings.quality.antialias,
    });
    renderer.shadowMapEnabled = V3.settings.quality.shadows;
    renderer.shadowMapType = V3.settings.quality.shadowType;
    renderer.shadowMapWidth = 1024;
	renderer.shadowMapHeight = 1024;
    renderer.setSize( canvas.offsetWidth, canvas.offsetHeight );
    renderer.setClearColor(V3.settings.camera.backgroundColor);

    // setup camera
    camera = new THREE.PerspectiveCamera(
        V3.settings.camera.fov,
        (canvas.offsetWidth / canvas.offsetHeight),
        V3.settings.camera.nearClip,
        V3.settings.camera.farClip
    );

    scene.add( camera );

    // setup api
    api = new Formide( V3.settings.api );

    // setup managers
    if(V3.AmbientManager !== undefined)
    {
        managers.AmbientManager = new V3.AmbientManager( scene, renderer, V3.settings );
    }

    if(V3.ModelManager !== undefined)
    {
        managers.ModelManager = new V3.ModelManager( scene, renderer, api, V3.settings );
    }

    if(V3.ControlsManager !== undefined)
    {
        managers.ControlsManager = new V3.ControlsManager( scene, camera, canvas, managers.ModelManager, V3.settings );
    }

    if(V3.HelperManager !== undefined)
    {
        managers.HelperManager = new V3.HelperManager( scene, camera, managers.ModelManager, V3.settings );
    }

    if(V3.CameraManager !== undefined)
    {
        managers.CameraManager = new V3.CameraManager( canvas, scene, camera, managers.ControlsManager, V3.settings )
    }

    if(V3.CSGManager !== undefined)
    {
        managers.CSGManager = new V3.CSGManager( managers.ModelManager, V3.settings );
    }

    if(V3.TransformManager !== undefined)
    {
        managers.TransformManager = new V3.TransformManager( managers.ModelManager, V3.settings );
    }

    if(V3.AttachmentPointManager !== undefined)
    {
        managers.AttachmentPointManager = new V3.AttachmentPointManager( scene, renderer, camera, api, managers.ModelManager, managers.TransformManager, V3.settings );
    }

    if(V3.ExportManager !== undefined)
    {
	console.log("Adding Export Manager");
        managers.ExportManager = new V3.ExportManager( scene, api, managers.ModelManager, V3.settings );
    }

    // animate
    function animate()
    {
        if(typeof(renderer) !== 'undefined')
        {
            renderer.clear();

            managers.ModelManager.getInternalModels(function( models )
            {
                for(var i=0, l = models.length; i < l; i++)
                {
                    managers.ModelManager.renderMesh( models[ i ] ); //why like this? - Cleaner code ;)
                }
            });

            managers.ControlsManager.updateTimeout(1 / V3.settings.quality.targetFPS);

            renderer.render( scene, camera );
        }
    };

    // start animations
    createjs.Ticker.setFPS(V3.settings.quality.targetFPS)
    createjs.Ticker.addEventListener("tick", animate);

	vwr = {};
	vwr.scene = scene;
	vwr.managers = managers;

    if(V3.SDK !== undefined)
    {
        return new V3.SDK( canvas, scene, renderer, api, camera, managers, settings );
    }

}