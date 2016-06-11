var Options = function(game) {};

Options.prototype = {

  menuConfig: {
    className: "inverse",
    startY: 260,
    startX: "center"
  },


  init: function () {
    // 这里定义的都是局部变量，是一个状态（state）下的，this指代的是state，而不是game
    this.titleText = game.make.text(game.world.centerX, 100, "好机友", {
      font: 'bold 80px SimHei',
      fill: '#FDFFB5',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;
  },
  create: function () {
    var playSound = gameOptions.playSound,
        playMusic = gameOptions.playMusic;

    game.add.sprite(0, 0, 'options-bg');
    game.add.existing(this.titleText);
    this.addMenuOption(playMusic ? '音乐：开启' : '音乐：禁止', function (target) {
      playMusic = !playMusic;
      target.text = playMusic ? '音乐：开启' : '音乐：禁止';
      musicPlayer.volume = playMusic ? 1 : 0;
    });
    this.addMenuOption(playSound ? '音量：启用' : '音量：静音', function (target) {
      playSound = !playSound;
      target.text = playSound ? '音量：启用' : '音量：静音';
    });
    this.addMenuOption('返回', function () {
      game.state.start("GameMenu");
    });
  }
};

Phaser.Utils.mixinPrototype(Options.prototype, mixins);
