window.app.controller("BrainukeController", ["$scope", "$timeout", "Model", function($scope, $timeout, Model){

	console.log("controle added");

		//get the list of added notes from the model
		$scope.model=Model; 
		this.currentNote;
		this.currentPage=1;

		//get the list of players from the model
		this.players=Model.players;


		//The time is binded with the html, pass value to the model to handle it	
		this.timeCount;
		this.gameOn=false;

		var totalNotes=0;

		
		//Current player, it consist of a string of it's name, 
		//however for future implementation it could be an object that consists of all information of the player
		this.currentPlayer;

		this.addNote=function(note){
			//add note on the array on the model with all notes
			Model.addNote(note);
			totalNotes++;
		};

		this.randomize=function(){
			//ATTENTION:Call the model and randomise the sequence stored
			Model.randomize();
		};


		this.startGame= function(){
			////ATTENTION:Call the model and start the game
			this.gameOn=true;
			notesChecked=0;
		}


		//This function are related to the navigation within the the html, I don't now if it would 
		//if it should be in a separated controller
		this.isSetPage=function(page){
			return this.currentPage===page;
		}

		//homePage= 1
		//mainPage= 2
		//scorePage= 3
		this.setPage=function(pageId){
			this.currentPage=pageId;
		}



	}]);
