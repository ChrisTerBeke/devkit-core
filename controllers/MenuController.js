var gui = require('nw.gui');	
	
var MenuController = function($rootScope, $scope)
{
		
	$scope.menu 		= $rootScope.menuConfig;
	$scope.os 			= process.platform;
	$scope.inlineMenu 	= false; // draw the menu in the html
	
	if( $scope.os == 'darwin' ) {
		buildMenuDarwin( $scope.menu );
	} else {
		$scope.inlineMenu = true;
	}

	function buildMenuDarwin( menu ) {
			
		var win = gui.Window.get();
			
		var menu_darwin = drawMenuDarwin( menu, true );
		
		// 'app'-menu	
		menu_darwin.items[0].submenu.insert(new gui.MenuItem({
			label: 'Check for updates...',
			click: function() {
				alert('this feature will come soon...');
				$rootScope.$emit('menu.updates');
			}
		}), 1);
		menu_darwin.items[0].submenu.insert(new gui.MenuItem({
			type: 'separator'
		}), 2);
		menu_darwin.items[0].submenu.insert(new gui.MenuItem({
			label: 'Preferences...',
			click: function() {
				$rootScope.$emit('menu.preferences');
			},
			key: ',',
			modifiers: 'cmd'
		}), 3);
		
		win.menu = menu_darwin;
		
	}
	
	function drawMenuDarwin(items, root){
			
		root = root || false;		
		
		if( root ) {
			var menu = new gui.Menu({
				type: 'menubar'
			});
			menu.createMacBuiltin("Devkit");
		} else {
			var menu = new gui.Menu();
		}
		
		var i = 0;
		if( root ) i = 1;
		items.forEach(function(item){
					
			if( item.type == 'seperator' ) {
				 var item_ = new gui.MenuItem({ type: 'separator' });
			} else {
				
				// prepare the item
				var item_options = {
					label: item.label,
					click: function(){
						$rootScope.$emit('menu.' + item.id);
					}
				}
				
				// add hotkeys, if specified
				if( item.hotkey ) {
					angular.extend(item_options, parseHotkey( item.hotkey ) );
				}
				
				// add the item to the menu
				var item_ = new gui.MenuItem(item_options);
			}
		
			// draw a submenu, recursively
			if( Array.isArray(item.submenu) ) {
				item_.submenu = drawMenuDarwin( item.submenu );
			}
			
			menu.insert( item_, i );
			i++;
			
		});
		
		return menu;
		
	}
	
	function parseHotkey( hotkey ) {
		
		hotkey = hotkey.split('+');
		
		// find key (the last)
		var key = hotkey[ hotkey.length-1 ];
		
		// find modifiers
		hotkey.pop()
		var modifiers = hotkey;
			modifiers = modifiers.join('-');
			if( $scope.os == 'darwin' ) modifiers = modifiers.replace('meta', 'cmd');
			if( $scope.os == 'darwin' ) modifiers = modifiers.replace('meta', 'ctrl');
		
		return {
			key			: key,
			modifiers	: modifiers
		}
		
	}
	
}

MenuController.$inject = ['$rootScope', '$scope'];

app.controller("MenuController", MenuController);