var gamejs = require("gamejs");
var $e = require("gamejs/event");
var $t = require("gamejs/time");
var $g = require("globals");
var $ship = require("ship").Ship;

var $map = require("map");
var $meteor = require("projectiles/meteor").Meteor;

gamejs.preload(["./images/Player/ship.png"]);
gamejs.preload(["./images/Player/rightShip.png"]);
gamejs.preload(["./images/Player/leftShip.png"]);


gamejs.preload(["./images/Player/rocket.png"]);
gamejs.preload(["./images/Player/laser.png"]);

gamejs.preload(["./images/Map/star.png"]);
gamejs.preload(["./images/Map/meteor.png"]);
gamejs.preload(["./images/StarsField.png"]);

//ENEMIES


gamejs.preload(["./images/Enemies/laser.png"]);

// ENEMIES
var $boss = require("AI/boss").Boss;
var $explorer = require("AI/explorer").Explorer;
var $ufo = require("AI/ufo").ufo;
var $raider = require("AI/raider").Raider;

gamejs.preload(["./images/Enemies/boss.png"]);
gamejs.preload(["./images/Enemies/ufo.png"]);
gamejs.preload(["./images/Enemies/explorer.png"]);
gamejs.preload(["./images/Enemies/heavyExplorer.png"]);
gamejs.preload(["./images/Enemies/darkExplorer.png"]);
gamejs.preload(["./images/Enemies/heavyRaider.png"]);
gamejs.preload(["./images/Enemies/raider.png"]);

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
            var boss = new $boss([50,50]);
            $g.eShips.add(boss);

            var ufo = new $ufo([20,20]);
            $g.eShips.add(ufo);

            var raider = new $raider([60,60]);
            $g.eShips.add(raider);

            var explorer = new $explorer([80,80]);
            $g.eShips.add(explorer);
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