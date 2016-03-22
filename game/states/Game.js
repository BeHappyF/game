var Game = function() {};

var Bullet = function (game, key) {

  Phaser.Sprite.call(this, game, 0, 0, key);

  this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

  this.anchor.set(0.5);
  // 是否开启边界检测
  this.checkWorldBounds = true;
  // 离开边界自动kill
  this.outOfBoundsKill = true;
  this.exists = false;
  // 跟踪
  this.tracking = false;
  this.scaleSpeed = 0;

  // game.physics.arcade.enable(this);
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.fire = function (x, y, angle, speed, gx, gy) {

    gx = gx || 0;
    gy = gy || 0;

    this.reset(x, y);
    this.scale.set(1);

    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

    this.angle = angle;

    this.body.gravity.set(gx, gy);

};

Bullet.prototype.update = function () {

    if (this.tracking){
        this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
    }

    if (this.scaleSpeed > 0){
        this.scale.x += this.scaleSpeed;
        this.scale.y += this.scaleSpeed;
    }

};

// Game.Bullet = Bullet;

Game.prototype = {

  init: function () {
    // 前景，背景
    this.background = null;
    this.foreground = null;
    // 玩家，键盘控制，飞机速度
    this.player = null;
    this.cursors = null;
    this.speed = 300;
    // 武器，当前武器，武器名称
    this.weapons = [];
    this.currentWeapon = 0;
    this.weaponName = null;
    // 启动像素画风
    this.game.renderer.renderSession.roundPixels = true;
    // 开启物理系统
    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.optionCount = 1;
    // 敌机
    this.enemies = [];

    // 子弹
    this.bullets = [];

    // 敌机刷新速率
    // 设置初值是为了第一次的判定不刷新飞机
    // 而为什么是两倍的间隔时间，这个是因为game.time.now()的初始值，莫名的就是2000多了
    // 不太清楚为什么
    this.refreshTime = 6000;
  },

  preload: function () {
    this.load.image('background', 'assets/assets/back.png');
    this.load.image('foreground', 'assets/assets/fore.png');
    this.load.image('player', 'assets/assets/ship.png');
    // 加载文字，显示说明
    this.load.bitmapFont('shmupfont', 'assets/assets/shmupfont.png', 'assets/assets/shmupfont.xml');
    // 加载不同种类武器
    for (var i = 1; i <= 11; i++){
        this.load.image('bullet' + i, 'assets/assets/bullet' + i + '.png');
    }

    // 加载敌机
    this.load.image('enemy', 'assets/plane/yellow.png');
  },

  enemy: function () {
    // 接下来就是不断设置不同的敌机的出现方式和不同的机型

    // 方式1
    for(var i=0; i<5; i++){
        // 敌机初始设置
        var enemy = this.add.sprite(game.width, 20 + i * 120, 'enemy');
        // 锚点设置于中心位置
        enemy.anchor.set(0.5);
        // 等比缩小
        enemy.scale.setTo(0.5);
        this.physics.arcade.enable(enemy);

        // 对于sprite的图形旋转
        enemy.rotation = 1.5*Math.PI;
        // 水平方向的速度
        enemy.body.velocity.x = -200;
        this.enemies.push(enemy);
    }

    // 方式。。。。


    // // 因为敌机都是相类似的，所以设置一个组，统一管理
    // var enemies = game.add.group();
    // // 首先需要将贴图看做的物体，才能够移动等。。。
    // enemies.enableBody = true;
    // // 使用ARCADE的物理引擎
    // enemies.physicsBodyType = Phaser.Physics.ARCADE;
    // // Enemies组里添加20个敌机的贴图到舞台上，但是他们是不可见也不能和其他物体作用，只是为了之后的使用
    // // 屏幕中最多只能够有20个敌机同时存在，当超出边界，便会被清除以待重新设置使用
    // enemies.createMultiple(20, 'enemy');

    // lasers.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetEnemy);
    // // 将敌机的锚点位置放在中心末尾处
    // enemies.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
    // // 将所有的Enemies内的物体设置边界检测
    // enemies.setAll('checkWorldBounds', true);
  },

  create: function () {

      this.stage.disableVisibilityChange = false;
      // game.add.sprite(0, 0, 'stars');
      this.background = game.add.tileSprite(0, 0, game.width, game.height, 'stars');
      this.background.autoScroll(-40, 0);

      this.weapons.push(new Weapon.SingleBullet(game));
      this.weapons.push(new Weapon.FrontAndBack(game));
      this.weapons.push(new Weapon.ThreeWay(game));
      this.weapons.push(new Weapon.EightWay(game));
      this.weapons.push(new Weapon.ScatterShot(game));
      this.weapons.push(new Weapon.Beam(game));
      this.weapons.push(new Weapon.SplitShot(game));
      this.weapons.push(new Weapon.Pattern(game));
      this.weapons.push(new Weapon.Rockets(game));
      this.weapons.push(new Weapon.ScaleBullet(game));
      this.weapons.push(new Weapon.Combo1(game));
      this.weapons.push(new Weapon.Combo2(game));

      this.currentWeapon = 0;
      // 设置初始化的子弹种类
      this.bullets = this.weapons[this.currentWeapon].children;

      for (var i = 1; i < this.weapons.length; i++)
      {
          this.weapons[i].visible = false;
      }
      // 飞机的初始设置
      this.player = this.add.sprite(64, 200, 'player');
      this.physics.arcade.enable(this.player);
      this.player.body.collideWorldBounds = true;

      // 敌机
      this.enemy();

      // 添加前景图片
      // this.foreground = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'foreground');
      // 前景图片的自动回卷，x轴负方向
      // this.foreground.autoScroll(-60, 0);

      this.weaponName = this.add.bitmapText(8, 500, 'shmupfont', "ENTER = Next Weapon", 24);

      //  Cursor keys to fly + space to fire
      this.cursors = this.input.keyboard.createCursorKeys();

      this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

      var changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
      changeKey.onDown.add(this.nextWeapon, this);

  },

  nextWeapon: function () {

    // 将bullets数组清空，换成别的类型的子弹
    this.bullets = [];

    //  Tidy-up the current weapon
    if (this.currentWeapon > 9){
        this.weapons[this.currentWeapon].reset();
    } else {
        this.weapons[this.currentWeapon].visible = false;
        this.weapons[this.currentWeapon].callAll('reset', null, 0, 0);
        this.weapons[this.currentWeapon].setAll('exists', false);
    }

    //  Activate the new one
    this.currentWeapon++;

    if (this.currentWeapon === this.weapons.length){
        this.currentWeapon = 0;
        this.bullets = this.weapons[0].children;
    }

    this.weapons[this.currentWeapon].visible = true;
    // 切换子弹类型
    this.bullets = this.weapons[this.currentWeapon].children;

    this.weaponName.text = this.weapons[this.currentWeapon].name;

  },

  destroy: function (bullet, enemy) {
    bullet.kill();
    enemy.kill();
  },

  gameOver: function () {
    game.state.start('GameOver');
  },

  update: function () {
    // 检测子弹和敌机碰撞
    for(var i=0; i<this.bullets.length; i++) {
        for(var j=0; j<this.enemies.length; j++) {
            // 此函数会返回一个boolean值，如果为true，则表示有碰撞检测到了
            var overlaped = this.physics.arcade.overlap(this.bullets[i], this.enemies[j], this.destroy, null, this);
            if(overlaped) {
                // 还真的是子弹的问题，如果添加上下列的语句，会出现子弹无法射击到敌机的bug
                // 原因是子弹一开始就是拥有128个元素的数组。而不是根据屏幕上的子弹的个数，动态的更新数量的
                // this.bullets.splice(i,1);
                this.enemies.splice(j,1);
            }
        }
    }
    // 玩家和敌机相撞
    for(var i=0; i<this.enemies.length; i++) {
        this.physics.arcade.overlap(this.player, this.enemies[i], this.gameOver, null, this);
    }

    this.enemies.forEach(function (enemy, i) {
        // 飞机移动到屏幕左侧消失
        if(enemy.body.x <= 0) {
            enemy.kill();
            this.enemies.splice(i, 1);
        }
    }, this);
    // 这个控制敌机的刷新时间
    // 现在的判断条件不行：即没有了敌机就刷新的方式不好。
    // 更好的方式应该是：随机时间（1s以内）+固定时间。
    // if(this.enemies.length === 0) {
    //     this.enemy();
    // }
    // game.time.now和game.time.time在update中的递增规律不是加1ms
    // 而是16.6666ms，这个和update()刷新的频率有关，
    // game.time.now不可以被赋值
    // console.log(game.time.now);
    if(game.time.now > this.refreshTime) {
        this.refreshTime = 3000 + game.time.now + Math.random() * 1000;
        this.enemy();
    }

    this.player.body.velocity.set(0);

    if (this.cursors.left.isDown){
        this.player.body.velocity.x = -this.speed;
    } else if (this.cursors.right.isDown){
        this.player.body.velocity.x = this.speed;
    }

    if (this.cursors.up.isDown){
        this.player.body.velocity.y = -this.speed;
    } else if (this.cursors.down.isDown){
        this.player.body.velocity.y = this.speed;
    }

    if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        this.weapons[this.currentWeapon].fire(this.player);
    }
  }
};



var Weapon = {};

////////////////////////////////////////////////////
//  A single bullet is fired in front of the ship //
////////////////////////////////////////////////////

Weapon.SingleBullet = function (game) {

    Phaser.Group.call(this, game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 100;

    for (var i = 0; i < 64; i++){
        var bullet = this.add(new Bullet(game, 'bullet5'), true);
    }

    return this;
};

Weapon.SingleBullet.prototype = Object.create(Phaser.Group.prototype);
Weapon.SingleBullet.prototype.constructor = Weapon.SingleBullet;

Weapon.SingleBullet.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

/////////////////////////////////////////////////////////
//  A bullet is shot both in front and behind the ship //
/////////////////////////////////////////////////////////

Weapon.FrontAndBack = function (game) {

    Phaser.Group.call(this, game, game.world, 'Front And Back', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 100;

    for (var i = 0; i < 64; i++) {
        this.add(new Bullet(game, 'bullet5'), true);
    }

    return this;

};

Weapon.FrontAndBack.prototype = Object.create(Phaser.Group.prototype);
Weapon.FrontAndBack.prototype.constructor = Weapon.FrontAndBack;

Weapon.FrontAndBack.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

//////////////////////////////////////////////////////
//  3-way Fire (directly above, below and in front) //
//////////////////////////////////////////////////////

Weapon.ThreeWay = function (game) {

    Phaser.Group.call(this, game, game.world, 'Three Way', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 100;

    for (var i = 0; i < 96; i++){
        this.add(new Bullet(game, 'bullet7'), true);
    }

    return this;

};

Weapon.ThreeWay.prototype = Object.create(Phaser.Group.prototype);
Weapon.ThreeWay.prototype.constructor = Weapon.ThreeWay;

Weapon.ThreeWay.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 270, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

/////////////////////////////////////////////
//  8-way fire, from all sides of the ship //
/////////////////////////////////////////////

Weapon.EightWay = function (game) {

    Phaser.Group.call(this, game, game.world, 'Eight Way', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 100;

    for (var i = 0; i < 96; i++){
        this.add(new Bullet(game, 'bullet5'), true);
    }

    return this;

};

Weapon.EightWay.prototype = Object.create(Phaser.Group.prototype);
Weapon.EightWay.prototype.constructor = Weapon.EightWay;

Weapon.EightWay.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 16;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 45, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 135, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 225, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 270, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 315, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

////////////////////////////////////////////////////
//  Bullets are fired out scattered on the y axis //
////////////////////////////////////////////////////

Weapon.ScatterShot = function (game) {

    Phaser.Group.call(this, game, game.world, 'Scatter Shot', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 40;

    for (var i = 0; i < 32; i++){
        this.add(new Bullet(game, 'bullet5'), true);
    }

    return this;

};

Weapon.ScatterShot.prototype = Object.create(Phaser.Group.prototype);
Weapon.ScatterShot.prototype.constructor = Weapon.ScatterShot;

Weapon.ScatterShot.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 16;
    var y = (source.y + source.height / 2) + this.game.rnd.between(-10, 10);

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

//////////////////////////////////////////////////////////////////////////
//  Fires a streaming beam of lazers, very fast, in front of the player //
//////////////////////////////////////////////////////////////////////////

Weapon.Beam = function (game) {

    Phaser.Group.call(this, game, game.world, 'Beam', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 1000;
    this.fireRate = 45;

    for (var i = 0; i < 64; i++){
        this.add(new Bullet(game, 'bullet11'), true);
    }

    return this;

};

Weapon.Beam.prototype = Object.create(Phaser.Group.prototype);
Weapon.Beam.prototype.constructor = Weapon.Beam;

Weapon.Beam.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 40;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

///////////////////////////////////////////////////////////////////////
//  A three-way fire where the top and bottom bullets bend on a path //
///////////////////////////////////////////////////////////////////////

Weapon.SplitShot = function (game) {

    Phaser.Group.call(this, game, game.world, 'Split Shot', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 700;
    this.fireRate = 40;

    // 开始设置的64个，但是在运行发生了报错
    // 我估计是在同屏幕显示时，超出了64个的上限而导致的
    // 然后调整为96个，果然没有报错了
    for (var i = 0; i < 96; i++){
        this.add(new Bullet(game, 'bullet8'), true);
    }

    return this;

};

Weapon.SplitShot.prototype = Object.create(Phaser.Group.prototype);
Weapon.SplitShot.prototype.constructor = Weapon.SplitShot;

Weapon.SplitShot.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 20;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, -500);
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 500);

    this.nextFire = this.game.time.time + this.fireRate;

};

///////////////////////////////////////////////////////////////////////
//  Bullets have Gravity.y set on a repeating pre-calculated pattern //
///////////////////////////////////////////////////////////////////////

Weapon.Pattern = function (game) {

    Phaser.Group.call(this, game, game.world, 'Pattern', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 40;

    this.pattern = Phaser.ArrayUtils.numberArrayStep(-800, 800, 200);
    this.pattern = this.pattern.concat(Phaser.ArrayUtils.numberArrayStep(800, -800, -200));

    this.patternIndex = 0;

    for (var i = 0; i < 64; i++){
        this.add(new Bullet(game, 'bullet4'), true);
    }

    return this;

};

Weapon.Pattern.prototype = Object.create(Phaser.Group.prototype);
Weapon.Pattern.prototype.constructor = Weapon.Pattern;

Weapon.Pattern.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 20;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, this.pattern[this.patternIndex]);

    this.patternIndex++;

    if (this.patternIndex === this.pattern.length){
        this.patternIndex = 0;
    }

    this.nextFire = this.game.time.time + this.fireRate;

};

///////////////////////////////////////////////////////////////////
//  Rockets that visually track the direction they're heading in //
///////////////////////////////////////////////////////////////////

Weapon.Rockets = function (game) {

    Phaser.Group.call(this, game, game.world, 'Rockets', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 400;
    this.fireRate = 250;

    for (var i = 0; i < 32; i++){
        this.add(new Bullet(game, 'bullet10'), true);
    }

    this.setAll('tracking', true);

    return this;

};

Weapon.Rockets.prototype = Object.create(Phaser.Group.prototype);
Weapon.Rockets.prototype.constructor = Weapon.Rockets;

Weapon.Rockets.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, -700);
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 700);

    this.nextFire = this.game.time.time + this.fireRate;

};

////////////////////////////////////////////////////////////////////////
//  A single bullet that scales in size as it moves across the screen //
////////////////////////////////////////////////////////////////////////

Weapon.ScaleBullet = function (game) {

    Phaser.Group.call(this, game, game.world, 'Scale Bullet', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 800;
    this.fireRate = 100;

    for (var i = 0; i < 32; i++){
        this.add(new Bullet(game, 'bullet9'), true);
    }
    // 设置放大的速率
    this.setAll('scaleSpeed', 0.05);

    return this;

};

Weapon.ScaleBullet.prototype = Object.create(Phaser.Group.prototype);
Weapon.ScaleBullet.prototype.constructor = Weapon.ScaleBullet;

Weapon.ScaleBullet.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

/////////////////////////////////////////////
//  A Weapon Combo - Single Shot + Rockets //
/////////////////////////////////////////////

Weapon.Combo1 = function (game) {

    this.name = "Combo One";
    this.weapon1 = new Weapon.SingleBullet(game);
    this.weapon2 = new Weapon.Rockets(game);

};

Weapon.Combo1.prototype.reset = function () {

    this.weapon1.visible = false;
    this.weapon1.callAll('reset', null, 0, 0);
    this.weapon1.setAll('exists', false);

    this.weapon2.visible = false;
    this.weapon2.callAll('reset', null, 0, 0);
    this.weapon2.setAll('exists', false);

};

Weapon.Combo1.prototype.fire = function (source) {

    this.weapon1.fire(source);
    this.weapon2.fire(source);

};

/////////////////////////////////////////////////////
//  A Weapon Combo - ThreeWay, Pattern and Rockets //
/////////////////////////////////////////////////////

Weapon.Combo2 = function (game) {

    this.name = "Combo Two";
    this.weapon1 = new Weapon.Pattern(game);
    this.weapon2 = new Weapon.ThreeWay(game);
    this.weapon3 = new Weapon.Rockets(game);

};

Weapon.Combo2.prototype.reset = function () {

    this.weapon1.visible = false;
    this.weapon1.callAll('reset', null, 0, 0);
    this.weapon1.setAll('exists', false);

    this.weapon2.visible = false;
    this.weapon2.callAll('reset', null, 0, 0);
    this.weapon2.setAll('exists', false);

    this.weapon3.visible = false;
    this.weapon3.callAll('reset', null, 0, 0);
    this.weapon3.setAll('exists', false);

};

Weapon.Combo2.prototype.fire = function (source) {

    this.weapon1.fire(source);
    this.weapon2.fire(source);
    this.weapon3.fire(source);

};

Game.Weapon  = Weapon;
