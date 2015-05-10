function stringConversion(attr) {
    var er1 = /^-?[0-9]+$/;
    if(er1.test(attr)) {
        return parseInt(attr)
    }
    else if (attr == "true") {
        return true;
    }
    else if (attr == "false") {
        return false;
    }
    else {
    	return attr;
    }
}

