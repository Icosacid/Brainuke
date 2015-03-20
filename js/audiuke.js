/**
 * Angular service for audio input in Brainuke
 * Application for teaching yourself ukulele
 * for KTH course DH2641 - Interaction Programming
 *
 * Adapted from 
 * pitchdetect.js
 * Copyright (c) 2014 Chris Wilson
 *
 * by
 * Alexandre Andrieux
 * Mariama Oliveira
 * Midas Nouwens
 * Sheng Li
 *
 * @March 2015
 */

window.app.service("Audiuke", function() {

	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	this.audioContext = new AudioContext();
	this.isPlaying = false;
	this.sourceNode = null;
	this.analyser = null;
	this.theBuffer = null;
	this.DEBUGCANVAS = null;
	this.mediaStreamSource = null;
	this.detectorElem;
	this.canvasElem;
	this.waveCanvas;
	this.pitchElem;
	this.noteElem;
	this.detuneElem;
	this.detuneAmount;

	this.rafID = null;
	this.tracks = null;
	this.buflen = 1024;
	this.buf = new Float32Array(this.buflen);

	this.noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

	// New
	this.pitch = null;
	this.note = null;
	this.noteString = "";
	this.detune = null;
	var _this = this;
	
	
	this.init = function(callback) {
		try {
		_this.audioContext = new AudioContext();
		} catch(e) {console.log("Error here");}
		_this.getUserMedia({
			audio: true,
			video: false
		}, callback, function(error) {
			console.log("Error in getUserMedia: " + error);
		});
	}

	this.getUserMedia = function(dictionary, callback, error) {
		try {
			navigator.getUserMedia = 
				navigator.getUserMedia ||
				navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia;
			navigator.getUserMedia(dictionary, callback, error);
		} catch (e) {
			alert('getUserMedia threw exception :' + e);
		}
	}

	this.gotStream = function(stream) {
		// Create an AudioNode from the stream.
		_this.mediaStreamSource = _this.audioContext.createMediaStreamSource(stream);

		// Connect it to the destination.
		_this.analyser = _this.audioContext.createAnalyser();
		_this.analyser.fftSize = 2048;
		_this.mediaStreamSource.connect( _this.analyser );
		_this.updatePitch();
	}

	this.toggleOscillator = function() {
		if (_this.isPlaying) {
			//stop playing and return
			_this.sourceNode.stop( 0 );
			_this.sourceNode = null;
			_this.analyser = null;
			_this.isPlaying = false;
			if (!window.cancelAnimationFrame)
				window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
			window.cancelAnimationFrame( _this.rafID );
			return "play oscillator";
		}
		_this.sourceNode = _this.audioContext.createOscillator();

		_this.analyser = _this.audioContext.createAnalyser();
		_this.analyser.fftSize = 2048;
		_this.sourceNode.connect( _this.analyser );
		_this.analyser.connect( _this.audioContext.destination );
		_this.sourceNode.start(0);
		_this.isPlaying = true;
		_this.isLiveInput = false;
		_this.updatePitch();

		return "stop";
	}

	this.toggleLiveInput = function() {
		if (_this.isPlaying) {
			//stop playing and return
			_this.sourceNode.stop( 0 );
			_this.sourceNode = null;
			_this.analyser = null;
			_this.isPlaying = false;
			if (!window.cancelAnimationFrame)
				window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
			window.cancelAnimationFrame( _this.rafID );
		}
		_this.getUserMedia(
			{
				"audio": {
					"mandatory": {
						"googEchoCancellation": "false",
						"googAutoGainControl": "false",
						"googNoiseSuppression": "false",
						"googHighpassFilter": "false"
					},
					"optional": []
				},
			}, _this.gotStream);
	}

	this.togglePlayback = function() {
		if (_this.isPlaying) {
			//stop playing and return
			_this.sourceNode.stop( 0 );
			_this.sourceNode = null;
			_this.analyser = null;
			_this.isPlaying = false;
			if (!window.cancelAnimationFrame)
				window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
			window.cancelAnimationFrame( _this.rafID );
			return "start";
		}

		_this.sourceNode = _this.audioContext.createBufferSource();
		_this.sourceNode.buffer = _this.theBuffer;
		_this.sourceNode.loop = true;

		_this.analyser = _this.audioContext.createAnalyser();
		_this.analyser.fftSize = 2048;
		_this.sourceNode.connect( _this.analyser );
		_this.analyser.connect( _this.audioContext.destination );
		_this.sourceNode.start( 0 );
		_this.isPlaying = true;
		_this.isLiveInput = false;
		_this.updatePitch();

		return "stop";
	}

	this.noteFromPitch = function(frequency) {
		var noteNum = 12 * ( Math.log(frequency / 440)/Math.log(2) );
		return Math.round(noteNum) + 69;
	}

	this.frequencyFromNoteNumber = function(note) {
		return 440 * Math.pow(2,(note-69)/12);
	}

	this.centsOffFromPitch = function(frequency, note) {
		return Math.floor( 1200 * Math.log( frequency / this.frequencyFromNoteNumber(note))/Math.log(2) );
	}

	this.autoCorrelate = function(buf, sampleRate) {
		var SIZE = buf.length;
		var MIN_SAMPLES = 0;
		var MAX_SAMPLES = Math.floor(SIZE/2);
		var best_offset = -1;
		var best_correlation = 0;
		var rms = 0;
		var foundGoodCorrelation = false;
		var correlations = new Array(MAX_SAMPLES);

		for (var i = 0; i < SIZE; i++) {
			var val = buf[i];
			rms += val*val;
		}
		rms = Math.sqrt(rms/SIZE);
		if (rms < 0.01) // not enough signal
			return -1;

		var lastCorrelation = 1;
		for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
			var correlation = 0;

			for (var i = 0; i < MAX_SAMPLES; i++) {
				correlation += Math.abs((buf[i])-(buf[i+offset]));
			}
			correlation = 1 - (correlation/MAX_SAMPLES);
			correlations[offset] = correlation; // store it, for the tweaking we need to do below.
			if ((correlation > 0.9) && (correlation > lastCorrelation)) {
				foundGoodCorrelation = true;
				if (correlation > best_correlation) {
					best_correlation = correlation;
					best_offset = offset;
				}
			} else if (foundGoodCorrelation) {
				// short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
				// Now we need to tweak the offset - by interpolating between the values to the left and right of the
				// best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
				// we need to do a curve fit on correlations[] around best_offset in order to better determine precise
				// (anti-aliased) offset.

				// we know best_offset >=1, 
				// since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
				// we can't drop into this clause until the following pass (else if).
				var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];  
				return sampleRate/(best_offset+(8*shift));
			}
			lastCorrelation = correlation;
		}
		if (best_correlation > 0.01) {
			// console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
			return sampleRate/best_offset;
		}
		return -1;
	//	var best_frequency = sampleRate/best_offset;
	}

	this.updatePitch = function(time) {
		var cycles = new Array;
		_this.analyser.getFloatTimeDomainData( _this.buf );
		var ac = _this.autoCorrelate( _this.buf, _this.audioContext.sampleRate );
		
		if (ac == -1) {
			//console.log("vague");
			_this.noteString = "?";
			/*detectorElem.className = "vague";
			pitchElem.innerText = "--";
			noteElem.innerText = "-";
			detuneElem.className = "";
			detuneAmount.innerText = "--";*/
		} else {
			//detectorElem.className = "confident";
			_this.pitch = ac;
			//pitchElem.innerText = Math.round( pitch ) ;
			_this.note =  _this.noteFromPitch( _this.pitch );
			//noteElem.innerHTML = noteStrings[note%12];
			_this.detune = _this.centsOffFromPitch( _this.pitch, _this.note );
			/*if (detune == 0 ) {
				detuneElem.className = "";
				detuneAmount.innerHTML = "--";
			} else {
				if (detune < 0)
					detuneElem.className = "flat";
				else
					detuneElem.className = "sharp";
				detuneAmount.innerHTML = Math.abs( detune );
			}
			*/
			//console.log("Confident",_this.pitch,_this.note,_this.detune,_this.noteStrings[_this.note%12]);
			_this.noteString = _this.noteStrings[_this.note%12];
		}

		if (!window.requestAnimationFrame)
			window.requestAnimationFrame = window.webkitRequestAnimationFrame;
		_this.rafID = window.requestAnimationFrame( _this.updatePitch );
	}
	
});
