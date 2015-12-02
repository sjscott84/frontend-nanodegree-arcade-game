// Enemies our player must avoid

var screenWidth = 505,
    screenHeight = 606,
    screenHeightNew = 682,
    tileWidth = 101,
    tileHeight = 81,
    playerSideMove = 101,
    playerVerticalMove = 83,
    playerHeight = 75, 
    playerWidth = 67,
    playerTopSpace = 80,
    playerSideSpace = 40,
    enemeyHeight = 66,
    enemyWidth = 97,
    enemyTopSpace = 78,
    enemySideSpace = 2,
    gemHeight = 35,
    gemWidth = 30,
    gemTopSpace = 2,
    gemSideSpace = 2,
    heartHeight = 34,
    heartWidth = 34,
    heartTopSpace = 1.
    heartSideSpace = 1,
    score = 0;

var Enemy = function(x, y, h, w, emptyTop, emptySide, image) {
    this.sprite = image;
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.side = emptySide;
    this.top = emptyTop;
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
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    if(Resources.get(this.sprite)){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
}

var Player = function(x, y, h, w, emptyTop, emptySide, image) {
    this.player = image;
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.side = emptySide;
    this.top = emptyTop;
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
    if(this.y + playerTopSpace > playerVerticalMove){//this resets the player without losing a life when player gets to the water
        this.lives --;
        heart.update();
    }
    this.x = tileWidth * 2;
    this.y = tileHeight * 5;

}

Player.prototype.collideEnemy = function(){
    for(var i=0; i<allEnemies.length; i++){
        if(isCollisionWith(player, allEnemies[i]))  {
            //setTimeout(function() {player.reset()}.bind(player.reset), 200);
            player.update();
            player.reset();
        }
    }
}

Player.prototype.collideGem = function(){
    if(isCollisionWith(player, gem)){
        score.update();
        gem.update();
    }
}

Player.prototype.collideHeart = function(){
    if(safeHeart.oneChance === true){
        if(isCollisionWith(player, safeHeart)){
            safeHeart.newLife();
        }
    }
}

//Moves player around the screen
Player.prototype.handleInput = function(key){
    switch (key){
        case "left":
            if(this.x>tileWidth-1){
                this.x = this.x - playerSideMove;
            };
            this.collideGem();
            this.collideHeart();
            break;
        case "up":
            if(this.y + playerTopSpace > playerVerticalMove){
                this.y = this.y - playerVerticalMove;
                    if(this.y + playerTopSpace < playerVerticalMove){
                        setTimeout(function() {player.reset()}.bind(player.reset), 1000);
                    };
            };
            this.collideGem();
            this.collideHeart();
            break;
        case "right":
            if(this.x<screenWidth - tileWidth){
                this.x = this.x + playerSideMove;
            };
            this.collideGem();
            this.collideHeart();
            break;
        case "down":
            //if(level.level === 1){
                if(this.y + playerTopSpace < screenHeight - tileHeight*2){
                    this.y = this.y + playerVerticalMove;
                }
            //}else{
                //if (this.y + playerTopSpace < screenHeightNew - tileHeight*2){
                    //this.y = this.y + playerVerticalMove;
                //}
            //}
            this.collideGem();
            this.collideHeart();
    };

}

var Gem = function(x, y, h, w, top, side, image){
    this.gem = image;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.top = top;
    this.side = side;
}

Gem.prototype.render = function() {
    if(Resources.get(this.gem)){
        ctx.drawImage(Resources.get(this.gem), this.x, this.y);
    };
}

Gem.prototype.update = function() {
        var oldGem = this;
        var match = true;
        gem = new Gem(gemX(), gemY(), gemHeight, gemWidth, gemTopSpace, gemSideSpace, 'images/Gem Blue Small.png');
        
        console.log("old x"+oldGem.x+" y"+oldGem.y)
        console.log("new x"+gem.x+" y"+gem.y)
        while(match === true){
            if(gem.x === oldGem.x && gem.y === oldGem.y){
                gem = new Gem(gemX(), gemY(), gemHeight, gemWidth, gemTopSpace, gemSideSpace, 'images/Gem Blue Small.png');
            }else{
                gem.render();
                match = false;
            }
        }
}

//Provides life score for game
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

Heart.prototype.update = function (){
    if(player.lives < 0){
        Alert.render("Sorry, you lose");
    }else{
       this.count = player.lives + " x ";
    }
}

//Provides and extra life when lives get down to 1
var SafeHeart = function(x, y, h, w, top, side, image){
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.top = top;
    this.side = side;
    this.heart = image;
    this.oneChance = true;
}

SafeHeart.prototype.render = function(){
    if(player.lives === (1 || 0) && this.oneChance === true){
        if(Resources.get(this.heart)){
            ctx.drawImage(Resources.get(this.heart), this.x, this.y);
        }
    }
}

SafeHeart.prototype.newLife = function(){
    if(player.lives <= 1){
        player.lives++;
        heart.count = player.lives + " x ";
        delete this.safeHeart;
        this.oneChance = false;
    }
}

//Tracks the number of gems collected
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
        level.score(10);
    }else if(level.level === 2){
        level.score(4);
    }else{
        level.score(6);
    }
}

//Creates Levels
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
    this.display = "Level " + this.level;
    safeHeart.oneChance = true;
    level.render();
}

Level.prototype.score = function(points){
    if(score.points === points){
        if(points === 6){
            Alert.render("Yay, you won the game!")
        }else{
            setTimeout(function() {
                Alert.render("Yay, you won this level!");
                level.update();
                score.points = 0;
                score.display = "Score: " + score.points;
                level.player();
                level.enemies();
            }, 500);
        }
    }
}

Level.prototype.enemies = function(){
    if(this.level === 2){
        allEnemies.push(new Enemy(101, 301, enemeyHeight, enemyWidth, enemyTopSpace, enemySideSpace, 'images/enemy-bug.png'));
        allEnemies[2].render();
    }
}

Level.prototype.player = function(){
        player.x = tileWidth * 2;
        player.y = tileHeight * 5;
}

//Creates custom alert boxes
var CustomAlert = function (){
    this.winH = window.innerHeight;
    this.winW = window.innerWidth;
    this.dialogoverlay = document.getElementById('dialogoverlay');
    this.startBox = document.getElementById('startingBox');
    this.dialogbox = document.getElementById('dialogbox');
}

//Game instructions and start game button
CustomAlert.prototype.instructions = function (){
    this.dialogoverlay.style.height = this.winH+"px";
    this.startBox.style.top = 200+"px";
    this.startBox.style.left = (this.winW/2)-(450 * .5)+"px";
    document.getElementById('instructions').innerHTML = instructions;
    document.getElementById('startGame').innerHTML = '<button onclick="start.start()">Start Game!</button>';
}

CustomAlert.prototype.start = function(){
    this.dialogoverlay.style.display = "none";
    this.startBox.style.display = "none";
}

//Level, game win and lose alerts
CustomAlert.prototype.render = function(dialog){
    this.dialogoverlay.style.display = "block";
    this.dialogoverlay.style.height = this.winH+"px";
    this.dialogbox.style.display = "block";
    this.dialogbox.style.top = 200+"px";
    this.dialogbox.style.left = (this.winW/2)-(450 * .5)+"px";
    document.getElementById('dialogboxbody').innerHTML = dialog;
    document.getElementById('dialogboxfoot').innerHTML = '<button onclick="Alert.ok()">OK</button>';
}

CustomAlert.prototype.ok = function(){
    this.dialogbox.style.display = "none";
    this.dialogoverlay.style.display = "none";
    if(player.lives < 0 || score.points === 6){
        reload();
    }
}

//Instatiate objects
var instructions = "aslkjdh;ksjhg;asfg;sldhg<br>askjdfhsakjghksajhga<br>laksdflksdjhgk;sajhgklsgjh";
var allEnemies = [];
var level = new Level(205, 100);
var gem = new Gem (gemX(), gemY(), gemHeight, gemWidth, gemTopSpace, gemSideSpace, 'images/Gem Blue Small.png');
var player = new Player(tileWidth*2, tileHeight*5, playerHeight, playerWidth, playerTopSpace, playerSideSpace, 'images/char-boy.png');
var heart = new Heart(417, 100, 'images/Heart Small.png');
var score = new Score(10, 100);
var safeHeart = new SafeHeart(gemX(), gemY(), heartHeight, heartWidth, heartTopSpace, heartSideSpace, 'images/Heart Small Safe.png');
var start = new CustomAlert();
var Alert = new CustomAlert();

function initialEnemies(){
    allEnemies.push(new Enemy(1, 60, enemeyHeight, enemyWidth, enemyTopSpace, enemySideSpace, 'images/enemy-bug.png'));
    allEnemies.push(new Enemy(202, 140, enemeyHeight, enemyWidth, enemyTopSpace, enemySideSpace, 'images/enemy-bug.png'));

    for(var i=0; i<allEnemies.length; i++){
        allEnemies[i].render();
    };
}
    
start.instructions();
level.render();
gem.render();
initialEnemies();
player.render();
heart.render();
score.render();
safeHeart.render();


//function to handle collision detection for all objects
function isCollisionWith(player, thing) {
    var playerAdjustedX = player.x + player.side;
    var playerAdjustedY = player.y + player.top;
    var thingAdjustedX = thing.x + thing.side;
    var thingAdjustedY = thing.y + thing.top;
    if( playerAdjustedX < thingAdjustedX+ thing.w &&
        playerAdjustedX + player.w > thingAdjustedX &&
        playerAdjustedY < thingAdjustedY + thing.h &&
        playerAdjustedY + player.h > thingAdjustedY) {
        
        console.log("COLLISION");
        return true;
    }
}

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

function reload(){
    location.reload();
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

