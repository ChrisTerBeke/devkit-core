require('nw.gui').Window.get().showDevTools()

var app = angular.module('devkit', ['ui.codemirror', 'ngTagsInput']);
var dirname = require('path').join( require('./js/util.js').dirname, '..' );