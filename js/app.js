// Enemies our player must avoid
var randomNumber = function randomIntFromInterval(){
        return Math.floor(Math.random()*(350-200+1)+100);
    };

var Enemy = function(x, y) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = randomNumber();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if(this.x<505){
        this.x += this.speed*dt;
    }else{
        this.x = -100;
        this.y = Math.floor(Math.random()*(250-60+1)+60);
        this.speed = randomNumber();
        this.x += this.speed*dt;
    }
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function(x, y) {
    this.player = 'images/char-boy.png';
    this.x = x;
    this.y = y;

};

Player.prototype.update = function(){
    //this.x += 101; 
};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.player), this.x, this.y);
};

Player.prototype.handleInput = function(){

};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
   
var allEnemies = [];
var player = new Player(202, 415);

function initialEnemies(){
    allEnemies.push(new Enemy(1, 60));
    allEnemies.push(new Enemy(202, 140));
    //allEnemies.push(new Enemy(101, 225));

    for(var i=0; i<allEnemies.length+1; i++){
        allEnemies[i].render();
    };
}

initialEnemies();
player.render();

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
