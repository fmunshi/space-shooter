var gamejs = require("gamejs");
var $g = require("globals");
var $ship = require("ship").Ship;
var $map = require("map");

var $meteor = require("projectiles/meteor").Meteor;
var $meteorSmall = require("projectiles/meteorSmall").MeteorSmall;

//  ENEMIES
var $boss = require("AI/boss").Boss;
var $explorer = require("AI/explorer").Explorer;
var $ufo = require("AI/ufo").ufo;
var $raider = require("AI/raider").Raider;

exports.map = function(){
  
    $g.display = gamejs.display.setMode($g.game.screenSize);
    $g.ship =  new $ship([80, 80]);
    setTimeout(createEnemies, 1000);
    
};


exports.increaseLevel = function(){

  $g.time = 0;
  $g.projectiles = new gamejs.sprite.Group();
  $g.eShips = new gamejs.sprite.Group();
  $g.powerups = new gamejs.sprite.Group();

  $g.level.number += 1;

  if ($g.level.number%5 === 0) {
    if ($g.level.time < 60000) $g.level.time += 10000;
  }

  if ($g.level.number%3 === 0) {
    if ($g.level.maxMeteors < 3)  $g.level.maxMeteors += 1;
  }
  if ($g.level.number%7 === 0) $g.level.maxUFOs += 1;
  if ($g.level.number%2 === 0) $g.level.maxExplorers += 1;
  if ($g.level.number%5 === 0) $g.level.maxRaiders += 1;
  if ($g.level.number%5 === 0) $g.level.boss = true;
  else $g.level.boss = false;
  
  $g.ship.reload();
  createEnemies();
};


var createEnemies = function(){

  
  setTimeout(function(){
    for (var i = 0; i < 20; i++){
      var star = new $map.Star();
      $g.stars.shift();
      $g.stars.push(star);
    }
    for (var i = 0; i < $g.level.maxMeteors; i++){
        var sizeL = Math.random()*100 + 50;
        var sizeS = Math.random()*25 + 50;
        var meteor = new $meteor([sizeL,sizeL]);
        var meteorSmall = new $meteorSmall([sizeS,sizeS]);
        $g.projectiles.add(meteor);
        $g.projectiles.add(meteorSmall);
    }

    if ($g.level.boss){
      setTimeout(function(){
        var boss = new $boss([200,200]);
        $g.eShips.add(boss);
        $g.time = NaN;
      }, $g.level.time-10000);
    }

      for (var i = 0; i < $g.level.maxUFOs; i++){
        var ufo = new $ufo([25,25]);
        $g.eShips.add(ufo);
    }

      for (var i = 0; i < $g.level.maxRaiders; i++){
        var raider = new $raider([60,60]);
        $g.eShips.add(raider);
    }

      for (var i = 0; i < $g.level.maxExplorers; i++){
        var explorer = new $explorer([70,70]);
        $g.eShips.add(explorer);
    }
  }, 1000);

};