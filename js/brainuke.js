var BUKE = {};
BUKE.rIn = 100;
BUKE.rOut = 152;
BUKE.circles = 15;
BUKE.rFromCenter = (BUKE.rIn + BUKE.rOut)/2;
BUKE.rBall = (BUKE.rOut - BUKE.rIn)/2;
BUKE.positions = [];

/*
 * Shapes the circular structure of the central panel
 */
BUKE.shapeCentral = function(){
	// Just for visualization, outer circles
	jQuery('#central svg').append("<circle class='outerBig'/>");
	jQuery('#central svg').append("<circle class='outerSmall'/>");
	jQuery('.outerBig').attr('cx',300).attr('cy',200)
		.attr('r',this.rIn).attr('fill','none')
		.attr('stroke-width',3).attr('stroke','black')
		.css('z-index',0);
	jQuery('.outerSmall').attr('cx',300).attr('cy',200)
		.attr('r',this.rOut).attr('fill','none')
		.attr('stroke-width',3).attr('stroke','black')
		.css('z-index',0);
	this.fill();
	this.addAllBalls();
}

/*
 * @param {Number} angleRad
 * @returns {Object} Object with cx and cy attributes
 */
BUKE.angleToXY = function(angleRad){
	var obj = {
		cx : 300+this.rFromCenter * Math.cos(angleRad),
		cy : 200-this.rFromCenter * Math.sin(angleRad)
	}
	return obj;
}
 
/*
 * Fills the BUKE.positions array
 */
BUKE.fill = function(){
	for (var i=1;i<=this.circles;i++){
		// Loop circle values
		this.positions.push({
			id : i,
			angleRad : i/this.circles*2*Math.PI
		});
	}
}

/*
 *	Adds a ball with data already stored in the array to the circle 
 * @param {Number} id Id of ball to add
 */
BUKE.addBall = function(id){
	var ball = this.getBall(id);
	jQuery('#central svg').append("<circle class='ball' id='ball"+id+"' />");
	// Loop circle values
	var cx = this.angleToXY(ball.angleRad).cx;
	var cy = this.angleToXY(ball.angleRad).cy;
	jQuery('#ball'+id).attr('number',id).attr('cx',cx).attr('cy',cy)
	.attr('r',this.rBall).attr('fill','#'+Math.floor(10*Math.random())+''+Math.floor(10*Math.random())+''+Math.floor(10*Math.random()))
	.attr('stroke-width',1).attr('stroke','black');
}

/*
 * Calls BUKE.addBall() for all elements of BUKE.positions
 */
BUKE.addAllBalls = function(){
	for (key in this.positions){
		this.addBall(this.positions[key].id);
	}
}

/*
 * @param {Number} id Id of ball
 * @returns {Objects} Ball object with this id
 */
BUKE.getBall = function(id){
	for (var i=0;i<this.positions.length;i++){
		if (this.positions[i].id == id){return this.positions[i];}
	}
	console.log("There's no such ball.");
}

/*
 * Moves the ball to a new angle (model and view animation)
 * @param {Number} id Id of ball
 * @param {Number} newAngleRad New angle for the ball
 */
BUKE.newBallAngle = function(id,newAngleRad){
	var oldAngleRad = this.getBall(id).angleRad;
	this.getBall(id).angleRad = newAngleRad;
	this.animateBall(id,oldAngleRad,newAngleRad);
}

/*
 * Animates the ball in the ring
 * @param {Number} id
 * @param {Number} oldAngleRad
 * @param {Number} newAngleRad
 * @param {String} way String with "clockwise" or "anticlockwise"
 */
BUKE.animateBall = function(id,oldAngleRad,newAngleRad,way){
	var steps = 10;
	var animDuration = 200;
	var ball = this.getBall(id);
	var i = 1;
	var anim;
	var cloDist = angleDistance(oldAngleRad,newAngleRad,"clockwise");
	var antiCloDist = angleDistance(oldAngleRad,newAngleRad,"anticlockwise");
	function callback(){
		clearInterval(anim);
		// Save new angle to BUKE.positions
		BUKE.getBall(id).angleRad = newAngleRad;
	}
	anim = setInterval(function(){
		if(way == "anticlockwise"){
			var stepAngle = oldAngleRad + antiCloDist * i/steps;
		}
		else if(way == "clockwise"){
			var stepAngle = oldAngleRad - cloDist * i/steps;
		}
		else{
			console.log('Wrong "way" parameter in animateBall()');
		}
		// Move to step position
		jQuery('#ball'+id).attr('cx',BUKE.angleToXY(stepAngle).cx);
		jQuery('#ball'+id).attr('cy',BUKE.angleToXY(stepAngle).cy);
		if(i == steps){
			callback();
		}
		i++;
	},animDuration/steps);
}

/*
 * Pushes the balls away the make place for a dropped one
 * @param {Number} id Id of dropped ball
 * @param {Number} oldAngleRad Where it started from 
 * @param {Number} newAngleRad Where it will be moved
 */
BUKE.makePlaceFor = function(id,oldAngleRad,newAngleRad){
	var antiCloDist = angleDistance(oldAngleRad,newAngleRad,"anticlockwise");
	var closestToNewAngle = null;
	var closestToNewAngle2nd = null;
	var angleCloseness = 99999;
	var angleCloseness2nd = 99999;
	var friendsMotion = "";
	
	// Detect closest element and 2nd closest to destination (newAngleRad)
	for (var j=1;j<=this.positions.length;j++){
		if(j !== id){
			var distance1 = Math.abs(newAngleRad - this.getBall(j).angleRad);
			var distance2 = Math.abs(newAngleRad + 2*Math.PI - this.getBall(j).angleRad);
			var distance3 = Math.abs(newAngleRad - 2*Math.PI - this.getBall(j).angleRad);
			var distance = Math.min(distance1,Math.min(distance2,distance3));
			if (distance < angleCloseness2nd){
				angleCloseness2nd = distance;
				closestToNewAngle2nd = j;
				if(angleCloseness2nd < angleCloseness){
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
	function isInMoved(id){
		var result = false;
		for (key in isMoved){
			if(isMoved[key] == id){result = true;}
		}
		return result;
	}
	
	if (antiCloDist>Math.PI){
		for (var k=1;k<=this.positions.length;k++){
			var ball = this.getBall(k);
			if (k !== id && angleDistance(oldAngleRad,ball.angleRad,"anticlockwise") > antiCloDist){
				// Those whose anticlockwise distance from oldAngle are higher than antiCloDist will be translated anticlockwise
				// Push anticlockwise (by 2*Math.PI/circlesNb)
				console.log('Push clockwise ball '+ball.id);
				this.animateBall(ball.id,ball.angleRad,ball.angleRad+2*Math.PI/this.circles,"anticlockwise");
				isMoved.push(k);
			}
			else{
				
			}
		}
		friendsMotion = "anticlockwise";
	}
	else if(antiCloDist<Math.PI){
		for (var l=1;l<=this.positions.length;l++){

			var ball = this.getBall(l);
			if (l !== id && angleDistance(oldAngleRad,ball.angleRad,"anticlockwise") < antiCloDist){
				// Those whose anticlockwise distance from oldAngle are higher than antiCloDist will be translated anticlockwise
				// Push anticlockwise (by 2*Math.PI/circlesNb)
				console.log('Push clockwise ball '+ball.id);
				this.animateBall(ball.id,ball.angleRad,ball.angleRad-2*Math.PI/this.circles,"clockwise");
				isMoved.push(l);
			}
			
		}
		friendsMotion = "clockwise";
	}
	else{
		console.log('Problem with diff in BUKE.makePlaceFor()');
	}
	
	// Now move the dropped ball to new location
	if (friendsMotion == "clockwise" && isInMoved(closestToNewAngle)){
		this.animateBall(id,newAngleRad,newAngleRad-angleCloseness,"clockwise");
	}
	else if(friendsMotion == "clockwise" && isInMoved(closestToNewAngle2nd)){
		this.animateBall(id,newAngleRad,newAngleRad-angleCloseness2nd,"clockwise");
		
	}
	else if(friendsMotion == "anticlockwise" && isInMoved(closestToNewAngle)){
		this.animateBall(id,newAngleRad,newAngleRad+angleCloseness,"anticlockwise");
	}
	else if (friendsMotion == "anticlockwise" && isInMoved(closestToNewAngle2nd)){
		this.animateBall(id,newAngleRad,newAngleRad+angleCloseness2nd,"anticlockwise");
	}
	else{
	// No group motion, ball returns to original position
		console.log("Stays");
		this.animateBall(id,newAngleRad,oldAngleRad,"clockwise");
	}
} 

/*
 * @param {Number} angleRad Angle to compare
 * @param {Number} angleBeforeRad Angle to be compared to, lower value
 * @param {Number} angleAfterRad Angle to be compared to, higher value
 * @returns {Boolean} True if in between (ANTICLOCKWISE FROM angleRad TO toRad)
 */
BUKE.isBetween = function(angleRad,angleBeforeRad,angleAfterRad){
	function bet0and2pi(angleRad){
		return ((angleRad + 2*Math.PI)%(2*Math.PI));
	}
	var ang = bet0and2pi(angleRad);
	var before = bet0and2pi(angleBeforeRad);
	var after = bet0and2pi(angleAfterRad);
	if(before < after){
		if(ang>before && ang<after){return true;}
		else return false;
	}
	else{
		if(ang>before || ang<after){return true;}
		else return false;
	}
}

/*** Scripts executed on start ***/

jQuery(document).ready(function(){
	BUKE.shapeCentral();
	// Trick to make the svg elements visible
	setTimeout(function(){
		jQuery('#central').html(jQuery('#central').html());
		for (var i=1;i<=BUKE.circles;i++){
			dragMe('#ball'+i,'#central svg');
		}
	},500);
});
