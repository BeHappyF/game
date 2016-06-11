/* global game */
// 同伴同样是具有整个的游戏空间的，包括player和场景之类
var Partner = function (index, game, player, startX, startY) {
  var x = startX
  var y = startY

  this.game = game;
  // this.health = 3;
  this.player = player;
  // this.player.x = 120;
  // this.player.y = 200;
  this.player = game.add.sprite(x, y, 'player');

  this.lastPosition = { x: x, y: y };
}

Partner.prototype.update = function () {
  // if (this.player.x !== this.lastPosition.x || this.player.y !== this.lastPosition.y) {
  //   this.player.play('move')
  //   this.player.rotation = Math.PI + game.physics.arcade.angleToXY(this.player, this.lastPosition.x, this.lastPosition.y)
  // } else {
  //   this.player.play('stop')
  // }

  this.lastPosition.x = this.player.x;
  this.lastPosition.y = this.player.y;

}

// window.Partner = Partner
