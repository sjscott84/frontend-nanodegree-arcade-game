var screenWidth = 505,
    screenHeight = 606,
    screenHeightNew = 682,
    tileWidth = 101,
    tileHeight = 81,
    playerSideMove = 101,
    playerVerticalMove = 83,
    playerHeight = 50, 
    playerWidth = 40,
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
    levelOneGems = 5,
    levelTwoGems = 10,
    levelThreeGems = 15,
    safe = 81,
    score = 0;

//Create the enemy object
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
        //this is to reset the enemy and ensure if comes from the left off screen
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
    }
}

//Create the player object
var Player = function(x, y, h, w, emptyTop, emptySide, image) {
    this.player = image;
    this.dead = false;
    this.collision = false;
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.side = emptySide;
    this.top = emptyTop;
    this.lives = 5;
}

//Draw the player on the screen
Player.prototype.render = function(){
    if(Resources.get(this.player)){
        ctx.drawImage(Resources.get(this.player), this.x, this.y);
    }
}

//Reset the player to starting position after a collision
Player.prototype.reset = function(){
    //this resets the player without losing a life when player gets to the water
    if(this.y + playerTopSpace > playerVerticalMove){
        this.lives --;
        heart.update();
    }
    this.x = tileWidth * 2;
    this.y = tileHeight * 5;
    player.dead = false;
}

//Find a collision between player and enemy
Player.prototype.collideEnemy = function(){
    if(player.dead === false){
        for(var i=0; i<allEnemies.length; i++){
            if(isCollisionWith(player, allEnemies[i])){
                player.dead = true;
                setTimeout(function() {player.reset()}.bind(player.reset), 200);
                player.update();
            }
        }
    }
}

//Find a collision between player and gem, updates the score then checks to see if more gems should be created based on score
Player.prototype.collideGem = function(){
    if(isCollisionWith(player, gem) && gem.allGems === false){
        score.update();
        if(level.level === 1 && score.gems < levelOneGems){
            gem.update();
        }else if(level.level === 2 && score.gems < levelTwoGems){
            gem.update();
        }else if(level.level === 3 && score.gems < levelThreeGems){
            gem.update();
        }else{
            delete gem.gem;
            gem.allGems = true;
        }
    }
}

//Find a collision between player and heart
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
        case 'left':
            if(this.x>tileWidth-1){
                this.x = this.x - playerSideMove;
            }
            this.collideGem();
            this.collideHeart();
            break;
        case 'up':
            if(this.y + playerTopSpace > playerVerticalMove){
                this.y = this.y - playerVerticalMove;
                    if(this.y + playerTopSpace < playerVerticalMove){
                        score.check();
                    }
            }
            this.collideGem();
            this.collideHeart();
            break;
        case 'right':
            if(this.x<screenWidth - tileWidth){
                this.x = this.x + playerSideMove;
            }
            this.collideGem();
            this.collideHeart();
            break;
        case 'down':
                if(this.y + playerTopSpace < screenHeight - tileHeight*2){
                    this.y = this.y + playerVerticalMove;
                }
            this.collideGem();
            this.collideHeart();
    }
}

//Create Gem object
var Gem = function(x, y, h, w, top, side, image){
    this.gem = image;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.top = top;
    this.side = side;
    this.match = true;
    this.allGems = false;
}

//Draw gem on screen
Gem.prototype.render = function() {
    if(Resources.get(this.gem)){
        ctx.drawImage(Resources.get(this.gem), this.x, this.y);
    }
}

//Updates gem to new location when there is a collision ensuring the gem does not appear in the same spot twice in a row
Gem.prototype.update = function() {
    var oldGem = this;
    gem = new Gem(gemX(), gemY(), gemHeight, gemWidth, gemTopSpace, gemSideSpace, 'images/Gem Blue Small.png');
    while(this.match === true){
        if(gem.x === oldGem.x && gem.y === oldGem.y){
            gem = new Gem(gemX(), gemY(), gemHeight, gemWidth, gemTopSpace, gemSideSpace, 'images/Gem Blue Small.png');
        }else{
            gem.render();
            this.match = false;
        }
    }
}

//Provides life score for game by creating a heart object
var Heart = function(x, y, image){
    this.x = x;
    this.y = y;
    this.heart = image;
    this.count = player.lives + " x ";
}

//Draw the life count on screen
Heart.prototype.render = function(){
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    if(Resources.get(this.heart)){
        ctx.drawImage(Resources.get(this.heart), this.x + 45, this.y - 27);
    }
    ctx.fillText(this.count, this.x, this.y);
    ctx.strokeText(this.count, this.x, this.y);
}

//Update the life count on collision with enemy
Heart.prototype.update = function (){
    if(player.lives < 0){
        Alert.render('Sorry, you lose');
    }else{
       this.count = player.lives + ' x ';
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

//Draw the extra life on the screen when player lives is 1 or 0
SafeHeart.prototype.render = function(){
    if(player.lives <=1 && this.oneChance === true){
        if(Resources.get(this.heart)){
            ctx.drawImage(Resources.get(this.heart), this.x, this.y);
        }
    }
}

//Adds an extra life to life count on collision with heart & ensures only one safeHeart is avaliable per level
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
    this.gems = 0;
    this.display = 'Gems: ' + this.gems;
}

//Draw gems on screen
Score.prototype.render = function(){
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(this.display, this.x, this.y);
    ctx.strokeText(this.display, this.x, this.y);
}

//Updates the score on collision with gems
Score.prototype.update = function(){
    this.gems ++;
    this.display = 'Gems: ' + this.gems;
}

//Checks to see if player has enough gems to win level once in the water
Score.prototype.check = function(){
    if(level.level === 1){
        level.score(levelOneGems);
    }else if(level.level === 2){
        level.score(levelTwoGems);
    }else{
        level.score(levelThreeGems);
    }
}

//Creates Levels
var Level = function(x, y){
    this.x = x;
    this.y = y;
    this.level = 1;
    this.display = 'Level ' + this.level;
}

//Draw the level number on screen
Level.prototype.render = function(){
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(this.display, this.x, this.y);
    ctx.strokeText(this.display, this.x, this.y);
}

//Update the level when enough gems are collected
Level.prototype.update = function(){
    this.level++;
    this.display = 'Level ' + this.level;
    safeHeart.oneChance = true;
    level.render();
}

//Indicates if player has won the level or the game based on score/number of gems collected & if the player has reached the water
Level.prototype.score = function(points){
        if(score.gems === points && player.y + playerTopSpace < safe){
            if(points === levelThreeGems){
                Alert.render('Yay, you won the game!');
            }else{
                setTimeout(function() {
                    Alert.render('Yay, you won this level!');
                    level.update();
                    score.gems = 0;
                    score.display = 'Gems: ' + score.gems;
                    player.reset();
                    level.enemies();
                    gem = gem = new Gem (gemX(), gemY(), gemHeight, gemWidth, gemTopSpace, gemSideSpace, 'images/Gem Blue Small.png');
                    gem.render();
                }, 500);
            }
        }else{
            setTimeout(function() {player.reset()}.bind(player.reset), 1000);
        }
}

//Adds an extra enemy to screen on level 2
Level.prototype.enemies = function(){
    if(this.level === 2){
        allEnemies.push(new Enemy(101, 301, enemeyHeight, enemyWidth, enemyTopSpace, enemySideSpace, 'images/enemy-bug.png'));
        allEnemies[2].render();
    }
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
    this.dialogoverlay.style.height = this.winH + 'px';
    this.startBox.style.top = 60 + 'px';
    this.startBox.style.left = (this.winW / 2) - (450 * .5) + 'px';
    document.getElementById('instructions').innerHTML = instructions;
    document.getElementById('startGame').innerHTML = '<button onclick="start.start()">Start Game!</button>';
}

//Start Game button
CustomAlert.prototype.start = function(){
    this.dialogoverlay.style.display = 'none';
    this.startBox.style.display = 'none';
}

//Level, game win and lose alerts
CustomAlert.prototype.render = function(dialog){
    this.dialogoverlay.style.display = 'block';
    this.dialogoverlay.style.height = this.winH + 'px';
    this.dialogbox.style.display = 'block';
    this.dialogbox.style.top = 200 + 'px';
    this.dialogbox.style.left = (this.winW / 2) - (450 * .5) + 'px';
    document.getElementById('dialogboxbody').innerHTML = dialog;
    document.getElementById('dialogboxfoot').innerHTML = '<button onclick="Alert.ok()">OK</button>';
}

//OK button on alerts
CustomAlert.prototype.ok = function(){
    this.dialogbox.style.display = 'none';
    this.dialogoverlay.style.display = 'none';
    if(player.lives < 0 || score.gems === levelThreeGems){
        reload();
    }
}

//Instatiate objects
var instructions = "Collect all the gems and get to the water!<br>Level 1 - collect 5 gems<br>Level 2 - collect 10 gems<br>Level 3 - collect 15 gems<br>Complete all 3 levels to win game!<br><br>Water and grass are safe<br>but entering the water without all the gems will reset your player.<br><br>Have fun and good luck!<br><br>Pssst...keep an eye out for the extra lives.";
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

    for(var i = 0; i < allEnemies.length; i++){
        allEnemies[i].render();
    };
}

//render objects
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
        return true;
    }
}

//functions to generate random numbers
function randomIntFromInterval(){ 
    if(level.level === 1){ 
        return Math.floor(Math.random() * (300 - 100 + 1) + 100);
    }else if(level.level === 2){
        return Math.floor(Math.random()*(400 - 200 + 1) + 200);
    }else{
        return Math.floor(Math.random()*(500 - 200 + 1) + 200);
    }
}

function randomX(){
        return Math.floor((Math.random() * 404 ) + 1);
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

//Reloads page after game loss or win
function reload(){
    location.reload();
}

// This listens for key presses and sends the keys to your Player.handleInput() method.
document.addEventListener('keyup', function(e) {

    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

