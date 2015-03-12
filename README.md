# Brainuke
Musical web application for KTH course Interaction Programming
by Midas Nouwens, Mariama Oliveira, Seng Li & Alexandre Andrieux
@ March 2015

## Navigation
* Save player's name in variable which will be used in score screen
* Reset player's name input when navigating back to start page (DONE)

## Game session

### UI
* Add SVG text for the note detected by the microphone, under the requested note? (The html is there, just needs styling)
* Add remove note function
* Add buttons/list for predefined sequences
* Add progression/XP/score bar
* Add feedback animation when note is performed with success

### Preparation phase
* Allow drag & drop, removal and adding only in preparation phase
* Swap positions as well when randomizing, not just the order in the players array (DONE)
* Implement drag&drop

### Sound
* (all done?)

### Notes sequences
* Add predefined sequences (array of notes)

## Design
* Add background for game screen
* Smooth transition between screens (find some trick, since angluar ng-show/ng-hide directives force the CSS property display:none)
* Design for SVG elements
* Increase the score table when new players are added  

# Discussion
* Shall we do the two modes, practice VS live stream? (like step-by-step VS guitar hero)
* Shall we include time in practice mode to get more XP/score in the bar?
* How can we include this time input we have (under the Random button) in the game? Live stream mode?
* Is it better if we re-ask for permission to use microphone for each game, or only once?
