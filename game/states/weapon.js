var Weapon = {};

Weapon.SingleBullet = function (game) {
	this.newWeapon(game, "Single Bullet", 600, 100, 'bullet5', source, 10, 10);
}
// 创建新武器
Weapon.prototype.newWeapon = function(game, weaponName, bulletSpeed, fireRate, bulletSprite, source, xRate, yRate) {
	Phaser.Group.call(this, game, game.world, weaponName, false, true, Phaser.Physics.ARCADE);

	this.nextFire = 0;
	this.bulletSpeed = bulletSpeed;
	this.fireRate = fireRate;

	for(var i=0; i<64; i++) {
		this.add(new Bullet(game, bulletSprite), true);
	}

	this.prototype = Object.create(Phaser.Group.prototype);
	this.prototype.constructor = this;

	this.prototype.fire = function (source) {
		if(game.time.time < this.nextFire) {return;}

		var x = source.x + xRate;
		var y = source.y + yRate;

		for(var i=0; i<ways; i++) {
			this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
		}

		this.nextFire = game.time.time + this.fireRate;
	};

	return this;
}