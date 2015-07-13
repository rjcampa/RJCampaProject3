//Constants involving game mechanics
//A new bug is added each level

var constant = {
  gamelevel: 6,
  leftbug: 'images/enemy-bug-left.png',
  rightbug: 'images/enemy-bug-right.png',
  bugWidth: 78,
  playerWidth: 80,
  yUnit: 83,
  xUnit: 101,
  yOffset: 68,

  //this function is used to test for enemy-player collisions
  colComp: function (x, min, max) {
    return (x > min && x < max);
  }
};

//Random number functions for enemy bugs; generates
//enemy x,y positions and speed
//xPos function is a 'coin flip' which starts the bug on
//the left or ride side of the canvas

var random = {
  xPos: function () {
    return (Math.floor(Math.random() * 2) === 0) ?
      -1 * constant.xUnit - Math.random() * boardConstant :
      8 * constant.xUnit + Math.random() * boardConstant;
  },
  yPos: function () {
    return constant.yOffset + constant.yUnit * Math.floor((Math.random() * 6));
  },
  speed: function () {
    return Math.floor((Math.random() * 400) + 75);
  }
};

//The boardConstant helps make higher levels more playable by
//increasing the distance each bug has to travel before looping
//back around. Since a bug is 78 pxls wide, each time a new
//bug is added, the board expands up to 7*12 pixels to accomodate.
//Used in the enemy.prototype.update

var boardConstant = 7 * (constant.gamelevel - 6);

//Resets the board
reset = function (lvl) {
  allEnemies = [];
  for (var i = 0; i < lvl; i++) {
    allEnemies[i] = new Enemy();
  }
  player = new Player();
};

//Enemy object
var Enemy = function () {

  this.x = random.xPos();
  this.initialState = this.x;
  this.sprite = (this.x > 0) ?
    constant.leftbug :
    constant.rightbug;
  this.body = this.x + constant.bugWidth;
  this.y = random.yPos();
  this.speed = random.speed();
};

//Update enemy position.  The nested 'if' statements test
//for collisions
Enemy.prototype.update = function (dt) {

  //if this sprite faces left, move it to the left
  //else, move it to the right;

  (this.sprite == constant.leftbug) ?
    this.x -= this.speed * dt:
    this.x += this.speed * dt;
  
  if (this.x < (-2 * constant.xUnit - boardConstant) ||
     (this.x > 9 * constant.xUnit + boardConstant)) {
        this.x = this.initialState;
  }
  this.body = this.x + constant.bugWidth;
  
  if (this.y == player.y) {
    if (constant.colComp(player.x, this.x, this.body) ||
      constant.colComp(player.body, this.x, this.body)) {
      console.log('ouch!');
      console.log('You reached level ' + (constant.gamelevel - 5) + '!');
      constant.gamelevel = 6;
      reset(constant.gamelevel);
    }
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Player object
var Player = function () {
  this.x = 4 * constant.xUnit;
  this.y = constant.yOffset + 6 * constant.yUnit;
  this.sprite = 'images/char-boy.png';
  //defines body for collisions
  this.body = this.x + constant.playerWidth;
  this.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };
  this.handleInput = function (e) {
    switch (e) {
    case 'left':
      if (this.x > 0) this.x -= 101;
      break;
    case 'right':
      if (this.x < 707) this.x += 101;
      break;
    case 'up':
      if (this.y > 67) this.y -= constant.yUnit;
      break;
    case 'down':
      if (this.y < 505) this.y += constant.yUnit;
      break;
    default:
      null;
    }
  };
};

//tests if the player has reached the water
Player.prototype.update = function () {
  this.body = this.x + constant.playerWidth;
  if (this.y <= 0) {
    constant.gamelevel++;
    reset(constant.gamelevel);
  }
};

//initial game start
reset(constant.gamelevel);

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