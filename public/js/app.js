//  GAMEJS
var gamejs = require("gamejs");
var $g = require("globals");
var $map = require("map");
var $setup = require("setup");
var $http = require("gamejs/http");


// Preload all images
$setup.images();

gamejs.preload(["./images/Player/ship.png"]);
gamejs.preload(["./images/Player/rightShip.png"]);
gamejs.preload(["./images/Player/leftShip.png"]);


gamejs.preload(["./images/Player/rocket.png"]);
gamejs.preload(["./images/Player/laser.png"]);

gamejs.preload(["./images/Map/star.png"]);
gamejs.preload(["./images/Map/meteor.png"]);
gamejs.preload(["./images/Map/meteorSmall.png"]);
gamejs.preload(["./images/Map/boom.png"]);

//ENEMIES

gamejs.preload(["./images/Enemies/laser.png"]);

gamejs.preload(["./images/Enemies/boss.png"]);
gamejs.preload(["./images/Enemies/ufo.png"]);
gamejs.preload(["./images/Enemies/explorer.png"]);
gamejs.preload(["./images/Enemies/heavyExplorer.png"]);
gamejs.preload(["./images/Enemies/darkExplorer.png"]);
gamejs.preload(["./images/Enemies/heavyRaider.png"]);
gamejs.preload(["./images/Enemies/raider.png"]);

gamejs.preload(["./images/Powerups/damage.png"]);
gamejs.preload(["./images/Powerups/health.png"]);
gamejs.preload(["./images/Powerups/invincible.png"]);
gamejs.preload(["./images/Powerups/kill.png"]);
gamejs.preload(["./images/Powerups/spray.png"]);

gamejs.ready(function() {

    $setup.map();
    
    var display = $g.display;
    var ship = $g.ship;

    gamejs.onEvent(function(event) {
        if (!($g.game.isPaused|| $g.game.isEnded)){
            ship.handle(event);
            $g.eShips.forEach(function(eShip){
                eShip.handle(event);
            });            
        }

        // IF event is a key down 
        if (event.type === 1){
            // 80 === "p" for pause
            if (event.key === 80) $g.game.isPaused = true;
            if (event.key !== 80) $g.game.isPaused = false;            
        }

    });

    gamejs.onTick(function(msDuration) {

    
        if (!($g.game.isPaused|| $g.game.isEnded)){

            $g.time += msDuration;
            $g.totalTime += msDuration;
            if ($g.time > $g.level.time) $setup.increaseLevel();

            display.fill("#20102F");

            if ($g.powerup) $g.powerup.render(display, msDuration);
            
            ship.update(msDuration);
            ship.draw(display);

            $g.projectiles.update(msDuration);
            $g.projectiles.draw(display);

            $g.eShips.update(msDuration);
            $g.eShips.draw(display);

            $g.powerups.update(msDuration);
            $g.powerups.draw(display);

            $map.drawStars(display, msDuration);
            $map.drawHealth(display);
        }

        else if ($g.game.isEnded){
            display.fill("#20102F");
            $map.drawScore(display);
        }


   });

});