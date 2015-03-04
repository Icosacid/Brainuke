function dragMe(selector,containerselector){ 
	// The object
	var me = document.querySelector(selector);
	var jQme = jQuery(selector);
	var mycontainer = document.querySelector(containerselector);
	
	// Make all elements inside ipad non draggable (may be modified depending on the game)
	me.setAttribute("draggable","false");
	jQme.find('*').attr("draggable","false");
	
	// Initial positions, because need to initialize JS positioning, CSS isn't enough to define style.left attribute
	
	me.style.left = jQme.css('left');
	me.style.top = jQme.css('top');
	
	var posX = me.style.left.slice(0, me.style.left.length-2);// To remove the "px" part
	var posY = me.style.top.slice(0, me.style.top.length-2);
	
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
	function grabbed(){
		if (down == 0){
			jQme.css("cursor","grab").css("cursor","-moz-grab").css("cursor","-webkit-grab");
		}
		else{
			jQme.css("cursor","grabbing").css("cursor","-moz-grabbing").css("cursor","-webkit-grabbing");
		}
	}

	function dragMaker(thefuckingevent){
	//console.log("Client X detected is: "+thefuckingevent.clientX/finalRatio);
	//console.log("Client Y detected is: "+thefuckingevent.clientY/finalRatio);
	
		if (firsttime == 1 && down == 1){
			// If the location has been memorized at previous call and mouse is down
			// New positions
			posX = parseFloat(posX) + parseFloat(thefuckingevent.clientX) - stampX;
			posY = parseFloat(posY) + parseFloat(thefuckingevent.clientY) - stampY;
			// Apply them
			
			// If not SVG
			jQme.attr('left',posX+"px");
			jQme.attr('top',posY+"px");
			// If SVG
			if (jQme.is(jQuery("circle"))){
				jQme.attr('cx',posX+parseFloat(jQme.attr('r'))+"px");
				jQme.attr('cy',posY+parseFloat(jQme.attr('r'))+"px");
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
		
		stampX = thefuckingevent.clientX;
		stampY = thefuckingevent.clientY;
		firsttime = 1;
	}
	
	jQme.on("pointermove",function(ev){
		dragMaker(ev);
	});
	jQme.on("pointerdown",function(ev){
		down=1;
		grabbed();
	});
	jQme.on("pointerup",function(ev){
		down=0;
		grabbed();
	});
	jQme.on("pointerleave",function(ev){
		dragMaker(ev);
	});
	jQme.on("pointerenter",function(ev){
		down=0;
		grabbed();
	});

}
