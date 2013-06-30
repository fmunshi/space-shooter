var gamejs = require("gamejs");
var $e = require("gamejs/event");
var $t = require("gamejs/time");
var $g = require("globals");
var $ship = require("ship").Ship;
var $eShip = require("AI/enemyShip").eShip;
var $map = require("map");
var $meteor = require("projectiles/meteor").Meteor;

gamejs.preload(["./images/ship.png"]);
gamejs.preload(["./images/rightShip.png"]);
gamejs.preload(["./images/leftShip.png"]);

gamejs.preload(["./images/rocket.png"]);
gamejs.preload(["./images/laser.png"]);

gamejs.preload(["./images/star.png"]);
gamejs.preload(["./images/meteor.png"]);
gamejs.preload(["./images/StarsField.png"]);

gamejs.preload(["./images/eLaser.png"]);
gamejs.preload(["./images/eShip.png"]);

gamejs.ready(function() {

    var display = gamejs.display.setMode($g.game.screenSize);
    $g.display = display;
    
    var ship = $g.ship = new $ship([80, 80]);

    setTimeout(function() {
        for (var i = 0; i < 10; i++){
            var star = new $map.Star();
            $g.stars.push(star);
        }
        ship.calculateAngle([0,0]);
    }, 500);

    setTimeout(function() {
        for (var i = 0; i < 5; i++){
                var size = Math.random()*50 + 20;
                var meteor = new $meteor([size,size]);
                $g.projectiles.add(meteor);
        }
    }, 1000);
    
    setTimeout(function() {
        for (var i = 0; i < 3; i++){
            var eShip = new $eShip([80,80]);
            $g.eShips.add(eShip);
        }
    }, 1000);
    
    var bg = false;
    setTimeout(function(){
            bg = new gamejs.Surface($g.game.screenSize);
            bg.fill("#F00000");
            bg.setAlpha(0.9);
    }, 10000);


    gamejs.onEvent(function(event) {
        ship.handle(event);
        $g.eShips.forEach(function(eShip){
            eShip.handle(event);
        });
    });

    gamejs.onTick(function(msDuration) {


        display.fill("#20102F");

        if (bg) display.blit(bg, [0,0]);

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