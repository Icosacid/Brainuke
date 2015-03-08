window.app.controller("BrainukeController", ["$scope", "$timeout", "Model", function($scope, $timeout, Model) {

	console.log("Controller added");

	//get the list of added notes from the model
	$scope.model = Model; 
	this.currentNote;
	$scope.currentPage = 1;
	$scope.gameOver = false;
	
	//get the list of players from the model
	this.players = Model.players;
	this.rankedPlayers = Model.rankedPlayers;

	//The time is binded with the html, pass value to the model to handle it
	this.timeCount;
	$scope.gameOn = false;

	var totalNotes = 0;

	//Current player, it consist of a string of it's name, 
	//however for future implementation it could be an object that consists of all information of the player
	this.currentPlayer;

	this.addNote = function(note) {
		//add note on the array on the model with all notes
		Model.addNote(note);
		totalNotes++;
	};

	this.randomize = function() {
		//ATTENTION:Call the model and randomise the sequence stored
		Model.randomize();
	};

	this.startGame = function() {
		////ATTENTION:Call the model and start the game
		$scope.gameOn = true;
		$scope.model.addDummyBall();
		this.currentNote = Model.notes[totalNotes-1].name;
	}
	
	this.resetGame = function(){
	
	}
	
	//These functions are related to the navigation within the the html, I don't now
	//if it should be in a separated controller
	this.isSetPage = function(page) {
		return ($scope.currentPage === page);
	}

	//homePage = 1
	//mainPage = 2
	//scorePage = 3
	$scope.setPage = function(pageId) {
		$scope.currentPage = pageId;
	}
	
	//Forces redering, creep solution, but it works, assuming that the
	//program is monothread and stops just to recognise the note
	$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
		if($scope.gameOn && totalNotes!== 0) {
			Model.checkNote(totalNotes);
			totalNotes--;

			if(totalNotes !== 0) {
				this.currentNote = Model.notes[totalNotes-1].name;
			} else {
				$scope.setPage(3);
			}
		} else {
			console.log("not yet");
		}
	});

}]);
