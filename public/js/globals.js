var gamejs = require('gamejs');
var $ship = require('ship').Ship;

exports.game = {
    screenSize: [window.innerWidth, window.innerHeight],
    xMax: window.innerWidth,
    yMax: window.innerHeight
};

exports.stars = [];

exports.ship;

exports.projectiles = new gamejs.sprite.Group();