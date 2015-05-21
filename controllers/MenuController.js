var gui = require('nw.gui');	
	
var MenuController = function($rootScope, $scope, $timeout)
{
		
	$scope.menu 		= $rootScope.menuConfig;
	$scope.os 			= process.platform;
	$scope.inlineMenu 	= false; // draw the menu in the html
	$scope.visibleMenu	= false;
	
	$scope.click = function( item, root ) {
		
		if( root ) {
			if( $scope.visibleMenu == item.id ) {
				$scope.visibleMenu = false;
			} else {
				$scope.visibleMenu = item.id;
			}
			return;
		}
		
		$rootScope.$emit('menu.' + item.id);
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
			
			$rootScope.$emit('menu.' + hotkey.id);			
			
		});
				
	});
	
	if( $scope.os == 'darwin' ) {
		buildMenuDarwin( $scope.menu );
		$scope.inlineMenu = true;
	} else {
		$scope.inlineMenu = true;
		
		registerHotkeys( $scope.menu );
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
			
			/*
			var shortcut = new gui.Shortcut({
				key: hotkey,
				active: function(){
					if( !winFocus ) return;
					console.log('clicked' + this.key)
				}
			});
			gui.App.registerGlobalHotKey(shortcut);
			console.log(hotkey);
			*/
			
		});
		
		/*
		var option = {
		  key : "Ctrl+Alt+A",
		  active : function(e) {
		    console.log(winFocus, this.key); 
		  },
		  failed : function(msg) {
		    // :(, fail to register the |key| or couldn't parse the |key|.
		    console.log(msg);
		  }
		};

		// Create a shortcut with |option|.
		
		// Register global desktop shortcut, which can work without focus.
		gui.App.registerGlobalHotKey(shortcut);
		*/
		
	}
	
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
			menu.createMacBuiltin("Devkit", {
				edit: false
			});
		} else {
			var menu = new gui.Menu();
		}
		
		var i = 0;
		if( root ) i = 1;
		items.forEach(function(item){
					
			if( item.type == 'separator' ) {
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
			if( $scope.os != 'darwin' ) modifiers = modifiers.replace('meta', 'ctrl');
		
		return {
			key			: key,
			modifiers	: modifiers
		}
		
	}
	
}

MenuController.$inject = ['$rootScope', '$scope', '$timeout'];

app.controller("MenuController", MenuController);