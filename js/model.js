window.app.service("Model", function() {

	this.notes = [];
	this.score = 0;
	this.players = [];
	this.rankedPlayers = [];
	this.ballRadius = 50;
	this.ringRadius = 230;
	this.ringCenterX = 300;
	this.ringCenterY = 300;
	this.preDefinedSequences=[];
	this.notesRight=0;
	this.notesWrong=0;
	
	// Add player on the list of players (name and score)
	this.addPlayer = function(playerName) {
		var newPlayer= {};
		newPlayer.name=playerName;
		newPlayer.score=0;
		newPlayer.rank=null;
		this.players.push(newPlayer);
	}

	//rules of how the score is calculated
	this.updateScore=function(){
		this.score=this.score+100;
	}
	
	// Fills the rankedPlayers array
	this.rankPlayers = function() {
		//Creating a shallow copy of the array -> players
		this.rankedPlayers=this.players.slice(0);

		//Sorting array
		this.rankedPlayers.sort(function (a, b) {
			if (a.score < b.score) {
				return 1;
			}
			if (a.score > b.score) {
				return -1;
			}
		  // a must be equal to b
		  return 0;
		});
	}

	// Add note on the array of notes and update its position on the viewPort
	this.addNote = function(note) {

		var newNote = {};
		newNote.name = note;
		newNote.r = this.ballRadius;
		// style attributes
		newNote.verified = false; //set as not verified initially
		newNote.isRight = true; //set the note as right when it is added

		this.notes.push(newNote);
		this.updateShapesPosition();
		
	};

	this.removeNote =  function(noteId){
		this.notes.splice(noteId, 1);
		this.updateShapesPosition();
	}

	// Function that randomises the order of the notes in the array
	this.randomize = function() {
		var order = this.randomIntIndexList(this.notes.length, 0, this.notes.length - 1);
		var notesCopy = this.notes.slice();
		for (key in this.notes) {
			this.notes[key] = notesCopy[order[key]];
		}

		//After randomising we have to update the position of the notes inside the array
		this.updateShapesPosition();
	}

	//Function that connects the score and notes to the user when the game is over
	this.gameOver= function(){
		this.players[this.players.length-1].notes=this.notes;
		this.players[this.players.length-1].score=this.score;
		this.players[this.players.length-1].right=Math.floor(((this.notesWrong/this.notes.length)*100));
		this.players[this.players.length-1].wrong=Math.floor(((this.notesRight/this.notes.length)*100));
	}
	
	// Function that empties the notes array
	this.resetAll = function() {
		this.notes = [];
		this.score = 0;
		this.notesRight=0;
		this.notesWrong=0;
		this.rankedPlayers = [];
		this.rankPlayers();
	}
	
	// Function that returns an Int array with random values
	this.randomIntIndexList = function(size, min, max) {
		// size must be > (max-min)
		if (size > (max - min + 1)) {
			console.log("Values not accepted in randomIntIndexList()");
			return;
		}
		// min & max included
		var i = 0;
		var randomNum;
		var isAlreadyThere = false;
		var list = [];
		while (i < size) {
			// Generate random number
			randomNum = Math.floor(Math.random()*(max - min + 1) + min);
			// If already in list
			isAlreadyThere = false;
			for (var t = 0; t < list.length; t++) {
				if (randomNum == list[t]) { isAlreadyThere = true; }
			}
			if (!isAlreadyThere) {
				i++;
				list.push(randomNum);
			}
		}
		return list;
	}
	
	// It calculates the cordinates of the shapes on the viewPort
	// and updates the their coordinates
	this.updateShapesPosition = function() {
		var numberNotes = this.notes.length;
		var j=0;
		for (var i = numberNotes-1;  i >=0; i--) {
			// Loop coordinate shape values 
			this.notes[i].x = this.ringCenterX + this.ringRadius * Math.cos((j+1)/numberNotes*2*Math.PI + (Math.PI/2));
			this.notes[i].y = this.ringCenterY - this.ringRadius * Math.sin((j+1)/numberNotes*2*Math.PI + (Math.PI/2));
			j++;
		}
	};


//////////////////Predefined note/////////////////////
this.addPreDefinedSequence = function(arraySequence, name) {
	newSequence={};
	newSequence.name=name;
	newSequence.notes=arraySequence;
	this.preDefinedSequences.push(newSequence);
};	

this.usePreDefinedSequence= function(id){
	this.notes=[];
	var noteSequence=this.preDefinedSequences[id].notes;

	for(key in noteSequence){
		this.addNote(noteSequence[key]);
	}
};

//Happy Birthday to you//
var happyBirthday=["G", "G", "A", "G", "C", "B", "G", "G", "A", "G", "D", "C"];
this.addPreDefinedSequence(happyBirthday, "Happy Birthday");

//Twinkle, twinkle little star//
var twinkleTwinkle=["C", "C", "G", "G", "A", "A", "G", "F", "F", "E", "E", "D","D","C"];
this.addPreDefinedSequence(twinkleTwinkle, "Twinkle, twinkle little star");
///////////////////////////////////////////////////////

///////////////TEST AREA - REMOVE AFTERWARDS///////////

	//Testing score board
	maria = {};
	maria.name = "augusto";
	maria.score = 333;
	maria.rank = null;

	maria2 = {}
	maria2.name = "maria";
	maria2.score = 24523;
	maria2.rank = null;

	maria3 = {};
	maria3.name = "mariama";
	maria3.score = 333333;
	maria3.rank = null;
	
	maria4 = {};
	maria4.name = "sheng";
	maria4.score = 33003;
	maria4.rank = null;
	
	//this.players.push(maria);
	//this.players.push(maria2);
	//this.players.push(maria3);
	//this.players.push(maria4);
	
///////////////////////////////////////////////////////

});
