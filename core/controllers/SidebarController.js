var SidebarController = function($scope, $rootScope, $sidebar, $timeout)
{

	$scope.select = function(path, event)
	{
		$sidebar.select(path, event);
	}

	$scope.isSelected = function(path)
	{
		return $sidebar.isSelected(path);
	}
	
	$scope.expand = function(path, expanded)
	{
		$sidebar.expand(path, expanded);
	}

	$scope.isExpanded = function(path)
	{
		return $sidebar.isExpanded(path);
	}

	$scope.rename = function( item )
	{
		$sidebar.rename( item );
	}
	
	$scope.isRenaming = function( path )
	{
		return $sidebar.isRenaming( path );
	}

	$scope.open = function( path )
	{
		$sidebar.open( path );
	}

	$scope.update = function()
	{
		$scope.filetree = $sidebar.filetree;
		$scope.$apply()
	}

	$scope.dropped = function( event, file, dropped_path )
	{		
		$sidebar.dropped(event, file, dropped_path);
	}

	$scope.showCtxMenu = function( item, event ){
		$sidebar.showCtxMenu( item, event );
	}
	
	$rootScope.$on('service.sidebar.tree.update', function(){
		$scope.update();
	});
}

SidebarController.$inject = ['$scope', '$rootScope', '$sidebar', '$timeout'];

app.controller("SidebarController", SidebarController);