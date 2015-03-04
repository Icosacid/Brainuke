var BUKE = {};
BUKE.rIn = 100;
BUKE.rOut = 152;
BUKE.circles = 15;

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
	for (var i=1;i<=this.circles;i++){
		jQuery('#central svg').append("<circle class='ball' id='ball"+i+"' />");
		// Loop circle values
		var rBall = (this.rOut-this.rIn)/2;
		var rFromCenter = (this.rOut+this.rIn)/2;
		var cx = 300+rFromCenter * Math.cos(i/this.circles*2*Math.PI);
		var cy = 200-rFromCenter * Math.sin(i/this.circles*2*Math.PI);
		jQuery('#ball'+i).attr('cx',cx).attr('cy',cy)
		.attr('r',rBall).attr('fill','#7ae')
		.attr('stroke-width',1).attr('stroke','black')
		.css('z-index',0);
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
