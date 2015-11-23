// Enemies our player must avoid

var screenWidth = 505,
    screenHeight = 606,
    tileWidth = 101,
    tileHeight = 81,
    playerSideMove = 101,
    playerVerticalMove = 83,
    playerEmptySpace = 64,
    score = 0;




var Enemy = function(x, y, h, w, image) {
    this.sprite = image;
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.speed = randomIntFromInterval();
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if(this.x < screenWidth){
        this.x += this.speed*dt;
        player.collideEnemy();
    }else{
        //this is to reset the enemy
        this.x = -100;
            if(level.level === 1){
                this.y = Math.floor(Math.random()*(250-60+1)+60);
            }else{
                this.y = Math.floor(Math.random()*(320-60+1)+60);
            }
        this.speed = randomIntFromInterval();
        this.x += this.speed*dt;
        player.collideEnemy();
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

var Player = function(x, y, h, w, image) {
    this.player = image;
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.lives = 5;
}

Player.prototype.render = function(){
    if(Resources.get(this.player)){
        ctx.drawImage(Resources.get(this.player), this.x, this.y);
    };
}

Player.prototype.update = function(){

}

Player.prototype.reset = function(){
    if(this.y + playerEmptySpace > playerVerticalMove){
        this.lives --;
        heart.update();
    }
    this.x = tileWidth*2;
    this.y = tileHeight*5;
}

Player.prototype.collideEnemy = function(){
        for(var i=0; i<allEnemies.length; i++){
            if(this.x < allEnemies[i].x + allEnemies[i].w &&
               this.x + this.w > allEnemies[i].x &&
               this.y < allEnemies[i].y + allEnemies[i].h &&
               this.y + this.h > allEnemies[i].y){
                    //setTimeout(function() {player.reset()}.bind(player.reset), 200);
                    player.reset();
            }
        }
}

Player.prototype.collideGem = function(){
    if(this.x < gem.x + gem.w &&
        this.x + this.w > gem.x &&
        this.y < gem.y + gem.h &&
        this.y + this.h > gem.y){
        score.update();
        gem.update();
    }
}

Player.prototype.handleInput = function(key){
    switch (key){
        case "left":
            if(this.x>tileWidth-1){
                this.x = this.x - playerSideMove;
            };
            this.collideGem();
            break;
        case "up":
            if(this.y + playerEmptySpace > playerVerticalMove){
                this.y = this.y - playerVerticalMove;
                    if(this.y + playerEmptySpace < playerVerticalMove){
                        setTimeout(function() {player.reset()}.bind(player.reset), 1000);
                    };
            };
            this.collideGem();
            break;
        case "right":
            if(this.x<screenWidth - tileWidth){
                this.x = this.x + playerSideMove;
            };
            this.collideGem();
            break;
        case "down":
            if(this.y + playerEmptySpace < screenHeight - tileHeight*2){
                this.y = this.y + playerVerticalMove;
            };
            this.collideGem();
    };

}


var Gem = function(x, y, h, w, image){
    this.gem = image;
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

Gem.prototype.update = function() {
        delete this.gem;
        gem = new Gem(gemX(), gemY(), 30, 30, 'images/Gem Blue Small.png');
        gem.render();
}

var Heart = function(x, y, image){
    this.x = x;
    this.y = y;
    this.heart = image;
    this.count = player.lives + " x ";
}

Heart.prototype.render = function(){
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    if(Resources.get(this.heart)){
        ctx.drawImage(Resources.get(this.heart), this.x + 45, this.y - 27);
    };
    ctx.fillText(this.count, this.x, this.y);
    ctx.strokeText(this.count, this.x, this.y);
}

//TODO: Update only once on first collision
Heart.prototype.update = function (){
    if(player.lives < 0){
        alert("Boo! You Lose");
        location.reload();
    }else{
       this.count = player.lives + " x ";
    }
}

var Score = function(x, y){
    this.x = x;
    this.y = y;
    this.points = 0;
    this.display = "Score: " + this.points;
}

Score.prototype.render = function(){
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(this.display, this.x, this.y);
    ctx.strokeText(this.display, this.x, this.y);
}

Score.prototype.update = function(){
    this.points ++;
    this.display = "Score: " + this.points;
    if(level.level === 1){
        level.score(2);
    }else if(level.level === 2){
        level.score(4);
    }else{
        level.score(6);
    }
}

var Level = function(x, y){
    this.x = x;
    this.y = y;
    this.level = 1;
    this.display = "Level " + this.level;
}

Level.prototype.render = function(){
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(this.display, this.x, this.y);
    ctx.strokeText(this.display, this.x, this.y);
}

Level.prototype.update = function(){
    this.level++;
    this.display = "Level "+this.level;
    level.render();
}

Level.prototype.score = function(points){
    var winLevel = "Yay! You win this level!";
    var winGame = "Yay! You won the game!";
    if(score.points === points){
        if(points === 6){
            alert(winGame);
            location.reload();
        }else{
            alert(winLevel);
            level.update();
            score.points = 0;
            score.display = "Score: " + score.points;
            player.reset();
            level.enemies();
        }
    }
}

Level.prototype.enemies = function(){
    if(this.level === 2){
        allEnemies.push(new Enemy(101, 301, 30, 60, 'images/enemy-bug.png'));
        allEnemies[2].render();
    }
}

//Instatiate objects
var allEnemies = [];
var level = new Level(205, 100);
var gem = new Gem (gemX(), gemY(), 35, 30, 'images/Gem Blue Small.png');
var player = new Player(tileWidth*2, tileHeight*5, 40, 30, 'images/char-boy.png');
var heart = new Heart(417, 100, 'images/Heart Small.png');
var score = new Score(10, 100);



function initialEnemies(){
    allEnemies.push(new Enemy(1, 60, 30, 60, 'images/enemy-bug.png'));
    allEnemies.push(new Enemy(202, 140, 30, 60, 'images/enemy-bug.png'));
    //allEnemies.push(new Enemy(101, 225, 30, 60, 'images/enemy-bug.png'));

    for(var i=0; i<allEnemies.length; i++){
        allEnemies[i].render();
    };
}
    
    level.render();
    gem.render();
    initialEnemies();
    player.render();
    heart.render();
    score.render();
    


//functions to generate random numbers
function randomIntFromInterval(){ 
    if(level.level === 1){ 
        return Math.floor(Math.random()*(300-100+1)+100);
    }else if(level.level === 2){
        return Math.floor(Math.random()*(400-200+1)+200);
    }else{
        return Math.floor(Math.random()*(500-200+1)+200);
    }
}

function randomX(){
        return Math.floor((Math.random() * 404 )+ 1);
}


function gemX (){
    var gemX = [25, 126, 227, 328, 429];
    var randomX = gemX[Math.floor(Math.random() * gemX.length)];
    return randomX;
}

function gemY (){
    if(level.level === 1){
        var gemY = [146, 222, 318];
    }else{
        var gemY = [146, 222, 318, 394];
    };
    var randomY = gemY[Math.floor(Math.random() * gemY.length)];
    return randomY;
}

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
