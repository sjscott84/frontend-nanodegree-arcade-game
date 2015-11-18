// Enemies our player must avoid

var screenWidth = 505,
screenHeight = 606,
tileWidth = 101,
tileHeight = 101,
playerSideMove = 101,
playerVerticalMove = 82,
playerHeight = 171,
playerEmptySpace = 64+10,
playerLowerEmptySpace = 32+10,
enemyEmptySpace = 78+10,
playerSideSpace = 17+10,
enemyLowerEmptySpace = 27+10,
score = 0;

var randomNumber = function randomIntFromInterval(){  
        return Math.floor(Math.random()*(350-200+1)+200);
    }

var randomX = function randomX(){
        return Math.floor((Math.random() * 404 )+ 1);
}


var Enemy = function(x, y, h, w) {
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.speed = randomNumber();
}

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
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    if(Resources.get(this.sprite)){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

}

var Player = function(x, y, h, w) {
    this.player = 'images/char-boy.png';
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
}

Player.prototype.update = function(){
    //this.x = tileWidth*2;
    //this.y = tileHeight*4; 
}

Player.prototype.reset = function(){
    this.x = tileWidth*2;
    this.y = screenHeight-135-playerEmptySpace; 
}

Player.prototype.render = function(){
    if(Resources.get(this.player)){
        ctx.drawImage(Resources.get(this.player), this.x, this.y);
    };
}

var Gem = function(x, y, w, h){
    this.gem = 'images/Gem Blue Small.png';
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

Gem.prototype.render = function() {
    if(Resources.get(this.gem)){
        ctx.drawImage(Resources.get(this.gem), this.x, this.y);
    };
}

Gem.prototype.collision = function() {
    if(this.x < player.x + playerSideSpace + player.w &&
        this.x + this.w > player.x + playerSideSpace &&
        this.y < player.y + playerEmptySpace + playerLowerEmptySpace + player.h &&
        this.h + this.y > player.y + playerEmptySpace + playerLowerEmptySpace){
        console.log("You got a gem!");
        gem.update();
    }
}

Gem.prototype.update = function() {
    if(score < 5){
        score++;
        delete this.gem;
        gem = new Gem(randomX(), randomNumber(), 33, 36);
        gem.render();
        console.log(score);
    }else{
        alert("You have completed this level!");
    };
}


Player.prototype.collide = function(){
    for(var i=0; i<allEnemies.length; i++){
        if(this.x + playerSideSpace < allEnemies[i].x + allEnemies[i].w &&
            this.x + playerSideSpace + this.w > allEnemies[i].x &&
            this.y + playerEmptySpace + playerLowerEmptySpace < allEnemies[i].y + enemyEmptySpace + enemyLowerEmptySpace + allEnemies[i].h &&
            this.h + this.y + playerEmptySpace + playerLowerEmptySpace > allEnemies[i].y + enemyEmptySpace + enemyLowerEmptySpace){
            setTimeout(function() {player.reset()}.bind(player.reset), 200);
        }
    }
}

//TODO:
//gem collide
//gem update
//keep score

Player.prototype.handleInput = function(key){
    switch (key){
        case "left":
            if(this.x>tileWidth-1){
                this.x = this.x - playerSideMove;
            };
            gem.collision();
            break;
        case "up":
            if(this.y + playerEmptySpace > playerVerticalMove){
                this.y = this.y - playerVerticalMove;
                    if(this.y + playerEmptySpace < playerVerticalMove){
                        setTimeout(function() {player.reset()}.bind(player.reset), 1000);
                    };
            };
            gem.collision();
            break;
        case "right":
            if(this.x<screenWidth - tileWidth){
                this.x = this.x + playerSideMove;
            };
            gem.collision();
            break;
        case "down":
            if(this.y + playerEmptySpace < screenHeight - tileHeight*2){
                this.y = this.y + playerVerticalMove;
            };
            gem.collision();
    };
}


var allEnemies = [];
var gem = new Gem (randomX(), randomNumber(), 33, 36);
var player = new Player(tileWidth*2, screenHeight-135-playerEmptySpace, 75, 67);

function initialEnemies(){
    allEnemies.push(new Enemy(1, 60, 66, 101));
    allEnemies.push(new Enemy(202, 140, 66, 101));
    //allEnemies.push(new Enemy(101, 225));

    for(var i=0; i<allEnemies.length; i++){
        allEnemies[i].render();
    };
}

    initialEnemies();
    player.render();
    gem.render()



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
