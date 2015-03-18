window.app.service("Draguke", function() {
	
	var DRAGUKE = {};
	DRAGUKE.ringCenterX;
	DRAGUKE.ringCenterY;
	DRAGUKE.rIn;
	DRAGUKE.rOut;
	DRAGUKE.circles;
	DRAGUKE.rFromCenter;
	DRAGUKE.rBall;
	DRAGUKE.positions = [];
	DRAGUKE.idPrefix;
	var element;
	var down= 0;
	var pX;
	var pY;
	var leftEdge;
	var topEdge;

	
	DRAGUKE.model;// Yeah, it was necessary with Angular :/

	/**
	 * Initialize DRAGUKE attributes
	 * @param {AngularJS Service} model Model of the app
	 * @param {String} idPrefix
	 */
	 DRAGUKE.init = function(model, idPrefix) {
	 	DRAGUKE.model = model;
	 	DRAGUKE.ringCenterX = model.ringCenterX;
	 	DRAGUKE.ringCenterY = model.ringCenterY;
	 	DRAGUKE.rFromCenter = model.ringRadius;
	 	DRAGUKE.rIn = model.ringRadius - model.ballRadius/2;
	 	DRAGUKE.rOut = model.ringRadius + model.ballRadius/2;
	 	DRAGUKE.rBall = model.ballRadius;
	 	DRAGUKE.idPrefix = idPrefix;
	 	DRAGUKE.containerDrag("#mainPage #ballsArea");
	 }

	/**
	 * Updates DRAGUKE attributes and reshape the ring of balls
	 */
	 DRAGUKE.update = function() {
	 	console.log('Draguke update');
	 	DRAGUKE.fill();
	 	console.log(DRAGUKE.positions);
		//DRAGUKE.addAllBalls();
		for (key in DRAGUKE.model.notes) {
			var id = parseInt(key) + 1;
			DRAGUKE.dragMe("#" + DRAGUKE.idPrefix + id, id, "#mainPage #ballsArea");

		}
	}

	/**
	 * @param {Number} angleRad
	 * @returns {Object} Object with cx and cy attributes
	 */
	 DRAGUKE.angleToXY = function(angleRad) {
	 	var obj = {
	 		cx : DRAGUKE.ringCenterX + DRAGUKE.rFromCenter * Math.cos(angleRad) -50,
	 		cy : DRAGUKE.ringCenterY - DRAGUKE.rFromCenter * Math.sin(angleRad) -50
	 	}
	 	return obj;
	 }
	 
	/**
	 * Fills the DRAGUKE.positions array
	 */
	 DRAGUKE.fill = function() {
	 	DRAGUKE.positions = [];
	 	for (var i = 1; i <= DRAGUKE.model.notes.length; i++) {
			// Loop circle values
			var note = DRAGUKE.model.notes[i-1];
			var angle = DRAGUKE.segmentAngleRad(DRAGUKE.ringCenterX, DRAGUKE.ringCenterY, note.x, note.y, false);
			DRAGUKE.positions.push({
				id: i,
				angleRad: angle
			});
		}
	}

	/**
	 * Adds a ball with data already stored in the array to the circle 
	 * @param {Number} id Id of ball to add
	 */
	 DRAGUKE.addBall = function(id) {
	 	var ball = DRAGUKE.getBall(id);
	 	jQuery('#central svg').append("<circle class='ball' id='ball"+id+"' />");
		// Loop circle values
		var cx = DRAGUKE.angleToXY(ball.angleRad).cx;
		var cy = DRAGUKE.angleToXY(ball.angleRad).cy;
		jQuery('#ball'+id).attr('number', id).attr('cx', cx).attr('cy', cy)
		.attr('r', DRAGUKE.rBall).attr('fill', '#' + Math.floor(10*Math.random()) + '' + Math.floor(10*Math.random()) + '' + Math.floor(10*Math.random()))
		.attr('stroke-width', 1).attr('stroke', 'black');
	}

	/**
	 * Calls DRAGUKE.addBall() for all elements of DRAGUKE.positions
	 */
	 DRAGUKE.addAllBalls = function() {
	 	for (key in DRAGUKE.positions) {
	 		DRAGUKE.addBall(DRAGUKE.positions[key].id);
	 	}
	 }

	/**
	 * @param {Number} id Id of ball
	 * @returns {Objects} Ball object with this id
	 */
	 DRAGUKE.getBall = function(id) {
	 	for (var i = 0; i < DRAGUKE.positions.length; i++) {
	 		if (DRAGUKE.positions[i].id == id){ return DRAGUKE.positions[i]; }
	 	}
	 	console.log("There's no such ball.");
	 }

	/**
	 * Moves the ball to a new angle (model and view animation)
	 * @param {Number} id Id of ball
	 * @param {Number} newAngleRad New angle for the ball
	 */
	 DRAGUKE.newBallAngle = function(id, newAngleRad) {
	 	var oldAngleRad = DRAGUKE.getBall(id).angleRad;
	 	DRAGUKE.getBall(id).angleRad = newAngleRad;
	 	DRAGUKE.animateBall(id, oldAngleRad, newAngleRad);
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
	 	var ball = DRAGUKE.getBall(id);
	 	var i = 1;
	 	var anim;
	 	var cloDist = DRAGUKE.angleDistance(oldAngleRad, newAngleRad, "clockwise");
	 	var antiCloDist = DRAGUKE.angleDistance(oldAngleRad, newAngleRad, "anticlockwise");

	 	anim = setInterval(function() {
	 		if(way == "anticlockwise") {
	 			var stepAngle = oldAngleRad + antiCloDist * i/steps;
	 		} else if (way == "clockwise") {
	 			var stepAngle = oldAngleRad - cloDist * i/steps;
	 		} else {
	 			console.log('Wrong "way" parameter in animateBall()');
	 		}
			// Move to step position
			//jQuery('#ball'+id).attr('cx', DRAGUKE.angleToXY(stepAngle).cx);
			//jQuery('#ball'+id).attr('cy', DRAGUKE.angleToXY(stepAngle).cy);
			jQuery('#ball'+id).css('left', DRAGUKE.angleToXY(stepAngle).cx+"px");
			jQuery('#ball'+id).css('top', DRAGUKE.angleToXY(stepAngle).cy+"px");
			if(i == steps){
				callback();
			}
			i++;
		}, animDuration/steps);

	 	function callback() {
	 		clearInterval(anim);
			// Save new angle to DRAGUKE.positions
			DRAGUKE.getBall(id).angleRad = newAngleRad;
			//jQuery('#ball'+id).attr('cx', DRAGUKE.angleToXY(newAngleRad).cx);
			//jQuery('#ball'+id).attr('cy', DRAGUKE.angleToXY(newAngleRad).cy);
			jQuery('#ball'+id).css('left', DRAGUKE.angleToXY(newAngleRad).cx+"px");
			jQuery('#ball'+id).css('top', DRAGUKE.angleToXY(newAngleRad).cy+"px");
		}
	}

	/**
	 * Pushes the balls away the make place for a dropped one
	 * @param {Number} id Id of dropped ball
	 * @param {Number} oldAngleRad Where it started from 
	 * @param {Number} newAngleRad Where it will be moved
	 * @param {Function} callback Callback function to update the dnd variables in DRAGUKE.dragMe
	 */
	 DRAGUKE.makePlaceFor = function(id, oldAngleRad, newAngleRad) {
	 	var antiCloDist = DRAGUKE.angleDistance(oldAngleRad, newAngleRad, "anticlockwise");
	 	var closestToNewAngle = null;
	 	var closestToNewAngle2nd = null;
	 	var angleCloseness = 99999;
	 	var angleCloseness2nd = 99999;
	 	var friendsMotion = "";

		// Detect closest element and 2nd closest to destination (newAngleRad)
		for (var j = 1; j <= DRAGUKE.positions.length; j++) {
			//if (j !== id) {
				var distance1 = Math.abs(newAngleRad - DRAGUKE.getBall(j).angleRad);
				var distance2 = Math.abs(newAngleRad + 2*Math.PI - DRAGUKE.getBall(j).angleRad);
				var distance3 = Math.abs(newAngleRad - 2*Math.PI - DRAGUKE.getBall(j).angleRad);
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
			//}
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
			for (var k = 1; k <= DRAGUKE.positions.length; k++) {
				var ball = DRAGUKE.getBall(k);
				if (k !== id && DRAGUKE.angleDistance(oldAngleRad, ball.angleRad, "anticlockwise") > antiCloDist) {
					// Those whose anticlockwise distance from oldAngle are higher than antiCloDist will be translated anticlockwise
					// Push anticlockwise (by 2*Math.PI/circlesNb)
					console.log('Push clockwise ball ' + ball.id);
					DRAGUKE.animateBall(ball.id, ball.angleRad, ball.angleRad + 2*Math.PI/DRAGUKE.positions.length, "anticlockwise");
					isMoved.push(k);
				} else {}
			}
			friendsMotion = "anticlockwise";
		} else if (antiCloDist < Math.PI) {
			for (var l = 1; l <= DRAGUKE.positions.length; l++) {
				var ball = DRAGUKE.getBall(l);
				if (l !== id && DRAGUKE.angleDistance(oldAngleRad, ball.angleRad, "anticlockwise") < antiCloDist) {
					// Those whose anticlockwise distance from oldAngle are higher than antiCloDist will be translated anticlockwise
					// Push anticlockwise (by 2*Math.PI/circlesNb)
					console.log('Push clockwise ball ' + ball.id);
					DRAGUKE.animateBall(ball.id, ball.angleRad, ball.angleRad - 2*Math.PI/DRAGUKE.positions.length, "clockwise");
					isMoved.push(l);
				}
			}
			friendsMotion = "clockwise";
		} else {
			console.log('Problem with diff in DRAGUKE.makePlaceFor()');
		}
		
		// Now move the dropped ball to new location
		if (friendsMotion == "clockwise" && isInMoved(closestToNewAngle)) {
			DRAGUKE.animateBall(id, newAngleRad, newAngleRad - angleCloseness, "clockwise");
		} else if (friendsMotion == "clockwise" && isInMoved(closestToNewAngle2nd)) {
			DRAGUKE.animateBall(id, newAngleRad, newAngleRad - angleCloseness2nd, "clockwise");
		} else if (friendsMotion == "anticlockwise" && isInMoved(closestToNewAngle)) {
			DRAGUKE.animateBall(id, newAngleRad, newAngleRad + angleCloseness, "anticlockwise");
		} else if (friendsMotion == "anticlockwise" && isInMoved(closestToNewAngle2nd)) {
			DRAGUKE.animateBall(id, newAngleRad, newAngleRad + angleCloseness2nd, "anticlockwise");
		} else {
			// No group motion, ball returns to original position
			console.log("Return to your original position!");
			if ( DRAGUKE.angleDistance(oldAngleRad, newAngleRad, "clockwise") > DRAGUKE.angleDistance(oldAngleRad, newAngleRad, "anticlockwise")) {
				DRAGUKE.animateBall(id, newAngleRad, oldAngleRad, "clockwise");
			} else {
				DRAGUKE.animateBall(id, newAngleRad, oldAngleRad, "anticlockwise");
			}
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
	 DRAGUKE.dragMe = function(selector, id, containerSelector) { 
		// The object
		var me = document.querySelector(selector);
		var jQme = jQuery(selector);
		

		//drag new code
		
		

		var myNum = id;
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
		
		

		// Mouse down or not, not if 0
		//var down = 0;
		
		function drop(theEvent) {
			// Calculate angle
			var angle = DRAGUKE.segmentAngleRad(DRAGUKE.ringCenterX, DRAGUKE.ringCenterY, parseFloat(pX - leftEdge), parseFloat(pY - topEdge), false);
			
			console.log('Drop @ angle ' + angle/Math.PI*180 + '°');
			
			DRAGUKE.makePlaceFor(myNum, DRAGUKE.getBall(myNum).angleRad, angle);
		}
		
		jQme.off();

		jQme.on("pointerdown", function(ev) {
			down = 1;
			element=this.id;
			jQme.css("cursor", "grabbing").css("cursor", "-moz-grabbing").css("cursor", "-webkit-grabbing");
		});
		jQme.on("pointerup", function(ev) {
			down = 0;
			firsttime = 0;
			jQme.css("cursor", "grab").css("cursor", "-moz-grab").css("cursor", "-webkit-grab");
			drop(ev)
		});
		jQme.on("pointerleave", function(ev) {
			//down = 0;
		});
		jQme.on("pointerenter", function(ev) {
			jQme.css("cursor", "grab").css("cursor", "-moz-grab").css("cursor", "-webkit-grab");
		});
	}

	DRAGUKE.containerDrag=function(containerSelector){
		var jQContainer = jQuery(containerSelector);
		var mycontainer = document.querySelector(containerSelector);

		// Container dimensions (not used at the moment)
		leftEdge = mycontainer.getBoundingClientRect().left;
		topEdge = mycontainer.getBoundingClientRect().top;

		function dragMaker(theEvent) {
				var jQme = jQuery("#"+element);
				posX = parseFloat(theEvent.clientX - leftEdge)-50;
				posY = parseFloat(theEvent.clientY - topEdge)-50;
				jQme.css('left', posX + "px");
				jQme.css('top', posY + "px");
		
		}

		jQContainer.on("pointermove", function(ev) {
			pX=ev.clientX;
			pY=ev.clientY;
			if(down===1){
				dragMaker(ev);
			}
		});
	}

	/**
	 * @param {Number} Xstart X value of the segment starting point
	 * @param {Number} Ystart Y value of the segment starting point
	 * @param {Number} Xtarget X value of the segment target point
	 * @param {Number} Ytarget Y value of the segment target point
	 * @param {Boolean} realOrWeb true if Real (Y towards top), false if Web (Y towards bottom)
	 * @returns {Number} Angle between 0 and 2PI
	 */
	 DRAGUKE.segmentAngleRad = function(Xstart, Ystart, Xtarget, Ytarget, realOrWeb) {
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
		
		result = (result + 2*Math.PI)%(2*Math.PI);
		
		if (!realOrWeb) {
			result = 2*Math.PI - result;
		}
		
		return result;
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
	this.init = DRAGUKE.init;
	this.update = DRAGUKE.update;
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
