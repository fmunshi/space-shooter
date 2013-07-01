//  GAMEJS
var gamejs = require("gamejs");
var $g = require("globals");
var $map = require("map");
var $setup = require("setup");
var $http = require("gamejs/http");


// Preload all images
$setup.images();

gamejs.ready(function() {

    $setup.map();
    
    var display = $g.display;
    var ship = $g.ship;

    gamejs.onEvent(function(event) {
        if (!$g.game.isPaused){
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

    
        if (!$g.game.isPaused){

            $g.time += msDuration;
            if ($g.time > $g.level.time) $setup.increaseLevel();

            display.fill("#20102F");

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

        else console.warn("Paused");


   });

});