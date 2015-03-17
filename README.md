# Brainuke
Musical web application for KTH course Interaction Programming
by Midas Nouwens, Mariama Oliveira, Seng Li & Alexandre Andrieux
@ March 2015

## Navigation
* Save player's name in variable which will be used in score screen (DONE) 
* Reset player's name input when navigating back to start page (DONE)

## Game session

### UI
* Add remove note function (right now working with the double click of angular, however it is not working completely because of the drag and drop)
* Add buttons/list for predefined sequences (2 buttons added with two different sequence, not definitive layout, working!)
* Add progression/XP/score bar
* Add feedback animation when note is performed with success

### Preparation phase
* Allow drag & drop, removal and adding only in preparation phase
* Drag note text along with circle

### Sound
* If we have time, have it work on all browsers

### Notes sequences
* Add predefined sequences (array of notes) (2 buttons added with two different sequence (see model), not definitive layout, working!)
* Improve the button system for predefines sequences, or at least display which sequence it is (its name)
* Always start with top note even after drag & drop (detect which note is positioned with x = center and y = top and start from that one)

## Design
* Add background for game screen
* Smooth transition between screens (find some trick, since angluar ng-show/ng-hide directives force the CSS property display:none)
* Design for SVG elements
* Reposition all SVG elements correctly, in particular the text nodes depeding on their length so that they're always centered
* Increase the score table when new players are added  

## Feedback
* Go through the feedback on KTH social and grab the best out of it (there are some very relevant points)

## Presentation
* Tune ukulele
* Try predefined sequences :)

# Discussion
* Shall we do the two modes, practice VS live stream? (like step-by-step VS guitar hero)
* Shall we include time in practice mode to get more XP/score in the bar?
* How can we include this time input we have (under the Random button) in the game? Live stream mode?
* Is it better if we re-ask for permission to use microphone for each game, or only once?
