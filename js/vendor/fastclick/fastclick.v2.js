//======================================================== FASTCLICK				

define(['underscore'], function(_){

	var FB = [];
	var coordinates = [];

	function FastButton(element, handler) {
		this.element = element;
		this.handler = handler;
		element.addEventListener('touchstart', this, false);
	};

	FastButton.prototype.handleEvent = function(event) {
		switch (event.type) {
			case 'touchstart': this.onTouchStart(event); break;
			case 'touchmove': this.onTouchMove(event); break;
			case 'touchend': this.onClick(event); break;
			case 'click': this.onClick(event); break;
		}
	};

	FastButton.prototype.onTouchStart = function(event) {		
		event.stopPropagation();
		this.element.addEventListener('touchend', this, false);
		document.body.addEventListener('touchmove', this, false);
		this.startX = event.touches[0].clientX;
		this.startY = event.touches[0].clientY;
		isMoving = false;
	};

	FastButton.prototype.onTouchMove = function(event) {
		if(Math.abs(event.touches[0].clientX - this.startX) > 10 || Math.abs(event.touches[0].clientY - this.startY) > 10) {
			this.reset();
		}
	};

	FastButton.prototype.onClick = function(event) {
		this.reset();
		this.handler(event);
		if(event.type == 'touchend') {
			initFB.preventGhostClick(this.startX, this.startY);
		}
	};

	FastButton.prototype.reset = function() {
		this.element.removeEventListener('touchend', this, false);
		document.body.removeEventListener('touchmove', this, false);
	};
	
	var initFB = _.extend(FB,{		
	
		initFastButtons: function () {
			document.addEventListener('click', this.gonClick, true);
			new FastButton(document.getElementById("fastclick"), this.goSomewhere);
		},
		
		goSomewhere: function() {
			var theTarget = document.elementFromPoint(this.startX, this.startY);
			if(theTarget.nodeType == 3) theTarget = theTarget.parentNode;
			var theEvent = document.createEvent('MouseEvents');
			theEvent.initEvent('click', true, true);
			theTarget.dispatchEvent(theEvent);
		},
		
		preventGhostClick: function(x, y) {
				coordinates.push(x, y);
				window.setTimeout(this.gpop, 500);
		},
		
		gpop: function() {
			coordinates.splice(0, 2);
		},
		
		gonClick: function(event) {
			for(var i = 0; i < coordinates.length; i += 2) {
				var x = coordinates[i];
				var y = coordinates[i + 1];
				if(Math.abs(event.clientX - x) < 25 && Math.abs(event.clientY - y) < 25) {
						event.stopPropagation();
						event.preventDefault();
				}
			}
		}

		
	});
	
	return initFB;
});
