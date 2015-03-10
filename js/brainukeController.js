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
	$scope.gameStep = 1;
	
	$scope.mikeOn = false;

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
		$scope.gameOn = true;
		$scope.intervalPromise = $interval(function() {
			if ($scope.mikeOn) {
				$scope.gameLoop();
			}
			// Test note
		}, 200);
		$scope.audiuke.init(function(stream) {
			$scope.mikeOn = true;
			$scope.audiuke.gotStream(stream);
			$scope.currentNote = $scope.model.notes[$scope.totalNotes-1-($scope.gameStep-1)].name;
			console.log("New note:" + $scope.currentNote);
		});
		
	}
	// Takes the game to the next step (test new note)
	$scope.nextStep = function() {
		
	}
	
	$scope.gameLoop = function() {
		console.log('You play:' + $scope.audiuke.noteString);
		if ($scope.audiuke.noteString == $scope.currentNote) {
			// Success
			console.log('Success!');
			// View feedback that note is OK
			$scope.model.notes[$scope.totalNotes-1-($scope.gameStep-1)].verified = true;
			$scope.model.notes[$scope.totalNotes-1-($scope.gameStep-1)].isRight = true;
			// Next step
			$scope.gameStep++;
			// Might be over!
			if (($scope.gameStep-1) !== $scope.totalNotes) {
				// Next step indeed
				$scope.currentNote = $scope.model.notes[$scope.totalNotes-1-($scope.gameStep-1)].name;
				console.log("New note:" + $scope.currentNote);
			} else {
				// Game over!
				// Killing the gameLoop
				$interval.cancel($scope.intervalPromise);
				// Reseting the game and showing the score page
				$scope.resetGame();
				$scope.setPage(3);
			}
		} else {
			// Wait...
		}
	}

	$scope.resetGame = function(){
		$scope.gameOn = false;
		$scope.mikeOn = false;
		$scope.totalNotes = 0;
		$scope.gameStep = 1;
		$scope.currentNote = null;
		$scope.model.resetAll();
	}

	//Forces rendering, creep solution, but it works, assuming that the
	//program is monothread and stops just to recognise the note
	/*$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
		console.log("ngRepeatFinished event is fired");
		if($scope.gameOn && $scope.totalNotes!== 0) {
		
			console.log("Into");
			$scope.model.checkNote($scope.totalNotes);
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
