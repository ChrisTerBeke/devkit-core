var fs 				= require('fs');
var	path			= require('path');
var archiver 		= require('archiver');
var request			= require('request');

var FormideUploadController = function($scope, $rootScope) {
	
	$scope.run = function() {
		$scope.checkSession();
		$scope.compress();
		$scope.upload();	
	};
	
	$scope.checkSession = function() {
		
	};
	
	$scope.compress = function() {
		
		console.log($scope.$parent.project);
		
		var zip = fs.createWriteStream(TEMP_FILENAME);
		var archive = archiver('zip');
		
		
	};
	
	$scope.upload = function() {
		
	};
};

FormideUploadController.$inject = ['$scope', '$rootScope'];

app.controller("FormideUploadController", FormideUploadController);