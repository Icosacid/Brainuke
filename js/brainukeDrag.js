function dragMe(selector,containerselector){ 
	// The object
	var me = document.querySelector(selector);
	var jQme = jQuery(selector);
	var mycontainer = document.querySelector(containerselector);
	var myNum = jQme.attr('number');
	// Make all elements inside ipad non draggable (may be modified depending on the game)
	me.setAttribute("draggable","false");
	jQme.find('*').attr("draggable","false");
	
	// Initial positions, because need to initialize JS positioning, CSS isn't enough to define style.left attribute
	
	// If not SVG
	if(!jQme.is(jQuery('circle')) && !jQme.is(jQuery('path'))){
	
		me.style.left = jQme.css('left');
		me.style.top = jQme.css('top');
		
		var posX = me.style.left.slice(0, me.style.left.length-2);// To remove the "px" part
		var posY = me.style.top.slice(0, me.style.top.length-2);
	}
	// If svg (path or circle)
	else{
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
	function grab(){
		if (down == 0){
			jQuery(containerselector).append(jQme);
			jQme.css("cursor","grab").css("cursor","-moz-grab").css("cursor","-webkit-grab");
		}
		else{
			jQme.css("cursor","grabbing").css("cursor","-moz-grabbing").css("cursor","-webkit-grabbing");
		}
	}
	function drop(theEvent){
		// Calculate angle
		var angle = segmentAngleRad(300,200,parseFloat(theEvent.clientX),parseFloat(theEvent.clientY));
		var realAngle = 2*Math.PI - angle;
		console.log(300,200,parseFloat(theEvent.clientX),parseFloat(theEvent.clientY));
		console.log('Drop @ angle '+realAngle/Math.PI*180+'°');
		BUKE.makePlaceFor(myNum,BUKE.getBall(myNum).angleRad,realAngle);
	}

	function dragMaker(theEvent){
	//console.log("Client X detected is: "+theEvent.clientX/finalRatio);
	//console.log("Client Y detected is: "+theEvent.clientY/finalRatio);
	
		if (firsttime == 1 && down == 1){
			// If the location has been memorized at previous call and mouse is down
			// New positions
			posX = parseFloat(posX) + parseFloat(theEvent.clientX) - stampX;
			posY = parseFloat(posY) + parseFloat(theEvent.clientY) - stampY;
			var angle = segmentAngleRad(300,200,posX,posY);
			var forcedPosX = 300+BUKE.rFromCenter*Math.cos(angle);
			var forcedPosY = 200+BUKE.rFromCenter*Math.sin(angle);
			// Apply them
			
			// If not SVG
			jQme.attr('left',posX+"px");
			jQme.attr('top',posY+"px");
			// If SVG
			if (jQme.is(jQuery("circle"))){
				jQme.attr('cx',forcedPosX);
				jQme.attr('cy',forcedPosY);
			}
			else if (jQme.is(jQuery("path"))){
				var x = posX - initialPosX;
				var y = posY - initialPosY;
				jQme.attr('transform',"translate("+x+","+y+")");
				jQme.attr('-webkit-transform',"translate("+x+","+y+")");
				jQme.attr('-o-transform',"translate("+x+","+y+")");
				
			}
			else{console.log("SVG element not recognized")};
		}
		
		// Memorize pointer location
		
		stampX = theEvent.clientX;
		stampY = theEvent.clientY;
		firsttime = 1;
	}
	
	jQme.on("pointermove",function(ev){
		dragMaker(ev);
	});
	jQme.on("pointerdown",function(ev){
		down = 1;
		jQme.css("cursor","grabbing").css("cursor","-moz-grabbing").css("cursor","-webkit-grabbing");
	});
	jQme.on("pointerup",function(ev){
		down = 0;
		jQme.css("cursor","grab").css("cursor","-moz-grab").css("cursor","-webkit-grab");
		drop(ev);
	});
	jQme.on("pointerleave",function(ev){
		down = 0;
	});
	jQme.on("pointerenter",function(ev){
		jQuery(containerselector).append(jQme);
		jQme.css("cursor","grab").css("cursor","-moz-grab").css("cursor","-webkit-grab");
	});

}

function segmentAngleRad(Xstart,Ystart,Xtarget,Ytarget){
	var result;// Will range between 0 and 2PI
	if(Xstart == Xtarget){
		if(Ystart == Ytarget){
			result = 0; 
		}
		else if(Ystart < Ytarget){
			result = Math.PI/2;
		}
		else if(Ystart > Ytarget){
			result = 3*Math.PI/2;
		}
		else{}
	}
	else if(Xstart < Xtarget){
		result = Math.atan((Ytarget-Ystart)/(Xtarget-Xstart));
	}
	else if(Xstart > Xtarget){
		result = Math.PI + Math.atan((Ytarget-Ystart)/(Xtarget-Xstart));
	}
	
	return (result+2*Math.PI)%(2*Math.PI);
}

function angleDistance(fromAngle,toAngle,way){
	fromAngle = (fromAngle + 2*Math.PI) % (2*Math.PI);
	toAngle = (toAngle + 2*Math.PI) % (2*Math.PI);
	if(way == "anticlockwise"){
		if(toAngle>fromAngle){
			return (toAngle - fromAngle);
		}
		else{
			return (toAngle + 2*Math.PI - fromAngle);
		}
	}
	else if(way=="clockwise"){
		if(toAngle>fromAngle){
			return (2*Math.PI - (toAngle - fromAngle));
		}
		else{
			return (fromAngle - toAngle);
		}
	}
	else{
		console.log("Wrong way in angleDistance()");
	}
}