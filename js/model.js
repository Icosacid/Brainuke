window.app.service("Model", function(){

	this.notes=[];
	this.score=0;
	this.players=[];

///////////////TEST AREA - REMOVE AFTERWARDS///////////


	//Testing score board
	maria=new Object();
	maria.name="augusto";
	maria.score=333;

	maria2=new Object();
	maria2.name="maria";
	maria2.score=24523;

	maria3=new Object();
	maria3.name="mariama";
	maria3.score=333333;

	maria4=new Object();
	maria4.name="sheng";
	maria4.score=33003;

	this.players.push(maria);
	this.players.push(maria2);
	this.players.push(maria3);
	this.players.push(maria4);
 ///////////////////////////////////////////////////////




//Add player on the list of players (name, score and rank)
this.addPlayer= function(player){
	this.players.push(player);
}


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

//todo: function that randomise the order of the note on the array
this.randomize= function(){

}

//todo: function triggered when the game starts
this.startGame= function(){

}

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

});
