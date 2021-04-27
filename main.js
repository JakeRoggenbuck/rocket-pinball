function Player() {
	this.speed = 5;

	// Sets the starting position
	this.x = width/2;

	// Used for wall bouncing
	this.size = 15;

	this.show = function() {
		fill(255);
		ellipse(this.x, height-20, 20, 20);
	}

	this.move = function(dir) {
		// Checks if the player has hit the walls
		if (dir == -1 && this.x < this.size) {return 0; }
		if (dir == 1 && this.x > width-this.size) {return 0; }
		// Move the player based on direction and speed
		this.x += dir * this.speed;
	}
}

function setup() {
	createCanvas(400, 300);
	player = new Player();
}
  
function draw() {
	background(51);
	player.show();

	if (keyIsDown(RIGHT_ARROW)) {
		player.move(1);
	} else if (keyIsDown(LEFT_ARROW)) {
		player.move(-1);
	}
}
