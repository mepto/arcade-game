// TODO: create a parent constructor for animated objects
// to keep it DRY (Don't repeat yourself)

'use strict';

// global variables
var endGame = false;
var isPaused = false;
var hasStarted = false;
var screenText;
var pressText;


/**
* @description: Enemies our player must avoid
* @constructor
*/
var Enemy = function () {
  // random selection of the row on which to start the bug
  this.y = ((Math.floor(Math.random() * 3) + 1) * 83) - 25;
  //the bugs start off screen
  this.x = -100;
  this.width = 75;
  this.height = 75;
  //random speed of the bug, within the dynamic to quite fast range
  this.speed = (Math.floor(Math.random() * (100 - 90) + 10) * 40);
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  // The bug reset randomly places each one of the on a new row, on the left of the board, with a new random speed
  this.resetBug = function () {
    this.y = ((Math.floor(Math.random() * 3) + 1) * 83) - 25;
    this.x = -100;
    this.speed = (Math.floor(Math.random() * (100 - 90) + 10) * 40); //40
  };
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  // this makes each bug move at its defined speed
  // until it reaches the end of the board, where it resets
  this.x += this.speed * dt;
  if (this.x > 909) {
    this.resetBug();
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/**
* @description: the player moved by the user
* @constructor
* @requirements: This class requires an update(),
* a render() and a handleInput() method
*/

var Player = function () {
  this.x = 404;
  this.y = 390;
  this.height = 100;
  this.width = 85;
  this.lives = 3;
  this.sprite = 'images/char-pink-girl.png';
  // this function resets the player's location
  // it is called when player reaches :
  // the water (points also increase)
  // a bug (a life is lost until no lives are left)
  this.resetPlayer = function (param) {
    if (param === 'collision') {
      this.lives -= 1;
      if (this.lives === 0) {
        endGame = true;
      }
    } else if (param === 'restartGame') {
      this.lives = 3;
      scoreBoard.reset();
      endGame = false;
      allRocks.forEach(function (rock) {
        rock.resetRock();
      });
    } else {
      scoreBoard.incrementScore();
    }
    this.x = 404;
    this.y = 390;
  }
};

Player.prototype.update = function (dt) {
  this.checkCollision('bugs');
};

Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (key) {
  // by checking collision with a rock
  // we can revert the player's location immediately
  // so it isn't visible to the naked eye and the player
  // seems to stay in place
  switch (key) {
  case 'up':
    if (this.y > 0) {
      this.y -= 83;
      if (this.checkCollision('rocks')) {
        this.y += 83;
      }
    }
    break;
  case 'down':
    if (this.y < 390) {
      this.y += 83;
      if (this.checkCollision('rocks')) {
        this.y -= 83;
      }
    }
    break;
  case 'left':
    if (this.x > 0) {
      this.x -= 101;
      if (this.checkCollision('rocks')) {
        this.x += 101;
      }
    }
    break;
  case 'right':
    if (this.x < 808) {
      this.x += 101;
      if (this.checkCollision('rocks')) {
        this.x -= 101;
      }
    }
    break;
  case 'pause':
    isPaused = true;
    break;
  };
  if (this.y === -25) {
    // delays the player reset to
    //actually see the player reach the water
    setTimeout(function () {
      this.resetPlayer();
    }.bind(this), 200);
  }
};

/**
* @description: this function checks the collision between the player and the bugs/rocks
* it could be updated to also manage other types of collission (gems for instance)
* @param {string} type - type of collision (bug or rock)
* @returns: resetfunction of player if bug, true if rock
* TODO: add gems and random lives
*/
Player.prototype.checkCollision = function (type) {
  switch (type) {
  case 'bugs':
    for (var i = 0, len = allEnemies.length; i < len; i++) {
      var bugTop = allEnemies[i].y;
      var bugBottom = allEnemies[i].y + allEnemies[i].height;
      var bugLeft = allEnemies[i].x;
      var bugRight = allEnemies[i].x + allEnemies[i].width;
      var playerTop = this.y;
      var playerBottom = this.y + this.height;
      var playerLeft = this.x;
      var playerRight = this.x + this.width;
      if (bugRight >= playerLeft && bugRight <= playerRight && bugBottom >= playerTop && bugBottom <= playerBottom) {
        this.resetPlayer('collision');
      }
    }
    break;
  case 'rocks':
    for (var i = 0, len = allRocks.length; i < len; i++) {
      var rockTop = allRocks[i].y;
      var rockBottom = allRocks[i].y + allRocks[i].height;
      var rockLeft = allRocks[i].x;
      var rockRight = allRocks[i].x + allRocks[i].width;
      var playerTop = this.y;
      var playerBottom = this.y + this.height;
      var playerLeft = this.x;
      var playerRight = this.x + this.width;
      if (rockRight >= playerLeft && rockRight <= playerRight && rockBottom >= playerTop && rockBottom <= playerBottom) {
        return true;
      } // don't put a "else return false" otherwise the loop stops on i > 0
    }
    break;
  default:
    break;
  }
};

/**
* @description: The rock class will randomly draw rocks on the board
* between the second row to the second last row
* @constructor
*/
var Rock = function () {
  this.x = ((Math.floor(Math.random() * 9)) * 101);
  this.y = ((Math.floor(Math.random() * 4) + 1) * 83) - 30;
  this.height = 75;
  this.width = 75;
  this.sprite = 'images/Rock.png';
  this.resetRock = function () {
    this.x = ((Math.floor(Math.random() * 9)) * 101);
    this.y = ((Math.floor(Math.random() * 4) + 1) * 83) - 30;
  };
};

Rock.prototype.update = function (dt) {

};

Rock.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description: The startscreen is a text that invite to start and
* resume/restart if the player paused or died
*/
var StartScreen = function () {
  this.isOn = true;
};

// This function manages the allowed keyed
// pressed on the keyboard by the user
StartScreen.prototype.handleInput = function (key) {
  switch (key) {
  case 'pause':
  case 'spaceBar':
  case 'yes':
    this.isOn = false;
    isPaused = false;
    hasStarted = true;
      //it catches also the endGame status and resets the player
    if (endGame) {
      player.resetPlayer('restartGame');
    }
    break;
  case 'no':
    this.isOn = true;
    isPaused = true;
    break;
  };
}
// the text to appear on the overlay screen is defined here
StartScreen.prototype.update = function (dt) {
  if (endGame) {
    this.isOn = true;
    screenText = 'GAME OVER!!';
    pressText = '   Start again?';
  } else if (isPaused) {
    screenText = ' GAME PAUSED';
    pressText = 'Resume: P/Space';
    this.isOn = true;
  } else if (!hasStarted) {
    this.isOn = true;
    screenText = 'START GAME?';
    pressText = 'Press Y to start';
  }
}

// this draws the overlay and writes the text
StartScreen.prototype.render = function () {
  ctx.font = "bold 25px Impact";
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(303, 200, 303, 150);
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "rgba(0,0,0,100)";
  ctx.fillText(screenText, 390, 250);
  ctx.fillText(pressText, 375, 280)
  ctx.strokeText(screenText, 390, 250);
  ctx.strokeText(pressText, 375, 280)
}

/**
* @description: the scoreboard writes the nb of lives left,
* the current score and the best score since page load
*/
var ScoreBoard = function () {
  this.starScore = 0;
  this.currentScoreLabel = 'Score: ';
  this.currentScoreLabelX = 410;
  this.currentScore = 0;
  this.bestScoreLabel = "Best score: ";
  this.bestScoreLabelX = 10;
  this.bestScore = 0;
  this.incrementScore = function () {
    this.currentScore = this.currentScore + 15;
  }
  // at the end of a game, if the score
  // is bigger then the best score, it replaces it
  // and the current score is reseted to 0
  this.reset = function () {
    if (this.currentScore > this.bestScore) {
      this.bestScore = this.currentScore;
    }
    this.currentScore = 0;
  }
};

ScoreBoard.prototype.update = function (dt) {
  ctx.fillStyle = "#ACE1F2";
  ctx.fillRect(-10, -10, 920, 250);
};

ScoreBoard.prototype.render = function () {
  ctx.font = "bold 25px Impact";
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#033644";
  ctx.fillText(this.currentScoreLabel, this.currentScoreLabelX, 35);
  ctx.strokeText(this.currentScoreLabel, this.currentScoreLabelX, 35);
  ctx.fillText(this.bestScoreLabel, this.bestScoreLabelX, 35);
  ctx.strokeText(this.bestScoreLabel, this.bestScoreLabelX, 35);
  ctx.fillText(this.currentScore, 490, 35);
  ctx.strokeText(this.currentScore, 490, 35);
  ctx.fillText(this.bestScore, 140, 35);
  ctx.strokeText(this.bestScore, 140, 35);
  ctx.fillText(player.lives, 885, 35);
  ctx.strokeText(player.lives, 885, 35);
};

// Instantiation of objects
var scoreBoard = new ScoreBoard();
var startScreen = new StartScreen();
var allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy()];
var allRocks = [new Rock(), new Rock(), new Rock(), new Rock(), new Rock(), new Rock(), new Rock(), new Rock(), new Rock(), new Rock()];
var player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
  //checks if starscreen is on or not and returns allowed keys accordingly
  if (!startScreen.isOn) {
    var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      80: 'pause' // pause game
    };
    player.handleInput(allowedKeys[e.keyCode]);
  } else if (startScreen.isOn) {
    var allowedKeys = {
      80: 'pause', //resume
      89: 'yes', // yes start
      32: 'spaceBar', //yes start / resume
      78: 'no'
    };
    startScreen.handleInput(allowedKeys[e.keyCode]);
  }
});
