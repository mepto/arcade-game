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
  this.bugWidth = 75;
  this.bugHeight = 75;
  this.speed = (Math.floor(Math.random() * (100 - 90) + 10) * 15);
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.resetBug = function () {
    this.y = ((Math.floor(Math.random() * 3) + 1) * 83) - 25;
    this.x = -100;
    this.speed = (Math.floor(Math.random() * (100 - 90) + 10) * 15); //40
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
    } else if (param === 'restartGame'){
      player.lives = 3;
      scoreBoard.reset();
      endGame = false;
    }
    player.x = 404;
    player.y = 390;
  }
};

Player.prototype.update = function (dt) {
  checkCollision();
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
    }
    break;
  case 'down':
    if (this.y < 390) {
      this.y += 83;
    }
    break;
  case 'left':
    if (this.x > 0) {
      this.x -= 101;
    }
    break;
  case 'right':
    if (this.x < 808) {
      this.x += 101;
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

var StartScreen = function () {
  this.isOn = true;
};

StartScreen.prototype.handleInput = function (key) {
  switch (key) {
  case 'pause':
  case 'spaceBar':
  case 'yes':
//    console.log('handleinput before -- hasstarted: ' + hasStarted + ' -- ispaused: ' + isPaused + ' -- endgame: ' + endGame + ' -- this.ison: ' + this.isOn);
    this.isOn = false;
    isPaused = false;
    hasStarted = true;
    if (endGame) {
      player.resetPlayer('restartGame');
    }
//    console.log('handleinput after -- hasstarted: ' + hasStarted + ' -- ispaused: ' + isPaused + ' -- endgame: ' + endGame + ' -- this.ison: ' + this.isOn);
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
    screenText = ' GAME OVER!';
    pressText = 'Start again?';
    //    this.render();
  } else if (isPaused) {
    screenText = 'GAME PAUSED';
    pressText = 'Space to resume';
    this.isOn = true;
    //    this.render;
  } else if (!hasStarted) {
    this.isOn = true;
    screenText = 'START GAME?';
    pressText = 'Press Y to start';
    //    this.render();
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


var checkCollision = function () {
  for (var i = 0; i < allEnemies.length; i++) {
    var bugTop = allEnemies[i].y;
    var bugBottom = allEnemies[i].y + allEnemies[i].bugHeight;
    var bugLeft = allEnemies[i].x;
    var bugRight = allEnemies[i].x + allEnemies[i].bugWidth;
    var playerTop = player.y;
    var playerBottom = player.y + player.height;
    var playerLeft = player.x;
    var playerRight = player.x + player.width;
    if (bugRight >= playerLeft && bugRight <= playerRight && bugBottom >= playerTop && bugBottom <= playerBottom) {
      player.resetPlayer('collision');
    }
  }
};

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
  this.reset = function() {
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
//var allEnemies = [];
//var player = [];
var scoreBoard = new ScoreBoard();
var startScreen = new StartScreen();
//var startGame = function () {
var allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy(), new Enemy()];
var player = new Player();


//};


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
  if (!startScreen.isOn) {
    //    console.log('startscreen off - keycode: ' + e.keyCode + ' - ispaused: ' + isPaused + ' - end: ' + endGame + ' - hasStarted: ' + hasStarted);
    var allowedKeys = {
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      80: 'pause' // pause game
    };
    //    console.log(allowedKeys[e.keyCode]);
    player.handleInput(allowedKeys[e.keyCode]);
  } else if (startScreen.isOn) {
    //    console.log('startscreen on - keycode: ' + e.keyCode + ' - ispaused: ' + isPaused + ' - end: ' + endGame + ' - hasStarted: ' + hasStarted);
    var allowedKeys = {
      80: 'pause',
      89: 'yes', // yes start
      32: 'spaceBar', //yes start / resume
      78: 'no'
    };
    //    console.log(allowedKeys[e.keyCode]);
    startScreen.handleInput(allowedKeys[e.keyCode]);
  }
});
