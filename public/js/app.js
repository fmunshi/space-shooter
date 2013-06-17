var gamejs = require("gamejs");
var $e = require("gamejs/event")
var $g = require("globals");
var $ship = require("ship").Ship;
var $map = require("map");

gamejs.preload(["./images/ship.png"]);
gamejs.preload(["./images/rocket.png"]);
gamejs.preload(["./images/laser.png"]);
gamejs.preload(["./images/background.jpg"]);
gamejs.preload(["./images/star.png"]);

gamejs.ready(function() {

    var display = gamejs.display.setMode($g.game.screenSize);
    var ship = new $ship([80, 80]);
    setTimeout(function(){
        for (var i = 0; i < 20; i++){
            var star = new $map.Star();
            $g.stars.push(star);        
        }
    }, 100);


    gamejs.onEvent(function(event) {
        ship.handle(event);
    });

    gamejs.onTick(function(msDuration) {
        display.fill("#1F1010");
        ship.update(msDuration);
        ship.draw(display);
        $map.drawStars(display);
   });
});