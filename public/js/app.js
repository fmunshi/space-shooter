//  GAMEJS
var gamejs = require("gamejs");
var $g = require("globals");
var $map = require("map");
var $setup = require("setup");
var $http = require("gamejs/http");


gamejs.preload($g.images);

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