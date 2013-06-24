var gamejs = require("gamejs");
var $e = require("gamejs/event")
var $g = require("globals");
var $ship = require("ship").Ship;
var $eShip = require("AI/enemyShip").eShip;
var $map = require("map");
var $comet = require("projectiles/comet").Comet;

gamejs.preload(["./images/ship.png"]);
gamejs.preload(["./images/rocket.png"]);
gamejs.preload(["./images/laser.png"]);

gamejs.preload(["./images/star.png"]);
gamejs.preload(["./images/comet.png"]);

gamejs.preload(["./images/eLaser.png"]);
gamejs.preload(["./images/eShip.png"]);

gamejs.ready(function() {


    var display = gamejs.display.setMode($g.game.screenSize);
    var ship = $g.ship = new $ship([80, 80]);
    setTimeout(function() {
        for (var i = 0; i < 10; i++){
            var star = new $map.Star();
            $g.stars.push(star);
        }
    }, 500);
    setTimeout(function() {
    for (var i = 0; i < 5; i++){
            var size = Math.random()*20 + 10;
            var comet = new $comet([size,size]);
            $g.projectiles.add(comet);
    }
    }, 1000);
    setTimeout(function() {
        for (var i = 0; i < 5; i++){
            var eShip = new $eShip([80,80]);
            $g.eShips.add(eShip);
        }
    }, 1000);


    gamejs.onEvent(function(event) {
        ship.handle(event);
    });

    gamejs.onTick(function(msDuration) {
        display.fill("#1F1010");
        ship.update(msDuration);
        ship.draw(display);

        $g.projectiles.update(msDuration);
        $g.projectiles.draw(display);
        $g.eShips.update(msDuration);
        $g.eShips.draw(display);

        $map.drawStars(display, msDuration);
        $map.drawHealth(display);
   });
});