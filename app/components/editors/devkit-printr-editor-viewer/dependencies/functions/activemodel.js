var modelCounter = 0;

function setActiveModelFile(model, translate) {
    translate = (typeof translate === "undefined") ? false : translate;

    var modelColors = [
        'rgb(70,177,230)',
        'rgb(70,97,230)',
        'rgb(123,70,230)',
        'rgb(203,70,230)',
        'rgb(230,70,177)',
        'rgb(230,70,97)',
        'rgb(230,123,70)',
        'rgb(230,203,70)',
        'rgb(177,230,70)',
        'rgb(97,230,70)',
        'rgb(70,230,123)',
        'rgb(70,230,203)'
    ];

    function randomColor() {
        var rand = modelColors[Math.floor(Math.random() * modelColors.length)];

        console.log(rand);
        return rand.replace(/^(rgb|rgba)\(/,'').replace(/\)$/,'').replace(/\s/g,'').split(',');
    }

    var rgb = randomColor();

    var json = [
            {
                name: "addModel",
                args: [window.PATH.api + "/files/download?hash=" + model[1] + "&encoding=true"],
                callbackFunctions: [
                    {
                        name: "setModelColor",
                        args: ['{newId}', rgb[0], rgb[1], rgb[2]]
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

    
    appendCalls(json);

    modelCounter++;
}