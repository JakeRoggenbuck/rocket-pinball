function Obstacle() {
	this.speed = 4;
	this.y = 0;
	this.x = random(0+20, width-20)

	this.show = function() {
		fill(255);
		rect(this.x, this.y, 100, 20);
	}

	this.move = function() {
		this.y += 1 * this.speed;
	}
}

function Obstacles() {
	this.obstacles = [];

	this.add = function() {
		this.obstacles.push(new Obstacle())
	}

	this.draw = function() {
		for (var i = 0; i < this.obstacles.length-1; i++) {
			obs = this.obstacles[i];
			obs.show();
			obs.move();

			// Delete the obstacle if it's left the screen
			if (obs.y > height + 20) {
				this.obstacles.splice(i, 1)
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
		ellipse(this.x, height-80, 20, 20);
	}

	this.move = function(dir) {
		// Checks if the player has hit the walls
		if (dir == -1 && this.x < this.size) { return 0; }
		if (dir == 1 && this.x > width-this.size) { return 0; }
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
	createCanvas(windowWidth/2, windowHeight-50);
	player = new Player();
	obstacles = new Obstacles();
	frequency = 14;
	scene_num = 0;
}

function draw() {
	background(50);
	player.show();
	player.position_update();

	if (scene_num == frequency) {
		obstacles.add();
		scene_num = 0;
	}
	scene_num += 1;
	obstacles.draw();
}
