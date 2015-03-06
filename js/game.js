
onmessage = function(e) {
  	console.log('Message received from main script');
	pausecomp(1000);

	var notes= e.data[0];
	var score= e.data[1];

	for (var i = notes.length - 1; i >= 0; i--) {
		notes[i].verified=true;
		if(Math.random()>.5){
			notes[i].isRight=false;
		}else{
			score=score+1000;
		}
		console.log('Posting message back to main script');		
		postMessage([notes, score]);
	};
}