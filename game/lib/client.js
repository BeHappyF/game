var game = {};

//When loading, we store references to our
//drawing canvases, and initiate a game instance.
window.onload = function(){

	//Create our game client instance.
	game = new game_core();

	game = new Phaser.Game(800, 600, Phaser.AUTO, 'game'),
	// //Fetch the viewport
	// game.viewport = document.getElementById('viewport');
		
	// //Adjust their size
	// game.viewport.width = game.world.width;
	// game.viewport.height = game.world.height;

	// //Fetch the rendering contexts
	// game.ctx = game.viewport.getContext('2d');

	// //Set the draw style for the font
	// game.ctx.font = '11px "Helvetica"';

	//Finally, start the loop
	game.update( new Date().getTime() );

}; //window.onload