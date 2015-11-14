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
var imageEmptySpace = 70;

var Enemy = function(x, y, h, w) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.speed = randomNumber();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if(this.x < screenWidth){
        this.x += this.speed*dt;
        player.collide();
    }else{
        //this is to reset the enemy
        this.x = -100;
        this.y = Math.floor(Math.random()*(250-60+1)+60);
        this.speed = randomNumber();
        this.x += this.speed*dt;
        player.collide();
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

var Player = function(x, y, h, w) {
    this.player = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;

};

Player.prototype.update = function(){
    //this.x = tileWidth*2;
    //this.y = tileHeight*4; 
};

Player.prototype.reset = function(){
    this.x = tileWidth*2;
    this.y = screenHeight-135-imageEmptySpace; 
};

Player.prototype.render = function(){
    if(Resources.get(this.player)){
        ctx.drawImage(Resources.get(this.player), this.x, this.y);
    };
};

Player.prototype.collide = function(){
    for(var i=0; i<allEnemies.length; i++){
        if(this.x < allEnemies[i].x + allEnemies[i].w &&
            this.x + this.w > allEnemies[i].x &&
            this.y < allEnemies[i].y + allEnemies[i].h &&
            this.h + this.y > allEnemies[i].y){
            console.log("COLLISION");
        }
    }
};

Player.prototype.handleInput = function(key){
    switch (key){
        case "left":
            if(this.x>tileWidth-1){
                this.x = this.x - playerSideMove;
            };
            break;
        case "up":
            if(this.y + imageEmptySpace > playerVerticalMove){
                this.y = this.y - playerVerticalMove;
                    if(this.y + imageEmptySpace < playerVerticalMove){
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
    };
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
   
var allEnemies = [];
var player = new Player(tileWidth*2, screenHeight-135-imageEmptySpace, 171, 101);

function initialEnemies(){
    allEnemies.push(new Enemy(1, 60, 171, 101));
    allEnemies.push(new Enemy(202, 140, 171, 101));
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
