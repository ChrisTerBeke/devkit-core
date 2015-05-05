var path 		= require('path');

var open		= require("open");
var fs			= require('fs-extra')
var watchTree 	= require("fs-watch-tree").watchTree;
var trash		= require('trash');

var SidebarController = function($scope, $rootScope, $sidebar, $timeout)
{

	$scope.select = function(event, path)
	{
		$scope.selected = $sidebar.select($scope.selected, event, path);
	}

	$scope.submitRename = function()
	{
		$sidebar.submitRename(item);
	}

	$scope.isSelected = function()
	{
		$sidebar.isSelected(path);
	}

	$scope.open = function(item)
	{
		var open = $sidebar.openFile(item, $scope.$parent.files, $scope.$parent.fileHistory);
        
        open.active._changed

        $scope.$parent.active = open.active;

        $scope.$parent.files = open.files;
        $scope.$parent.fileHistory = open.fileHistory;

	}

	$scope.update = function()
	{
		$scope.filetree = $sidebar.update();
	}

	$scope.dropped = function( event, file, dropped_path )
	{
		$sidebar.dropped(event, file, dropped_path);
	}

	//TODO: Update this function
    $scope.showCtxmenu = function( item, event )
    {

        // create context menu
        var gui = require('nw.gui');

        // Create an empty menu
        var ctxmenu = new gui.Menu();

        // Add some items
        if( item )
        {

            // multiple selection
            if( $scope.selected.indexOf(item.path) < 0 )
            {
                if( event.metaKey || event.ctrlKey )
                {
                    $scope.selected.push( item.path );
                }
                else
                {
                    $scope.selected = [ item.path ];
                }
            }

            ctxmenu.append(new gui.MenuItem({ label: 'Open', click: function()
            {

                $scope.selected.forEach(function( item_path ){
                    $rootScope.$emit('editor.open', item_path );
                    console.log('i emitted');
                });

            }}));
            ctxmenu.append(new gui.MenuItem({ label: 'Open With Default Editor', click: function(){
                $scope.selected.forEach(function( item_path ){
                    open( item_path );
                });
            }}));
            ctxmenu.append(new gui.MenuItem({ label: 'Open File Location', click: function(){
                $scope.selected.forEach(function( item_path ){
                    open( path.dirname( item_path ) );
                });
            }}));
            ctxmenu.append(new gui.MenuItem({ type: 'separator' }));
            ctxmenu.append(new gui.MenuItem({ label: 'Move to Trash...', click: function(){

                if( $scope.selected.length > 1 ) {
                    if( confirm( "Are you sure you want to remove " + $scope.selected.length + " items to the trash?" ) ) {
                        $scope.selected.forEach(function( item_path ){
                            trash([ item_path ]);
                        });
                    }
                } else {
                    if( confirm( "Are you sure you want to remove `" + item.name + "` to the trash?" ) ) {
                        trash([ item.path ]);
                    }
                }
            }}));
            if( $scope.selected.length == 1 ) {
                ctxmenu.append(new gui.MenuItem({ label: 'Rename...', click: function(){
                    $scope.$apply(function(){
                        item.renaming = true;
                    });
                }}));
            }
            ctxmenu.append(new gui.MenuItem({ label: 'Duplicate', click: function(){

                $scope.selected.forEach(function( item_path ){
                    var new_path = newPath( item_path );

                    var i = 2;
                    while( fs.existsSync( new_path ) ) {
                        new_path = newPath( item_path, i++ );
                    }

                    fs.copySync( item_path, new_path );
                });

            }}));
            ctxmenu.append(new gui.MenuItem({ type: 'separator' }));
        }
        ctxmenu.append(new gui.MenuItem({ label: 'New Folder', click: function(){
            var newFolderName = 'Untitled Folder';

            if( typeof item == 'undefined' ) {
                var folder = $rootScope.project.path;
            } else {
                var folder = item.path;
            }

            fs.ensureDir( path.join( folder, newFolderName) );
        }}));
        ctxmenu.append(new gui.MenuItem({ label: 'New File', click: function(){
            var newFileName = 'Untitled File';

            if( typeof item == 'undefined' ) {
                var folder = $rootScope.project.path;
            } else {

                if( fs.statSync( item.path ).isFile() ) {
                    var folder = path.dirname( item.path );
                } else {
                    var folder = item.path;
                }
            }

            fs.ensureFile( path.join( folder, newFileName) );

        } }));

        // Popup as context menu
        ctxmenu.popup( event.clientX, event.clientY );
    }
}

SidebarController.$inject = ['$scope', '$rootScope', '$sidebar', '$timeout'];

app.controller("SidebarController", SidebarController);