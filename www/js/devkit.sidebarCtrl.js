var watchTree 	= require("fs-watch-tree").watchTree;
var fs 			= require('fs');
var path 		= require('path');

app.controller("sidebarCtrl", function($scope, $rootScope) {
	
	$scope.filetree = {};
	
	$rootScope.$on('project.loaded', function(){
			
		// watch for any changes in the directory
		var watch = watchTree($rootScope.project.path, function (event) {
			$scope.update();
		});

		$scope.update();
		
	});
	
	// open a new file on sidebar click
	$scope.open = function( file_path ){
		$rootScope.$emit('editor.open', file_path );
	}
	
	$scope.update = function(){
		$scope.filetree = readdirSyncRecursive( $rootScope.project.path, true );
		$scope.$apply();
	}
	
});

function readdirSyncRecursive( dir, root ) {
	
	root = root || false;
	
	var result = [];
	
	var contents = fs.readdirSync( dir );
	contents.forEach(function(item){
		
		var item_path = path.join(dir, item);
		var item_stats = fs.lstatSync( item_path );
		
		if( item_stats.isDirectory() ) {
			
			result.push({
				name: item,
				path: path.join(dir, item),
				type: 'folder',
				stats: item_stats,
				children: self.readdirSyncRecursive( item_path )
			});
			
		} else {
			
			result.push({
				name: item,
				path: path.join(dir, item),
				type: 'file',
				stats: item_stats
			});
				
		}			
		
	});
	
	if( root ) {	
		return [{
			type: 'folder',
			name: path.basename( dir ),
			path: dir,
			children: result,
			stats: fs.lstatSync( dir )
		}];	
	} else {
		return result;
	}
	
}