window.app.service("Draguke", function() {
	
	var DRAGUKE = {};
	DRAGUKE.rIn = 100;
	DRAGUKE.rOut = 152;
	DRAGUKE.circles = 10;
	DRAGUKE.rFromCenter = (DRAGUKE.rIn + DRAGUKE.rOut)/2;
	DRAGUKE.rBall = (DRAGUKE.rOut - DRAGUKE.rIn)/2;
	DRAGUKE.positions = [];

	/**
	 * Shapes the circular structure of the central panel
	 */
	DRAGUKE.shapeCentral = function() {
		// Just for visualization, outer circles
		jQuery('#central svg').append("<circle class='outerBig'/>");
		jQuery('#central svg').append("<circle class='outerSmall'/>");
		jQuery('.outerBig').attr('cx', 300).attr('cy', 200)
			.attr('r', this.rIn).attr('fill', 'none')
			.attr('stroke-width', 3).attr('stroke', 'black')
			.css('z-index', 0);
		jQuery('.outerSmall').attr('cx', 300).attr('cy', 200)
			.attr('r', this.rOut).attr('fill', 'none')
			.attr('stroke-width', 3).attr('stroke', 'black')
			.css('z-index', 0);
		this.fill();
		this.addAllBalls();
	}

	/**
	 * @param {Number} angleRad
	 * @returns {Object} Object with cx and cy attributes
	 */
	DRAGUKE.angleToXY = function(angleRad) {
		var obj = {
			cx : 300 + this.rFromCenter * Math.cos(angleRad),
			cy : 200 - this.rFromCenter * Math.sin(angleRad)
		}
		return obj;
	}
	 
	/**
	 * Fills the DRAGUKE.positions array
	 */
	DRAGUKE.fill = function() {
		for (var i = 1; i <= this.circles; i++) {
			// Loop circle values
			this.positions.push({
				id : i,
				angleRad : i/this.circles*2*Math.PI
			});
		}
	}

	/**
	 * Adds a ball with data already stored in the array to the circle 
	 * @param {Number} id Id of ball to add
	 */
	DRAGUKE.addBall = function(id) {
		var ball = this.getBall(id);
		jQuery('#central svg').append("<circle class='ball' id='ball"+id+"' />");
		// Loop circle values
		var cx = this.angleToXY(ball.angleRad).cx;
		var cy = this.angleToXY(ball.angleRad).cy;
		jQuery('#ball'+id).attr('number', id).attr('cx', cx).attr('cy', cy)
		.attr('r', this.rBall).attr('fill', '#' + Math.floor(10*Math.random()) + '' + Math.floor(10*Math.random()) + '' + Math.floor(10*Math.random()))
		.attr('stroke-width', 1).attr('stroke', 'black');
	}

	/**
	 * Calls DRAGUKE.addBall() for all elements of DRAGUKE.positions
	 */
	DRAGUKE.addAllBalls = function() {
		for (key in this.positions) {
			this.addBall(this.positions[key].id);
		}
	}

	/**
	 * @param {Number} id Id of ball
	 * @returns {Objects} Ball object with this id
	 */
	DRAGUKE.getBall = function(id) {
		for (var i = 0; i < this.positions.length; i++) {
			if (this.positions[i].id == id){ return this.positions[i]; }
		}
		console.log("There's no such ball.");
	}

	/**
	 * Moves the ball to a new angle (model and view animation)
	 * @param {Number} id Id of ball
	 * @param {Number} newAngleRad New angle for the ball
	 */
	DRAGUKE.newBallAngle = function(id, newAngleRad) {
		var oldAngleRad = this.getBall(id).angleRad;
		this.getBall(id).angleRad = newAngleRad;
		this.animateBall(id, oldAngleRad, newAngleRad);
	}

	/**
	 * Animates the ball in the ring
	 * @param {Number} id
	 * @param {Number} oldAngleRad
	 * @param {Number} newAngleRad
	 * @param {String} way String with "clockwise" or "anticlockwise"
	 */
	DRAGUKE.animateBall = function(id, oldAngleRad, newAngleRad, way) {
		var steps = 10;
		var animDuration = 200;
		var ball = this.getBall(id);
		var i = 1;
		var anim;
		var cloDist = angleDistance(oldAngleRad, newAngleRad, "clockwise");
		var antiCloDist = angleDistance(oldAngleRad, newAngleRad, "anticlockwise");
		function callback() {
			clearInterval(anim);
			// Save new angle to DRAGUKE.positions
			DRAGUKE.getBall(id).angleRad = newAngleRad;
		}
		anim = setInterval(function() {
			if(way == "anticlockwise") {
				var stepAngle = oldAngleRad + antiCloDist * i/steps;
			} else if (way == "clockwise") {
				var stepAngle = oldAngleRad - cloDist * i/steps;
			} else {
				console.log('Wrong "way" parameter in animateBall()');
			}
			// Move to step position
			jQuery('#ball'+id).attr('cx', DRAGUKE.angleToXY(stepAngle).cx);
			jQuery('#ball'+id).attr('cy', DRAGUKE.angleToXY(stepAngle).cy);
			if(i == steps){
				callback();
			}
			i++;
		}, animDuration/steps);
	}

	/**
	 * Pushes the balls away the make place for a dropped one
	 * @param {Number} id Id of dropped ball
	 * @param {Number} oldAngleRad Where it started from 
	 * @param {Number} newAngleRad Where it will be moved
	 */
	DRAGUKE.makePlaceFor = function(id, oldAngleRad, newAngleRad) {
		var antiCloDist = angleDistance(oldAngleRad, newAngleRad, "anticlockwise");
		var closestToNewAngle = null;
		var closestToNewAngle2nd = null;
		var angleCloseness = 99999;
		var angleCloseness2nd = 99999;
		var friendsMotion = "";
		
		// Detect closest element and 2nd closest to destination (newAngleRad)
		for (var j = 1; j <= this.positions.length; j++) {
			if(j !== id) {
				var distance1 = Math.abs(newAngleRad - this.getBall(j).angleRad);
				var distance2 = Math.abs(newAngleRad + 2*Math.PI - this.getBall(j).angleRad);
				var distance3 = Math.abs(newAngleRad - 2*Math.PI - this.getBall(j).angleRad);
				var distance = Math.min(distance1, Math.min(distance2, distance3));
				if (distance < angleCloseness2nd) {
					angleCloseness2nd = distance;
					closestToNewAngle2nd = j;
					if(angleCloseness2nd < angleCloseness) {
						var temp1 = angleCloseness;
						angleCloseness = angleCloseness2nd;
						angleCloseness2nd = temp1;
						
						var temp2 = closestToNewAngle;
						closestToNewAngle = closestToNewAngle2nd;
						closestToNewAngle2nd = temp2;
					}
				}
			}
		}
		
		// Used to know which from closestToNewAngle or closestToNewAngle2nd to choose when animating the selected ball
		var isMoved = [];
		function isInMoved(id) {
			var result = false;
			for (key in isMoved) {
				if(isMoved[key] == id){ result = true; }
			}
			return result;
		}
		
		if (antiCloDist > Math.PI) {
			for (var k = 1; k <= this.positions.length; k++) {
				var ball = this.getBall(k);
				if (k !== id && angleDistance(oldAngleRad, ball.angleRad, "anticlockwise") > antiCloDist) {
					// Those whose anticlockwise distance from oldAngle are higher than antiCloDist will be translated anticlockwise
					// Push anticlockwise (by 2*Math.PI/circlesNb)
					console.log('Push clockwise ball ' + ball.id);
					this.animateBall(ball.id, ball.angleRad, ball.angleRad + 2*Math.PI/this.circles, "anticlockwise");
					isMoved.push(k);
				} else {}
			}
			friendsMotion = "anticlockwise";
		} else if (antiCloDist < Math.PI) {
			for (var l = 1; l <= this.positions.length; l++) {
				var ball = this.getBall(l);
				if (l !== id && angleDistance(oldAngleRad, ball.angleRad, "anticlockwise") < antiCloDist) {
					// Those whose anticlockwise distance from oldAngle are higher than antiCloDist will be translated anticlockwise
					// Push anticlockwise (by 2*Math.PI/circlesNb)
					console.log('Push clockwise ball ' + ball.id);
					this.animateBall(ball.id, ball.angleRad, ball.angleRad - 2*Math.PI/this.circles, "clockwise");
					isMoved.push(l);
				}
			}
			friendsMotion = "clockwise";
		} else {
			console.log('Problem with diff in DRAGUKE.makePlaceFor()');
		}
		
		// Now move the dropped ball to new location
		if (friendsMotion == "clockwise" && isInMoved(closestToNewAngle)) {
			this.animateBall(id, newAngleRad, newAngleRad - angleCloseness, "clockwise");
		} else if (friendsMotion == "clockwise" && isInMoved(closestToNewAngle2nd)) {
			this.animateBall(id, newAngleRad, newAngleRad - angleCloseness2nd, "clockwise");
		} else if (friendsMotion == "anticlockwise" && isInMoved(closestToNewAngle)) {
			this.animateBall(id, newAngleRad, newAngleRad + angleCloseness, "anticlockwise");
		} else if (friendsMotion == "anticlockwise" && isInMoved(closestToNewAngle2nd)) {
			this.animateBall(id, newAngleRad, newAngleRad + angleCloseness2nd, "anticlockwise");
		} else {
			// No group motion, ball returns to original position
			console.log("Stays");
			this.animateBall(id, newAngleRad, oldAngleRad, "clockwise");
		}
	}

	/**
	 * @param {Number} angleRad Angle to compare
	 * @param {Number} angleBeforeRad Angle to be compared to, lower value
	 * @param {Number} angleAfterRad Angle to be compared to, higher value
	 * @returns {Boolean} True if in between (ANTICLOCKWISE FROM angleRad TO toRad)
	 */
	DRAGUKE.isBetween = function(angleRad, angleBeforeRad, angleAfterRad) {
		function bet0and2pi(angleRad) {
			return ((angleRad + 2*Math.PI)%(2*Math.PI));
		}
		var ang = bet0and2pi(angleRad);
		var before = bet0and2pi(angleBeforeRad);
		var after = bet0and2pi(angleAfterRad);
		if(before < after){
			if(ang > before && ang < after) { 
				return true;
			} else {
				return false;
			}
		} else {
			if( ang > before || ang < after) {
				return true;
			} else {
				return false;
			}
		}
	}

	/**
	 * Call DRAGUKE.dragMe to make an element (SVG or DOM) draggable
	 * @param {String} selector Selector of the object
	 * @param {String} containerSelector Selector of the container
	 */
	DRAGUKE.dragMe = function(selector, containerSelector) { 
		// The object
		var me = document.querySelector(selector);
		var jQme = jQuery(selector);
		var mycontainer = document.querySelector(containerSelector);
		var myNum = jQme.attr('number');
		// Make all elements inside ipad non draggable (may be modified depending on the game)
		me.setAttribute("draggable", "false");
		jQme.find('*').attr("draggable", "false");
		
		// Initial positions, because need to initialize JS positioning, CSS isn't enough to define style.left attribute
		
		if ( !jQme.is(jQuery('circle')) && !jQme.is(jQuery('path')) ) {
			// If not SVG
			me.style.left = jQme.css('left');
			me.style.top = jQme.css('top');
			var posX = me.style.left.slice(0, me.style.left.length-2);// To remove the "px" part
			var posY = me.style.top.slice(0, me.style.top.length-2);
		} else {
			// If svg (path or circle)	
			var posX = jQme.attr('cx');
			var posY = jQme.attr('cy');
		}
		var initialPosX = posX;// For SVG path translate offset
		var initialPosY = posY;
		
		// Container dimensions (not used at the moment)
		var leftEdge = mycontainer.offsetLeft;
		var topEdge = mycontainer.offsetTop;
		
		var stampX; // Number withtour "px"
		var stampY; // Number withtour "px"
		var firsttime = 0;

		// Mouse down or not, not if 0
		var down = 0;
		
		// Grab cursor
		function grab() {
			if (down == 0) {
				jQuery(containerSelector).append(jQme);
				jQme.css("cursor","grab").css("cursor","-moz-grab").css("cursor","-webkit-grab");
			} else {
				jQme.css("cursor","grabbing").css("cursor","-moz-grabbing").css("cursor","-webkit-grabbing");
			}
		}
		function drop(theEvent) {
			// Calculate angle
			var angle = segmentAngleRad(300, 200, parseFloat(theEvent.clientX), parseFloat(theEvent.clientY));
			var realAngle = 2*Math.PI - angle;
			console.log(300, 200, parseFloat(theEvent.clientX), parseFloat(theEvent.clientY));
			console.log('Drop @ angle ' + realAngle/Math.PI*180 + '°');
			DRAGUKE.makePlaceFor(myNum, DRAGUKE.getBall(myNum).angleRad, realAngle);
		}
		function dragMaker(theEvent) {
			//console.log("Client X detected is: "+theEvent.clientX/finalRatio);
			//console.log("Client Y detected is: "+theEvent.clientY/finalRatio);
			if (firsttime == 1 && down == 1) {
				// If the location has been memorized at previous call and mouse is down
				// New positions
				posX = parseFloat(posX) + parseFloat(theEvent.clientX) - stampX;
				posY = parseFloat(posY) + parseFloat(theEvent.clientY) - stampY;
				var angle = segmentAngleRad(300, 200, posX, posY);
				var forcedPosX = 300 + DRAGUKE.rFromCenter*Math.cos(angle);
				var forcedPosY = 200 + DRAGUKE.rFromCenter*Math.sin(angle);
				// Apply them
				
				// If not SVG
				jQme.attr('left', posX + "px");
				jQme.attr('top', posY + "px");
				// If SVG
				if ( jQme.is(jQuery("circle")) ) {
					//jQme.attr('cx',forcedPosX);
					//jQme.attr('cy',forcedPosY);
					jQme.attr('cx', posX);
					jQme.attr('cy', posY);
				} else if ( jQme.is(jQuery("path")) ) {
					var x = posX - initialPosX;
					var y = posY - initialPosY;
					jQme.attr('transform', "translate(" + x + "," + y + ")");
					jQme.attr('-webkit-transform', "translate(" + x + "," + y + ")");
					jQme.attr('-o-transform', "translate(" + x + "," + y + ")");
					
				} else{ console.log("SVG element not recognized"); }
			}
			
			// Memorize pointer location
			stampX = theEvent.clientX;
			stampY = theEvent.clientY;
			firsttime = 1;
		}
		
		jQme.on("pointermove", function(ev) {
			dragMaker(ev);
		});
		jQme.on("pointerdown", function(ev) {
			down = 1;
			jQme.css("cursor", "grabbing").css("cursor", "-moz-grabbing").css("cursor", "-webkit-grabbing");
		});
		jQme.on("pointerup", function(ev) {
			down = 0;
			jQme.css("cursor", "grab").css("cursor", "-moz-grab").css("cursor", "-webkit-grab");
			drop(ev);
		});
		jQme.on("pointerleave", function(ev) {
			down = 0;
		});
		jQme.on("pointerenter", function(ev) {
			jQuery(containerSelector).append(jQme);
			jQme.css("cursor", "grab").css("cursor", "-moz-grab").css("cursor", "-webkit-grab");
		});
	}

	/**
	 * @param {Number} Xstart X value of the segment starting point
	 * @param {Number} Ystart Y value of the segment starting point
	 * @param {Number} Xtarget X value of the segment target point
	 * @param {Number} Ytarget Y value of the segment target point
	 * @returns {Number} Angle between 0 and 2PI
	 */
	DRAGUKE.segmentAngleRad = function(Xstart, Ystart, Xtarget, Ytarget) {
		var result;// Will range between 0 and 2PI
		if (Xstart == Xtarget) {
			if(Ystart == Ytarget) {
				result = 0; 
			} else if (Ystart < Ytarget) {
				result = Math.PI/2;
			} else if (Ystart > Ytarget) {
				result = 3*Math.PI/2;
			} else {}
		} else if (Xstart < Xtarget) {
			result = Math.atan((Ytarget - Ystart)/(Xtarget - Xstart));
		} else if (Xstart > Xtarget) {
			result = Math.PI + Math.atan((Ytarget - Ystart)/(Xtarget - Xstart));
		}
		return (result + 2*Math.PI)%(2*Math.PI);
	}

	/**
	 * @param {Number} fromAngle Start angle
	 * @param {Number} toAngle End angle
	 * @param {String} way Clockwise or anticlockwise
	 * @returns {Number} The distance on the trigonometric circle
	 */
	DRAGUKE.angleDistance = function(fromAngle, toAngle, way) {
		fromAngle = (fromAngle + 2*Math.PI) % (2*Math.PI);
		toAngle = (toAngle + 2*Math.PI) % (2*Math.PI);
		if (way == "anticlockwise") {
			if (toAngle > fromAngle) {
				return (toAngle - fromAngle);
			} else {
				return (toAngle + 2*Math.PI - fromAngle);
			}
		} else if (way == "clockwise") {
			if (toAngle > fromAngle) {
				return (2*Math.PI - (toAngle - fromAngle));
			} else {
				return (fromAngle - toAngle);
			}
		} else {
			console.log("Wrong way in angleDistance()");
		}
	}
	
	/*** Aliasing ***/
	// Because when calling a function of the angular service, "this" has to be DRAGUKE
	this.shapeCentral = DRAGUKE.shapeCentral;
	this.angleToXY = DRAGUKE.angleToXY;
	this.fill = DRAGUKE.fill;
	this.addBall = DRAGUKE.addBall;
	this.addAllBalls = DRAGUKE.addAllBalls;
	this.getBall = DRAGUKE.getBall;
	this.newBallAngle = DRAGUKE.newBallAngle;
	this.animateBall = DRAGUKE.animateBall;
	this.makePlaceFor = DRAGUKE.makePlaceFor;
	this.isBetween = DRAGUKE.isBetween;
	this.dragMe = DRAGUKE.dragMe;
	this.segmentAngleRad = DRAGUKE.segmentAngleRad;
	this.angleDistance = DRAGUKE.angleDistance;
	
});
