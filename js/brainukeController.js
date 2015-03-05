window.app.controller("BrainukeController", ["$scope", "Model", function($scope, Model){

	console.log("controle added");
		this.notes=Model.notes;
		this.currentNote;
		
		this.timeCount;
		//this.notes=[1, 3, 4];
		

		this.addNote=function(note){
			//add note on the array on the model with all notes
			Model.addNote(note);
			//inserted here in order to test 
			this.currentNote=this.notes[0];
		};

		this.randomise=function(){
			//Call the model and randomise the sequence stored
			console.log("randomising!!");
		};

}]);
