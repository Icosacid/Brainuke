window.app.controller("BrainukeController", ["$scope","$interval", "$timeout", "Model", "Audiuke", "Draguke", function($scope, $interval, $timeout, Model, Audiuke, Draguke) {
	
	// Parameters
	$scope.idPrefix = "ball";
	
	// Model service
	$scope.model = Model;
	$scope.players = Model.players;
	$scope.rankedPlayers = Model.rankedPlayers;
	
	// Audio service
	$scope.audiuke = Audiuke;
	
	// Drag and drop service
	$scope.draguke = Draguke;
	$scope.draguke.init($scope.model, $scope.idPrefix);
	
	// View variables
	$scope.currentPage = 1;
	
	// Game variables
	// Current player, it consist of a string of it's name, 
	// however for future implementation it could be an object that consists of all information of the player
	$scope.inputName;
	$scope.currentPlayer;
	$scope.currentNote;
	
	$scope.gamePrep = false;
	$scope.gameOn = false;
	$scope.mikeOn = false;
	$scope.isGameOver = false;
	
	$scope.intervalPromise;
	$scope.clock;
	$scope.btnText="on";
	//The time is binded with the html, pass value to the model to handle it
	$scope.timeCount=1;
	$scope.timeCountActive=false;
	$scope.timesUp=false;
	$scope.totalNotes = 0;
	$scope.gameStep = 1;

	/** View functions **/
	$scope.isSetPage = function(page) {
		return ($scope.currentPage === page);
	};

	$scope.setPage = function(pageId) {
		//homePage = 1, mainPage = 2, scorePage = 3
		$scope.currentPage = pageId;
		if (pageId == 2) {
			
			$scope.addPlayer();
		}else if(pageId ===1){
			$scope.inputName="";
		}
		
	};

	/** Game setup functions **/
	$scope.timeToggle=function(){
		
		if($scope.timeCountActive){
			$scope.timeCountActive=false;
			$scope.btnText="on";
		}else{
			$scope.timeCountActive=true;
			$scope.btnText="off";
		}
	}


	$scope.addPlayer= function(){
		$scope.gamePrep = true;
		$scope.currentPlayer=$scope.inputName;	
		$scope.model.addPlayer($scope.currentPlayer);	
	};

	$scope.addPreDefinedSequence =  function(id){
		$scope.model.usePreDefinedSequence(id);
		$scope.totalNotes= $scope.model.notes.length;
		$timeout(function() {
			$scope.draguke.update();
		});
	}

	$scope.addNote = function(note) {
		$scope.model.addNote(note);
		console.log($scope.model.notes);
		// A digest loop is triggered in model.addNote() because the array notes changes
		// We want to wait for Angular to create the DOM SVG element before putting a listener on it
		// This is an amazing trick: using $timeout without time
		// It will just run once the current digest loop is over
		$timeout(function() {
			$scope.draguke.update();
		});
	};


	$scope.randomize = function() {
		$scope.model.randomize();
	};

	/** Game functions **/
	$scope.startGame = function() {
		$scope.totalNotes=$scope.model.notes.length;
		$scope.gamePrep = false;
		$scope.gameOn = true;

		// Start the loop
		$scope.intervalPromise = $interval(function() {
			if ($scope.mikeOn) {
				$scope.gameLoop();
			}
			// Test note
		}, 150);
		
		// Start microphone (and success callback)
		$scope.audiuke.init(function(stream) {
			$scope.mikeOn = true;
			$scope.audiuke.gotStream(stream);
			// Load first note
			//in case of having to finish in a specific time limit
			if($scope.timeCountActive){
				$scope.clock=$timeout(function() {
					$scope.timesUp=true;
				}, $scope.timeCount*1000);
			}
			$scope.currentNote = $scope.model.notes[($scope.gameStep-1)].name;
			console.log("New note:" + $scope.currentNote);
		});
	}

	$scope.nextStep = function() {
		// Success
		console.log('Success!');
		// View feedback that note is OK
		 $timeout.cancel($scope.clock);
		
		if(!$scope.timesUp){
			$scope.model.updateScore();
			$scope.model.notes[($scope.gameStep-1)].verified = true;
			$scope.model.notes[($scope.gameStep-1)].isRight = true;
			$scope.timesUp=false;
		}else{
			$scope.model.notes[($scope.gameStep-1)].verified = true;
			$scope.model.notes[($scope.gameStep-1)].isRight = false;
			$scope.timesUp=false;
		}
		// Next step
		$scope.gameStep++;

		//in case of having to finish in a specific time limit
		if($scope.timeCountActive){
			$scope.clock=$timeout(function() {
				$scope.timesUp=true;
			}, $scope.timeCount*1000);
		}

		// Might be over!
		if (($scope.gameStep-1) !== $scope.totalNotes) {
			// Next step indeed
			$scope.currentNote = $scope.model.notes[($scope.gameStep-1)].name;
			console.log("New note:" + $scope.currentNote);
		} else {
			// Game over!
			$scope.gameOver();
		}		
	}

	$scope.gameOver = function() {
		$scope.model.gameOver();
		
		// Killing the gameLoop
		$interval.cancel($scope.intervalPromise);
		$timeout(function() {
			$scope.isGameOver=true;
		// Showing the score page and reseting the game after a little while
		$timeout(function() {
			$scope.resetGame();
			$scope.setPage(3);
		}, 2000);
	},1000);
	}

	$scope.gameLoop = function() {
		console.log('You are playing:' + $scope.audiuke.noteString);
		if ($scope.audiuke.noteString == $scope.currentNote || $scope.timesUp) {
			$scope.nextStep();
		} else {
			// Wait...
		}
	}

	$scope.resetGame = function() {
		$timeout.cancel($scope.clock);
		$scope.timesUp=false;
		$scope.isGameOver=false;
		$scope.gameOn = false;
		$scope.mikeOn = false;
		$scope.totalNotes = 0;
		$scope.gameStep = 1;
		$scope.currentNote = null;
		$scope.model.resetAll();
	}

}]);
