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
exports.eShips = new gamejs.sprite.Group();

exports.calcVelocity = function (msDuration, velocity){
  var newVelocity = [];
  var fps = 1000/msDuration;
	newVelocity[0] = velocity[0]*75/fps;
	newVelocity[1] = velocity[1]*75/fps;

  return newVelocity;
}


// True position = custom x,y
// center = [0.5, 0.5]
// dim = size of thing
exports.getPos = function (true_pos, center, dim, angle) {

  function get_xy(angle, l1, l2, l3, true_pos) {
    var sin = Math.sin(angle / 180 * Math.PI);
    var cos = Math.cos(angle / 180 * Math.PI);
    var x = true_pos[0] - l1*sin - l2*cos;
    var y = true_pos[1] - l1*cos - l3*sin;
    return [x, y];
  };

  if (angle > 360) {
    angle = angle%360;
  } while (angle < 0) {
    angle += 360;
  }
  var la = dim[1]*center[1];
  var lb = dim[0]*center[0];
  var lc = dim[1]*(1-center[1]);
  var ld = dim[0]*(1-center[0]);

  if (angle < 90) {
    return get_xy(angle, la, lb, ld, true_pos);
  } else if (angle < 180) {
    return get_xy(angle-90, ld, la, lc, true_pos);
  } else if (angle < 270) {
    return get_xy(angle-180, lc, ld, lb, true_pos);
  } else {
    return get_xy(angle-270, lb, lc, la, true_pos);
  }
};

exports.level = function() {

};

exports.time = 0;