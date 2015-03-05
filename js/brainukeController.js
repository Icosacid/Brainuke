window.app.controller("BrainukeController", ["$scope", "Model", function($scope, Model){

	console.log("controle added");

		//get the list of added notes from the model
		this.notes=Model.notes; 
		this.currentNote;
		this.score=Model.score;
		this.currentPage=1;

		//get the list of players from the model
		this.players=Model.players;

		//The time is binded with the html, pass value to the model to handle it	
		this.timeCount;
		
		//Current player, it consist of a string of it's name, 
		//however for future implementation it could be an object that consists of all information of the player
		this.currentPlayer;
		

		this.addNote=function(note){
			//add note on the array on the model with all notes
			Model.addNote(note);
			//inserted here in order to test 
			this.currentNote=this.notes[0];
			this.updateScore();
		};

		this.randomise=function(){
			//ATTENTION:Call the model and randomise the sequence stored
			console.log("randomising!!");
		};

		this.updateScore=function(){
			//ATTENTION:function should be changed depending of how it is implemented the model
			this.score=Model.score;
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
