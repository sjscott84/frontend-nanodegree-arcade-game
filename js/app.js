// Enemies our player must avoid
var randomNumber = function randomIntFromInterval(){
        return Math.floor(Math.random()*(350-200+1)+100);
    };

var screenWidth = 505;
var screenHeight = 606;
var tileWidth = 101;
var tileHeight = 101;
var playerSideMove = 101;
var playerVerticalMove = 82;
var playerHeight = 171;

var Enemy = function(x, y) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = randomNumber();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if(this.x < screenWidth){
        this.x += this.speed*dt;
    }else{
        //this is to reset the enemy
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
    if(Resources.get(this.sprite)){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

};

var Player = function(x, y) {
    this.player = 'images/char-boy-square.png';
    this.x = x;
    this.y = y;

};

Player.prototype.update = function(){
    //this.x = tileWidth*2;
    //this.y = tileHeight*4; 
};

Player.prototype.reset = function(){
    this.x = tileWidth*2;
    this.y = screenHeight-151; 
};

Player.prototype.render = function(){
    if(Resources.get(this.player)){
        ctx.drawImage(Resources.get(this.player), this.x, this.y);
    };
};

Player.prototype.handleInput = function(key){
    switch (key){
        case "left":
            if(this.x>tileWidth-1){
                this.x = this.x - playerSideMove;
            };
            break;
        case "up":
            if(this.y>playerVerticalMove){
                this.y = this.y - playerVerticalMove;
                    if(this.y<playerVerticalMove){
                        console.log("You win!");
                        setTimeout(function() {player.reset()}.bind(player.reset), 1000);
                    };
            };
            break;
        case "right":
            if(this.x<screenWidth - tileWidth){
                this.x = this.x + playerSideMove;
            };
            break;
        case "down":
            if(this.y<screenHeight - tileHeight*2){
                this.y = this.y + playerVerticalMove;
            };
            break;
    };
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
   
var allEnemies = [];
var player = new Player(tileWidth*2, screenHeight-151);

function initialEnemies(){
    allEnemies.push(new Enemy(1, 60));
    allEnemies.push(new Enemy(202, 140));
    //allEnemies.push(new Enemy(101, 225));

    for(var i=0; i<allEnemies.length; i++){
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
