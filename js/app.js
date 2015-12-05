'use strict';

var SCREEN_WIDTH = 505,
    SCREEN_HEIGHT = 606,
    TILE_WIDTH = 101,
    TILE_HEIGHT = 81,
    PLAYER_SIDE_MOVE = 101,
    PLAYER_VERTICAL_MOVE = 83,
    PLAYER_HEIGHT = 50,
    PLAYER_WIDTH = 40,
    PLAYER_TOP_SPACE = 80,
    PLAYER_SIDE_SPACE = 40,
    ENEMY_HEIGHT = 66,
    ENEMY_WIDTH = 97,
    ENEMY_TOP_SPACE = 78,
    ENEMY_SIDE_SPACE = 2,
    GEM_HEIGHT = 35,
    GEM_WIDTH = 30,
    GEM_TOP_SPACE = 2,
    GEM_SIDE_SPACE = 2,
    HEART_HEIGHT = 34,
    HEART_WIDTH = 34,
    HEART_TOP_SPACE = 1,
    HEART_SIDE_SPACE = 1,
    LEVEL_ONE_GEMS = 5,
    LEVEL_TWO_GEMS = 10,
    LEVEL_THREE_GEMS = 15,
    SAFE = 81,
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
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if(this.x < SCREEN_WIDTH){
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
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    if(Resources.get(this.sprite)){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

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
};

//Draw the player on the screen
Player.prototype.render = function(){
    if(Resources.get(this.player)){
        ctx.drawImage(Resources.get(this.player), this.x, this.y);
    }
};

//Reset the player to starting position after a collision
Player.prototype.reset = function(){
    //this resets the player without losing a life when player gets to the water
    if(this.y + PLAYER_TOP_SPACE > PLAYER_VERTICAL_MOVE){
        this.lives --;
        heart.update();
    }
    this.x = TILE_WIDTH * 2;
    this.y = TILE_HEIGHT * 5;
    this.dead = false;
};

//Find a collision between player and enemy
Player.prototype.collideEnemy = function(){
    if(this.dead === false){
        for(var i=0; i<allEnemies.length; i++){
            if(isCollisionWith(this, allEnemies[i])){
                this.dead = true;
                setTimeout(this.reset.bind(this), 200);
            }
        }
    }
};

//Find a collision between player and gem, updates the score then checks to see if more gems should be created based on score
Player.prototype.collideGem = function(){
    if(isCollisionWith(this, gem) && gem.allGems === false){
        score.update();
        if(level.level === 1 && score.gems < LEVEL_ONE_GEMS){
            gem.gemUpdate();
        }else if(level.level === 2 && score.gems < LEVEL_TWO_GEMS){
            gem.gemUpdate();
        }else if(level.level === 3 && score.gems < LEVEL_THREE_GEMS){
            gem.gemUpdate();
        }else{
            delete gem.image;
            gem.allGems = true;
        }
    }
};

//Find a collision between player and heart
Player.prototype.collideHeart = function(){
    if(safeHeart.oneChance === true){
        if(isCollisionWith(this, safeHeart)){
            safeHeart.newLife();
        }
    }
};

//Moves player around the screen
Player.prototype.handleInput = function(key){
    switch (key){
        case 'left':
            if(this.x > TILE_WIDTH - 1){
                this.x = this.x - PLAYER_SIDE_MOVE;
            }
            this.collideGem();
            this.collideHeart();
            break;
        case 'up':
            if(this.y + PLAYER_TOP_SPACE > PLAYER_VERTICAL_MOVE){
                this.y = this.y - PLAYER_VERTICAL_MOVE;
                    if(this.y + PLAYER_TOP_SPACE < PLAYER_VERTICAL_MOVE){
                        score.check();
                    }
            }
            this.collideGem();
            this.collideHeart();
            break;
        case 'right':
            if(this.x < SCREEN_WIDTH - TILE_WIDTH){
                this.x = this.x + PLAYER_SIDE_MOVE;
            }
            this.collideGem();
            this.collideHeart();
            break;
        case 'down':
                if(this.y + PLAYER_TOP_SPACE < SCREEN_HEIGHT - TILE_HEIGHT *  2){
                    this.y = this.y + PLAYER_VERTICAL_MOVE;
                }
            this.collideGem();
            this.collideHeart();
    }
};

//Create Gem and safeHeart objects
var CollectableObject = function(h, w, top, side, image, shouldRenderFunc){
    this.image = image;
    this.x = this.xCordinates();
    this.y = this.yCordinates();
    this.w = w;
    this.h = h;
    this.top = top;
    this.side = side;
    this.allGems = false;
    this.oneChance = true;
    this.shouldRenderFunc = shouldRenderFunc;
};

//Get random x cordinates
CollectableObject.prototype.xCordinates = function(){
    var objectX = [25, 126, 227, 328, 429];
    var randomX = objectX[Math.floor(Math.random() * objectX.length)];
    return randomX;
};

//Get random y cordinates
CollectableObject.prototype.yCordinates = function(){
    var objectY = [];
    if(level.level === 1){
        objectY = [146, 222, 318];
    }else{
        objectY = [146, 222, 318, 394];
    }
    var randomY = objectY[Math.floor(Math.random() * objectY.length)];
    return randomY;
};

//Render the gem or heart
CollectableObject.prototype.render = function(){
    if(this.shouldRenderFunc()){
        if(Resources.get(this.image)){
            ctx.drawImage(Resources.get(this.image), this.x, this.y);
        }
    }
};

//Add a new life to player on collision with safeHeart
CollectableObject.prototype.newLife = function(){
        if(player.lives <= 1){
        player.lives++;
        heart.count = player.lives + ' x ';
        delete this;
        this.oneChance = false;
    }
};

//Update gem position ensuring gem does not appear in same space twice
CollectableObject.prototype.gemUpdate = function(){
    var oldGemX = this.x;
    var oldGemY = this.y;
    var match = true;
    while(match){
        this.x = this.xCordinates();
        this.y = this.yCordinates();
        if(this.x === oldGemX && this.y === oldGemY){
            continue;
        }else{
            match = false;
        }
    }
};

//Provides life score for game by creating a heart object
var Heart = function(x, y, image){
    this.x = x;
    this.y = y;
    this.heart = image;
    this.count = player.lives + ' x ';
};

//Draw the life count on screen
Heart.prototype.render = function(){
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    if(Resources.get(this.heart)){
        ctx.drawImage(Resources.get(this.heart), this.x + 45, this.y - 27);
    }
    ctx.fillText(this.count, this.x, this.y);
    ctx.strokeText(this.count, this.x, this.y);
};

//Update the life count on collision with enemy
Heart.prototype.update = function (){
    if(player.lives < 0){
        Alert.render('Sorry, you lose');
    }else{
       this.count = player.lives + ' x ';
    }
};

//Tracks the number of gems collected
var Score = function(x, y){
    this.x = x;
    this.y = y;
    this.gems = 0;
    this.display = 'Gems: ' + this.gems;
};

//Draw gems on screen
Score.prototype.render = function(){
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(this.display, this.x, this.y);
    ctx.strokeText(this.display, this.x, this.y);
};

//Updates the score on collision with gems
Score.prototype.update = function(){
    this.gems ++;
    this.display = 'Gems: ' + this.gems;
};

//Checks to see if player has enough gems to win level once in the water
Score.prototype.check = function(){
    if(level.level === 1){
        level.score(LEVEL_ONE_GEMS);
    }else if(level.level === 2){
        level.score(LEVEL_TWO_GEMS);
    }else{
        level.score(LEVEL_THREE_GEMS);
    }
};

//Creates Levels
var Level = function(x, y){
    this.x = x;
    this.y = y;
    this.level = 1;
    this.display = 'Level ' + this.level;
};

//Draw the level number on screen
Level.prototype.render = function(){
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(this.display, this.x, this.y);
    ctx.strokeText(this.display, this.x, this.y);
};

//Update the level when enough gems are collected
Level.prototype.update = function(){
    this.level++;
    this.display = 'Level ' + this.level;
    safeHeart.oneChance = true;
    this.render();
};

//Indicates if player has won the level or the game based on score/number of gems collected & if the player has reached the water
Level.prototype.score = function(points){
        if(score.gems === points && player.y + PLAYER_TOP_SPACE < SAFE){
            if(points === LEVEL_THREE_GEMS){
                Alert.render('Yay, you won the game!');
            }else{
                var self = this;
                setTimeout(function() {
                    Alert.render('Yay, you won this level!');
                    self.update();
                    score.gems = 0;
                    score.display = 'Gems: ' + score.gems;
                    player.reset();
                    self.enemies();
                    gem = new CollectableObject (GEM_HEIGHT,
                                                 GEM_WIDTH,
                                                 GEM_TOP_SPACE,
                                                 GEM_SIDE_SPACE,
                                                 'images/Gem Blue Small.png',
                                                 function() { 
                                                 return true; 
                                                 });;
                    gem.render();
                }, 500);
            }
        }else{
            setTimeout(player.reset.bind(player), 1000);
        }
};

//Adds an extra enemy to screen on level 2
Level.prototype.enemies = function(){
    if(this.level === 2){
        allEnemies.push(new Enemy(101, 301, ENEMY_HEIGHT, ENEMY_WIDTH, ENEMY_TOP_SPACE, ENEMY_SIDE_SPACE, 'images/enemy-bug.png'));
        allEnemies[2].render();
    }
};

//Custom alerts were created using code from https://www.developphp.com/video/JavaScript/Custom-Alert-Box-Programming-Tutorial, although it has been modified by me for use in this project
//Creates custom alert boxes
var CustomAlert = function (){
    this.winH = window.innerHeight;
    this.winW = window.innerWidth;
    this.dialogoverlay = document.getElementById('dialogoverlay');
    this.startBox = document.getElementById('startingBox');
    this.dialogbox = document.getElementById('dialogbox');
};

//Game instructions and start game button
CustomAlert.prototype.instructions = function (){
    this.dialogoverlay.style.height = this.winH + 'px';
    this.startBox.style.top = 60 + 'px';
    this.startBox.style.left = (this.winW / 2) - (450 * 0.5) + 'px';
    document.getElementById('instructions').innerHTML = instructions;
    document.getElementById('startGame').innerHTML = '<button onclick="start.start()">Start Game!</button>';
};

//Start Game button
CustomAlert.prototype.start = function(){
    this.dialogoverlay.style.display = 'none';
    this.startBox.style.display = 'none';
};
//Level, game win and lose alerts
CustomAlert.prototype.render = function(dialog){
    this.dialogoverlay.style.display = 'block';
    this.dialogoverlay.style.height = this.winH + 'px';
    this.dialogbox.style.display = 'block';
    this.dialogbox.style.top = 200 + 'px';
    this.dialogbox.style.left = (this.winW / 2) - (450 * 0.5) + 'px';
    document.getElementById('dialogboxbody').innerHTML = dialog;
    document.getElementById('dialogboxfoot').innerHTML = '<button onclick="Alert.ok()">OK</button>';
};

//OK button on alerts
CustomAlert.prototype.ok = function(){
    this.dialogbox.style.display = 'none';
    this.dialogoverlay.style.display = 'none';
    if(player.lives < 0 || score.gems === LEVEL_THREE_GEMS){
        reload();
    }
};

//Instatiate objects
var instructions = 'Collect all the gems and get to the water!<br>Level 1 - collect 5 gems'+
                   '<br>Level 2 - collect 10 gems'+
                   '<br>Level 3 - collect 15 gems'+
                   '<br>Complete all 3 levels to win game!'+
                   '<br><br>Water and grass are safe but entering the water without all the gems will reset your player.'+
                   '<br><br>Have fun and good luck!<br><br>Pssst...keep an eye out for the extra lives.';
var allEnemies = [];
var level = new Level(205, 100);
var gem = new CollectableObject(GEM_HEIGHT,
                                GEM_WIDTH,
                                GEM_TOP_SPACE,
                                GEM_SIDE_SPACE,
                                'images/Gem Blue Small.png',
                                function() { 
                                    return true; 
                                });
var player = new Player(TILE_WIDTH * 2,
                        TILE_HEIGHT * 5,
                        PLAYER_HEIGHT,
                        PLAYER_WIDTH,
                        PLAYER_TOP_SPACE,
                        PLAYER_SIDE_SPACE,
                        'images/char-boy.png');
var heart = new Heart(417, 100, 'images/Heart Small.png');
var score = new Score(10, 100);
var safeHeart = new CollectableObject(HEART_HEIGHT,
                                      HEART_WIDTH,
                                      HEART_TOP_SPACE,
                                      HEART_SIDE_SPACE,
                                      'images/Heart Small Safe.png',
                                      function() {
                                        return player.lives <=1 && this.oneChance === true;
                                      });
var start = new CustomAlert();
var Alert = new CustomAlert();

function initialEnemies(){
    allEnemies.push(new Enemy(1,
                              60,
                              ENEMY_HEIGHT,
                              ENEMY_WIDTH,
                              ENEMY_TOP_SPACE,
                              ENEMY_SIDE_SPACE,
                              'images/enemy-bug.png'));
    allEnemies.push(new Enemy(202,
                              140,
                              ENEMY_HEIGHT,
                              ENEMY_WIDTH,
                              ENEMY_TOP_SPACE,
                              ENEMY_SIDE_SPACE,
                              'images/enemy-bug.png'));

    for(var i = 0; i < allEnemies.length; i++){
        allEnemies[i].render();
    }
}

//render objects
start.instructions();
level.render();
gem.render();
initialEnemies();
player.render();
heart.render();
score.render();

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

