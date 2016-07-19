var endGame = false;
var isPaused = false;
var hasStarted = false;
var screenText;
var pressText;

// Enemies our player must avoid
var Enemy = function () {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.y = ((Math.floor(Math.random() * 3) + 1) * 83) - 25;
  this.x = -100;
  this.width = 75;
  this.height = 75;
  this.speed = (Math.floor(Math.random() * (100 - 90) + 10) * 40);
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
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
  this.x += this.speed * dt;
  if (this.x > 909) {
    this.resetBug();
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () { //function (selection) {
  this.x = 404;
  this.y = 390;
  this.height = 100;
  this.width = 85;
  this.lives = 3;
  this.sprite = 'images/char-pink-girl.png'; //selection
  this.resetPlayer = function (param) {
    if (param === 'collision') {
      player.lives -= 1;
      if (player.lives === 0) {
        endGame = true;
      }
    } else if (param === 'restartGame') {
      player.lives = 3;
      scoreBoard.reset();
      endGame = false;
    }
    player.x = 404;
    player.y = 390;
  }
};

Player.prototype.update = function (dt) {
  checkCollision('bugs');
};

Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (key) {
  //  console.log(key);
  switch (key) {
  case 'up':
    if (this.y > 0) {
      this.y -= 83;
      if (checkCollision('rocks')) {
        this.y += 83;
      }
    }
    break;
  case 'down':
    if (this.y < 390) {
      this.y += 83;
      if (checkCollision('rocks')) {
        this.y -= 83;
      }
    }
    break;
  case 'left':
    if (this.x > 0) {
      this.x -= 101;
      if (checkCollision('rocks')) {
        this.x += 101;
      }
    }
    break;
  case 'right':
    if (this.x < 808) {
      this.x += 101;
      if (checkCollision('rocks')) {
        this.x -= 101;
      }
    }
    break;
  case 'pause':
    isPaused = true;
    break;
  };
  if (this.y === -25) {
    setTimeout(function () {
      player.resetPlayer();
    }, 200);
    scoreBoard.incrementScore();
  }
};

//The rock class will randomly draw rocks on the field
var Rock = function () {
  this.x = ((Math.floor(Math.random() * 9)) * 101);
  this.y = ((Math.floor(Math.random() * 4)+1) * 83) - 30;
  this.height = 75;
  this.width = 75;
  this.sprite = 'images/Rock.png';
};

Rock.prototype.update = function (dt) {

};

Rock.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//The startscreen is a text that invite to start, restart if the player paused or died
var StartScreen = function () {
  this.isOn = true;
};

StartScreen.prototype.handleInput = function (key) {
  switch (key) {
  case 'pause':
  case 'spaceBar':
  case 'yes':
    this.isOn = false;
    isPaused = false;
    hasStarted = true;
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

StartScreen.prototype.update = function (dt) {
  if (endGame) {
    this.isOn = true;
    screenText = 'GAME OVER!!';
    pressText =  '  Start again?';
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


var checkCollision = function (type) {
  switch (type) {
  case 'bugs':
    for (var i = 0; i < allEnemies.length; i++) {
      var bugTop = allEnemies[i].y;
      var bugBottom = allEnemies[i].y + allEnemies[i].height;
      var bugLeft = allEnemies[i].x;
      var bugRight = allEnemies[i].x + allEnemies[i].width;
      var playerTop = player.y;
      var playerBottom = player.y + player.height;
      var playerLeft = player.x;
      var playerRight = player.x + player.width;
      if (bugRight >= playerLeft && bugRight <= playerRight && bugBottom >= playerTop && bugBottom <= playerBottom) {
        player.resetPlayer('collision');
      }
    }
    break;
  case 'rocks':
    for (var i = 0; i < allRocks.length; i++) {
      console.log(allRocks[i]);
      var rockTop = allRocks[i].y;
      var rockBottom = allRocks[i].y + allRocks[i].height;
      var rockLeft = allRocks[i].x;
      var rockRight = allRocks[i].x + allRocks[i].width;
      var playerTop = player.y;
      var playerBottom = player.y + player.height;
      var playerLeft = player.x;
      var playerRight = player.x + player.width;
      if (rockRight >= playerLeft && rockRight <= playerRight && rockBottom >= playerTop && rockBottom <= playerBottom) {
        return true;
      } // don't put a "else return false" otherwise the loop stops on i > 0
    }
    break;
  default:
    break;
  }
};


//The scoreboard writes the nb of lives left, the current score and the best score since page load
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
  this.render();
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

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
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
