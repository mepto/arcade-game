// Enemies our player must avoid
var Enemy = function () {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.y = ((Math.floor(Math.random() * 3) + 1) * 83) - 25;
  this.x = -100;
  //  this.bugTop = function() {this.y + 77};
  //  this.bugBottom = this.y + 77 + 78;
  //  this.bugLeft = this.x + 1;
  //  this.bugRight = this.x + 1 + 100;
  this.speed = (Math.floor(Math.random() * (100 - 90) + 10) * 4);
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.resetBug = function () {
    //    console.log(this);
    this.y = ((Math.floor(Math.random() * 3) + 1) * 83) - 25;
    this.x = -100;
    //    this.speed = (Math.floor(Math.random() * (100 - 90) + 10) * 40);
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
var Player = function () {
  this.x = 404;
  this.y = 390;
  //  this.playerTop = this.y + 53;
  //  this.playerBottom = this.y + 53 + 100;
  //  this.playerLeft = this.x + 7;
  //  this.playerRight = this.x + 7 + 85;
  this.score = 0;
  this.lives = 3;
  this.sprite = 'images/char-pink-girl.png';
  this.resetPlayer = function () {
    //    console.log(this);
    player.x = 404;
    player.y = 390;
  }
};

Player.prototype.update = function (dt) {
  //  console.log(this.width);
  if (isColliding()) {
    //    console.log('hello');
    this.resetPlayer();
  }
  //  console.log(isColliding());
};

Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function (key) {
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
  };
  if (this.y === -25) {
    setTimeout(function () {
      player.resetPlayer();
    }, 200);
    scoreBoard.incrementScore();
  }
};

var isColliding = function () {
  for (var enem = 0; enem < allEnemies.length; enem++) {
    var bugTop = allEnemies[enem].y + 77;
    var bugBottom = allEnemies[enem].y + 77 + 78;
    var bugLeft = allEnemies[enem].x + 1;
    var bugRight = allEnemies[enem].x + 1 + 100;
    var playerTop = player.y + 53;
    var playerBottom = player.y + 53 + 100;
    var playerLeft = player.x + 7;
    var playerRight = player.x + 7 + 85;
    if (bugRight > playerLeft && bugRight < playerRight) {
      console.log("collided " + playerTop + ' ' + playerBottom + ' ' + bugTop + ' ' + bugBottom);
      // collision detected!
      //    if (Math.floor(allEnemies[enem].x) < player.x + player.width && Math.floor(allEnemies[enem].y) +  == player.y) {
      console.log('true');
      return true;
    } else {
//      console.log('allEnemies[enem].bugRight: ' + bugRight + ' -- player.playerLeft: ' + playerLeft + ' -- allEnemies[enem].bugRight: ' + bugRight + ' -- player.playerRight: ' + playerRight + ' -- allEnemies[enem].bugTop: ' + bugTop + ' -- player.playerTop: ' + playerTop + ' -- allEnemies[enem].bugTop: ' + bugTop + ' -- player.playerBottom: ' + playerBottom);
      //      console.log(Math.floor(allEnemies[enem].y) + '   ' + player.y);
      return false;
    }
  }
}

var ScoreBoard = function () {
  this.starScore = 0;
  this.currentScoreLabel = 'Score: ';
  this.currentScoreLabelX = 10;
  this.currentScore = 0;
  this.bestScoreLabel = "Best score: "
  this.bestScore = 0;
  this.incrementScore = function () {
    this.currentScore = this.currentScore + 15;
  }
};

ScoreBoard.prototype.update = function (dt) {
  ctx.fillStyle = "#ACE1F2";
  ctx.fillRect(-10, -10, 920, 850);
  this.render();
};

ScoreBoard.prototype.render = function () {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#033644";
  ctx.fillText(this.currentScoreLabel, this.currentScoreLabelX, 25);
  ctx.font = "bold 20px Arial";
  ctx.fillText(this.currentScore, 90, 25);
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy()/*, new Enemy(), new Enemy(), new Enemy(), new Enemy()*/];
var player = new Player();
var scoreBoard = new ScoreBoard();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});
