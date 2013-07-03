var gamejs = require("gamejs");
var $g = require("globals");

var Powerup = exports.Powerup = function (text){
  this.time = 0;
  this.color = '999999';
  
  this.size = 12;
  this.font = new gamejs.font.Font(this.size+"px Aller");
  this.text = this.font.render(text, '#FFFFFF');
  this.surface = new gamejs.Surface([185, 16]);
  return this;
};

Powerup.prototype.render = function(display, msDuration){
  // this.surface.fill("#20102F");
  // this.surface.blit(this.text, [0, 0]);
  // gamejs.draw.rect(this.surface, '#000000', new gamejs.Rect([85, 2], [100, 12]));
  // gamejs.draw.rect(this.surface, '#FFFFFF', new gamejs.Rect([87, 4], [96 / 5, 8]));

  // this.surface.setAlpha(0.5);

  // display.blit(this.surface);

  // this.time += msDuration;
  // if (this.time > 10000) $g.powerup = false;

  // display.blit(this.font.render(this.text, '#'+this.color), [$g.game.screenSize[0]/2-100, 100]);
  // this.color = (parseInt(this.color) - 10101);
  // this.color = String(this.color);
  // this.size += 1;
  // this.font = new gamejs.font.Font(this.size+"px Aller");
};