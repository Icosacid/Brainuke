window.app.controller("BrainukeController", ["$scope","$interval", "$timeout", "Model", "Audiuke", function($scope, $interval, $timeout, Model, Audiuke) {

	console.log("Controller added");
	
	// Model service
	$scope.model = Model;
	$scope.players = Model.players;
	$scope.rankedPlayers = Model.rankedPlayers;
	
	// Audio service
	$scope.audiuke = Audiuke;
	
	// View variables
	$scope.currentPage = 1;
	
	// Game variables
	//Current player, it consist of a string of it's name, 
	//however for future implementation it could be an object that consists of all information of the player
	$scope.currentPlayer;
	$scope.currentNote;
	$scope.gameOver = false;
	$scope.gameOn = false;
	$scope.intervalPromise;
	//The time is binded with the html, pass value to the model to handle it
	$scope.timeCount;
	$scope.totalNotes = 0;

	/** View functions **/
	
	$scope.isSetPage = function(page) {
		return ($scope.currentPage === page);
	}
	//homePage = 1, mainPage = 2, scorePage = 3
	$scope.setPage = function(pageId) {
		$scope.currentPage = pageId;
	}
	
	/** Game setup functions **/
	$scope.addNote = function(note) {
		//add note on the array on the model with all notes
		$scope.model.addNote(note);
		$scope.totalNotes++;
	};
	$scope.randomize = function() {
		//ATTENTION:Call the model and randomise the sequence stored
		$scope.model.randomize();
	};

	/** Game functions **/
	$scope.startGame = function() {
		////ATTENTION:Call the model and start the game
		$scope.gameOn = true;
		//$scope.audiuke.init(this.gotStream);
		$scope.intervalPromise= $interval(function(){$scope.gameLoop();}, 100);
	}

	$scope.gameLoop= function(){

		//Add the sound function 

		//TEST/////////////////////////
		if(Math.random()>.5){
			$scope.currentNote = "A";
		}else{
			$scope.currentNote = "B";
		}

		///////////////////////////////

		$scope.totalNotes--;

		if($scope.totalNotes<=0){
			//Killing the gameLoop
			$interval.cancel($scope.intervalPromise);
			//Reseting the game and showing the score page
			$scope.resetGame();
			$scope.setPage(3);
		}
	}

	$scope.resetGame = function(){
		$scope.gameOn = false;
		$scope.currentNote = null;
		$scope.model.resetAll();
	}

	//Forces rendering, creep solution, but it works, assuming that the
	//program is monothread and stops just to recognise the note
	/*$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
		console.log("ngRepeatFinished event is fired");
		if($scope.gameOn && $scope.totalNotes!== 0) {
			console.log("Into");
			Model.checkNote($scope.totalNotes);
			$scope.totalNotes--;

			if($scope.totalNotes !== 0) {
				$scope.currentNote = Model.notes[$scope.totalNotes-1].name;
			} else {
				$scope.resetGame();
				$scope.setPage(3);
			}
		} else {
			console.log("Not Yet (outside)");
		}
	});*/

}]);
