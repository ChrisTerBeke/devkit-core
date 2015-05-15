function isAllowed(item, allowed) {
    for (var i = 0; i < allowed.length; i++) {
        if (allowed[i] === item) {
            return true;
        }
    }

    return false;
}

function appendObjects() {
    vc.getAllAsObject(function (callbackResponse) {
        var callbackResponse = JSON.parse(callbackResponse);
        for (var i in callbackResponse.data.objects) {
            var object = callbackResponse.data.objects[i];
            console.log(object);
            vc.getAttachmentPoints(object.modelId, function (callbackResponse) {
                console.log(JSON.parse(callbackResponse));
            });
        }
    });
}

function appendInit(item, config) {
    var allowedFunctions = [
        'setBackgroundColor',
        'setLightColor',
        'setIdleRotation',
        'setIdleRotationTimeout',
        'centerOnModels',
        'enablePrintbed',
        'setBedColor',
        'setPrinterSize',
        'setBedHeight'
    ];

    if(isAllowed(item.name, allowedFunctions)) {
        for (var i in config) {
            if(config[i].name == item.name) {
                config[i].args = item.args;

                // if(config[i].callbackFunctions !== 'undefined') {
                //     config[i].callbackFunctions = item.callbackFunctions;
                // }

                return false;

                break;
            }
        }

        return item;
    }
        
    return false;
}