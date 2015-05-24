var gui = require('nw.gui');	
	
var MenuController = function($rootScope, $scope, $timeout)
{
		
	$scope.menu 		= $rootScope.menuConfig;
	$scope.os 			= process.platform;
	$scope.inlineMenu 	= false; // draw the menu in the html
	$scope.visibleMenu	= false;
	
	$scope.close = function(){
		
		if( !$scope.inlineMenu ) return;
		
		$scope.$apply(function(){
			$scope.visibleMenu = false;
		})
	}
	
	$scope.click = function( item, root ) {
		
		if( root ) {
			if( $scope.visibleMenu == item.id ) {
				$scope.visibleMenu = false;
			} else {
				$scope.visibleMenu = item.id;
			}
			return;
		}
		
		emit(item.id, false);
		
		$timeout(function(){
			$scope.visibleMenu = false;
		}, 100);
	}
	
	$scope.mouseover = function( item, root ) {
		if( root ) {
			if( $scope.visibleMenu !== false ) {
				$scope.visibleMenu = item.id;
			}
		}
	}
	
	$scope.formatHotkey = function( item ) {
		
		if( !item.hotkey ) return '';
		
		var hotkey = parseHotkey( item.hotkey );
		
		var modifiers = hotkey.modifiers.split('-');
			modifiers = modifiers.map(function(modifier){
				return ucfirst(modifier);
			})
		return modifiers.join('+') + '+' + ucfirst(hotkey.key);
	}
		
	// listen to the window's focus
	var win			= gui.Window.get();
	var winFocus	= false;
	var hotkeys		= [];	
	
    win.on('blur', function() { winFocus = false; });
    win.on('focus', function() { winFocus = true; });
    
	window.addEventListener('keyup', function(e){
			
		var key = String.fromCharCode(e.keyCode);
			key = key.toLowerCase();
		
		hotkeys.forEach(function(hotkey){
			
			if( hotkey.alt && !e.altKey ) return;
			if( hotkey.ctrl && !e.ctrlKey ) return;
			if( hotkey.shift && !e.shiftKey ) return;
			if( hotkey.key != key ) return;
			
			emit(hotkey.id);			
			
		});
				
	});
	
	if( $scope.os == 'darwin' ) {
		buildMenuDarwin( $scope.menu );
	} else {
		$scope.inlineMenu = true;
		
		registerHotkeys( $scope.menu );
	}
	
	// emit a menu event
	function emit( event, apply ) {
		
		if( typeof apply == 'undefined' ) apply = true;
			
		if( apply ) {			
			$scope.$apply(function(){
				$rootScope.$emit('menu.' + event);
			});
		} else {
			$rootScope.$emit('menu.' + event);
		}
		
	}
	
	// register hotkeys
	function registerHotkeys( menu ) {
				
		menu.forEach(function(item){
			
			if( item.submenu ) registerHotkeys( item.submenu );
			
			if( !item.hotkey ) return;
			
			var hotkey = item.hotkey;
				hotkey = hotkey.replace('meta', 'ctrl');
			
			var key = item.hotkey.split('+');
				key = key[ key.length-1 ];
				key = key.toLowerCase();
			
			hotkeys.push({
				id		: item.id,
				key		: key,
				ctrl	: hotkey.indexOf('ctrl') > -1,
				alt		: hotkey.indexOf('alt') > -1,
				shift	: hotkey.indexOf('shift') > -1
			});
			
		});
		
	}
	
	// return a string with the first letter as uppercase
	function ucfirst( text ) {
		
		if( text.length == 1 ) {
			return text.toUpperCase();
		} else {
			return text.charAt(0).toUpperCase() + text.substring(1);
		}
		
	}

	function buildMenuDarwin( menu ) {
			
		var win = gui.Window.get();
			
		var menu_darwin = drawMenuDarwin( menu, true );
		
		// 'app'-menu	
		menu_darwin.items[0].submenu.insert(new gui.MenuItem({
			label: 'Check for updates...',
			click: function() {
				emit('updates');
			}
		}), 1);
		menu_darwin.items[0].submenu.insert(new gui.MenuItem({
			type: 'separator'
		}), 2);
		menu_darwin.items[0].submenu.insert(new gui.MenuItem({
			label: 'Preferences...',
			click: function() {
				emit('preferences');
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
			
			var position = i;
			
			if( item.type == 'separator' ) {
				 var item_ = new gui.MenuItem({ type: 'separator' });
			} else {
				
				// skip edit on OSX
				if( root && item.id == 'edit' ) {
					i++;
					return;
				};
				
				// prepare the item
				var item_options = {
					label: item.label,
					click: function(){
						emit(item.id);
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
			
			menu.insert( item_, position );
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
			if( $scope.os != 'darwin' ) modifiers = modifiers.replace('meta', 'ctrl');
		
		return {
			key			: key,
			modifiers	: modifiers
		}
		
	}
	
}

MenuController.$inject = ['$rootScope', '$scope', '$timeout'];

app.controller("MenuController", MenuController);