function Obstacle() {
	this.speed = 3;
	this.y = 0;
	this.x = random(0+20, width-20)

	this.show = function() {
		fill(255);
		rect(this.x, this.y, 20, 20);
	}

	this.move = function() {
		this.y += 1 * this.speed;
	}
}

function Obstacles() {
	this.obstacles = [];
	
	this.add = function() {
		obstacles.push(new Obstacle())
	}

	this.draw = function() {
		for (var i = 0; i < this.obstacles.length; i++) {
			obs = this.obstacles[i];
			obs.show();

			// Delete the obstacle if it's left the screen
			if (obs.y > height + 20) {
				delete this.obstacles[i];
			}
		}
	}
}

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

	this.position_update = function() { 
		// Check what keys are down
		if (keyIsDown(RIGHT_ARROW)) {
			player.move(1);
		} else if (keyIsDown(LEFT_ARROW)) {
			player.move(-1);
		}
	}
}

function setup() {
	createCanvas(400, 300);
	player = new Player();
}
  
function draw() {
	background(51);
	player.show();
	player.position_update();

}
