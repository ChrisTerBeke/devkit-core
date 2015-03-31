var LEDRing = function(){	
	
	this.currentAnimation = [];
	this.animateCurrentFrame = 0;
	this.animateTimeout = setTimeout(function(){}, 1000);
	this.playing = false;
	this.config = {};

}

LEDRing.prototype.init = function( path ){
				
	var self = this;			
					
	this.config = {
		size: 260,
		pixels: 30,
		path: path || '',
		selector: 'helper[data-path="' + path + '"]'
	};
		
	// build ring
	$(this.config.selector).find('.ring').css({
		width: this.config.size,
		height: this.config.size
	});

	// generate pixels in the DOM
	for( var i = 0; i < this.config.pixels; i++ ) {
		var pixel = $('<div class="pixel"></div>');

		$(pixel).css({
			'-webkit-transform': 'rotate(' + (i / this.config.pixels * 360) + 'deg) translateX(' + ((this.config.size/2)-(this.config.size/55)) + 'px)'
		});

		$(this.config.selector).find('.pixels').append( pixel );
	}
	
	// bind toggle button events
	$(document).on('click', this.config.selector + ' .toggle span', function(){
		
		$(this).parent().children().each(function(){
			$(this).removeClass('active');
			$(self.config.selector).removeClass( $(this).data('state') );
		});
		
		$(self.config.selector).addClass( $(this).data('state') );
		$(this).addClass('active');		
		
	});
	
	$(document).on('click', this.config.selector + ' .play', function(){
		
		var tmp = require('tmp');
		var fs = require('fs');

		// get code
		var code = editor.getCode( self.config.path );	
		
		code = 'global.Homey = { color: require("' + dirname + '/js/one-color.js") }; ' + code; // damn hacky, but hey, it works!

		tmp.file(function _tempFileCreated(err, tmppath, fd, cleanupCallback) {
			if (err) throw err;
							
			fs.writeFileSync(tmppath, code);
			
			try {
				var animation = require( tmppath )();
				self.animate(animation);
			} catch(err) {
				var stack = err.stack.toString();
				alert(stack);
			}
		});
		
	});
}

// write pixel array
LEDRing.prototype.write = function( frame ) {
	if( frame.pixels.length != this.config.pixels ) return false;

	$(this.config.selector).find('.pixel').each(function(i){
		var color = frame.pixels[i];
		var r = (color.red()*255);
			r = Math.round(r);
			
		var g = (color.green()*255);
			g = Math.round(g);
			
		var b = (color.blue()*255);
			b = Math.round(b);
			
		$(this).css({
			backgroundColor: 'rgb(' + r + ',' + g + ',' + b + ')',
		});

	});
}

// animate a 2D array of pixels
LEDRing.prototype.animate = function( animation ) {
	this.playing = false;
	this.currentAnimation = animation;
	this.playing = true;
	
	clearTimeout(this.animateTimeout);
	this.animateTimeout = setTimeout(function(){
		this.step();
	}.bind(this), 0);
}

LEDRing.prototype.step = function(){
		
	this.animateCurrentFrame = (this.animateCurrentFrame+1) % this.currentAnimation.length;
	var frame = this.currentAnimation[this.animateCurrentFrame];

	this.write( frame );
							
	if( this.playing ) {
		this.animateTimeout = setTimeout(function(){
			this.step();
		}.bind(this), frame.duration * 4 );
	}
}

LEDRing.prototype.pause = function(){
	this.playing = false;
}

LEDRing.prototype.resume = function(){
	this.playing = true;
	
	if( this.currentAnimation.length > 0 ) {
		this.step();
	}
}

LEDRing.prototype.destroy = function(){
	this.playing = false;
	clearTimeout(this.animateTimeout);
	
	$(document).off('click', this.config.selector + ' .toggle span');
	$(document).off('click', this.config.selector + ' .play');
}

helper.register( 'ledring', LEDRing );