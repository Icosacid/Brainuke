window.app.service("Model", function(){

	this.notes=[];

//It calculates the cordinates of the shapes on the viewPort
//and updates the their coordinates
var updateShapesPosition= function(){

	var numberNotes=this.notes.length;

	for (var i=1;i<=numberNotes;i++){
		// Loop coordinate shape values 
		this.notes[i-1].x = 300+230 * Math.cos(i/numberNotes*2*Math.PI+(Math.PI/2));
		this.notes[i-1].y= 300-230 * Math.sin(i/numberNotes*2*Math.PI+(Math.PI/2));
	}
};

//Add note on the array of notes and update its position os the viewPort
this.addNote=function(note){

	var newNote = new Object();
	newNote.name=note;

	//This variables are used to define the style
	newNote.verified=false; //set as not verified initially
	newNote.isRight=true; //set the note as right when it is added

	//ATTENTION: The oldest note is in the end of the array
	this.notes.unshift(newNote);
	updateShapesPosition.call(this);
};

});
