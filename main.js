function Obstacle() {
	this.speed = 4;
	this.y = 0;
	this.x = random(0, RIGHT_EDGE)

	this.show = function() {
		fill(255);
		rect(this.x, this.y, 140, 20);
	}

	this.move = function() {
		this.y += this.speed;
	}
}

function Obstacles() {
	this.OBSTACLES = [];

	this.add = function() {
		this.OBSTACLES.push(new Obstacle())
		TOTAL_OBS += 1;
	}

	this.draw = function() {
		for (var i = 0; i < this.OBSTACLES.length-1; i++) {
			obs = this.OBSTACLES[i];
			obs.show();
			obs.move();

			obs.speed += 0.04;

			// Delete the obstacle if it's left the screen
			if (obs.y > BELOW_SCREEN) {
				this.OBSTACLES.splice(i, 1)
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
		ellipse(this.x, height-80, 40, 40);
	}

	this.move = function(dir) {
		// Checks if the PLAYER has hit the walls
		if (dir == -1 && this.x < this.size) { return 0; }
		if (dir == 1 && this.x > width-this.size) { return 0; }
		// Move the PLAYER based on direction and speed
		this.x += dir * this.speed;
	}

	this.position_update = function() { 
		// Check what keys are down
		if (keyIsDown(RIGHT_ARROW)) {
			PLAYER.move(1);
		} else if (keyIsDown(LEFT_ARROW)) {
			PLAYER.move(-1);
		}
	}
}

function Score() {
	this.calculate_score = function(total_obs) {
		return total_obs * 10;
	}

	this.score = this.calculate_score(0);

	this.draw = function() {
		textSize(32);
		text(this.score, 10, 30);
	}

	this.update_score = function(total_obs) {
		this.score = this.calculate_score(total_obs);
	}
}

function setup() {
	createCanvas(min(windowWidth/2, 600), windowHeight-50);

	RIGHT_EDGE = width - 140;
	BELOW_SCREEN = height + 20;

	PLAYER = new Player();
	OBSTACLES = new Obstacles();
	SCORE = new Score();

	OBS_FREQUENCY = 30;
	SCENE_NUM = 0;
	TOTAL_OBS = 0;

	// 0: start, 1: fly, 2: launch
	// If there is a good way to do enums, fix this
	CURRENT_STAGE = 0;

	fly = function() { CURRENT_STAGE = 1; SCENE_NUM = 30; removeElements(); };
	button = createButton("Start");
	button.position((windowWidth/2) - 100, windowHeight/2);
	button.mousePressed(fly);
}

function draw() {
	background(50);

	PLAYER.show();
	PLAYER.position_update();
	OBSTACLES.draw();

	console.log(CURRENT_STAGE);

	SCORE.draw();
	SCORE.update_score(TOTAL_OBS);

	if (CURRENT_STAGE == 1) {
		if (SCENE_NUM == OBS_FREQUENCY) {
			OBSTACLES.add();
			SCENE_NUM = 0;
		}
	}
	SCENE_NUM += 1;
}
