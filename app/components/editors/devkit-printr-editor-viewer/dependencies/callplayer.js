function callPlayerFunction(item, callbackResponse) {
    
    console.log('call function', item);

    if (typeof window.vc[item.name] === "function") {
        if(typeof callbackResponse !== 'undefined') {
            callbackResponse = JSON.parse(callbackResponse);

            // if(callbackResponse.code == 200) {
                console.log('callbackResponse');
                console.log(callbackResponse);
            // }
        }
        else if(appendInit(item, jsonInit)) {
        	jsonInit.push(appendInit(item, jsonInit));
        }

        if(DEBUG) {
        	console.log("JSONInit Response");
       		console.log(jsonInit);
    	}

        if(item.args.length > 0) {
            for(var attr in item.args) { 
                var result;

                item.args[attr] = stringConversion(
                    item.args[attr].toString().replace(/{(.*?)}/, function(j) { 
                        var val = j.replace(/[{}]/g, "");

                        return (typeof callbackResponse.data[val] !== 'undefined') ? callbackResponse.data[val] : val;
                    
                    })
                );


                if(typeof item.args[attr] === 'string' && item.args[attr].charAt(0) == '=') {
                    item.args[attr] = eval(item.args[attr].substring(1));
                    console.log('math', item.args[attr]);
                }                   
            }

            item.args.push(function (response) {

                /*
                for (var param in item.args) {
                    if(typeof item.args[param] === "string") {
                        param = decipherObject(item.args[param], response);
                        console.log("DEBUG: " + param);
                    }
                }
                */

                if(DEBUG) {
                    console.log("Player Call Response");
                    console.log(response);
                }

                if(item.callbackFunctions !== "undefined") {
                    for (var callbackFunction in item.callbackFunctions) {
                        callPlayerFunction(item.callbackFunctions[callbackFunction], JSON.stringify(response));
                    }
                }
            });

            setTimeout(function(){ 
                window.vc[item.name].apply(window.vc[item.name], item.args);
            }, (typeof item.timeout === 'int') ? item.timeout : 0); 
        }
    }
    else {
        var appElement = document.querySelector('[ng-app=formideApp]');
        // var appScope = angular.element(appElement).scope().$$childHead;

        console.log('why does it get here?', item);

        // if(typeof appScope.root[item.name] === "function") {
        //     if(typeof callbackResponse !== 'undefined') {
        //         callbackResponse = JSON.parse(callbackResponse);

        //         // if(callbackResponse.code == 200) {
        //             console.log('callbackResponse');
        //             console.log(callbackResponse);
        //         // }
        //     }
        //     if(item.args.length > 0) {
        //         console.log("SUPER DEBUG", item);
        //         for(var attr in item.args) { 
        //             var result;
        //             // item.args[attr] = stringConversion(
        //                 item.args[attr].toString().replace(/{(.*?)}/, function(j) { 
        //                     var val = j.replace(/[{}]/g, "");

        //                     console.log("DEBUG");
        //                     console.log(callbackResponse);

        //                     result = (typeof callbackResponse.data[val] !== 'undefined') ? callbackResponse.data[val] : val;
                        
        //                 })
        //             // );
        //             item.args[attr] = (result === "undefined") ? item.args[attr] : result;
        //             // console.log("RESULT: ", result);
        //         }
        //     }

        //     setTimeout(function(){ 
        //         appScope.root[item.name](item.args);
        //     }, (typeof item.timeout === 'int') ? item.timeout : 0); 
        // }
    }
}