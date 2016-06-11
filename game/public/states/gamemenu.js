var GameMenu = function() {};


GameMenu.prototype = {

  menuConfig: {
    startY: 300,
    startX: "center"
  },

  init: function () {
    this.titleText = game.make.text(game.world.centerX, 100, "好机友", {
      font: 'bold 80px SimHei',
      fill: '#FDFFB5',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 10);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;
  },

  create: function () {

    if (musicPlayer.name !== "dangerous" && gameOptions.playMusic) {
      musicPlayer.stop();
      musicPlayer = game.add.audio('dangerous');
      musicPlayer.loop = true;
      musicPlayer.play();
    }
    game.stage.disableVisibilityChange = true;
    game.add.sprite(0, 0, 'menu-bg');
    game.add.existing(this.titleText);

    this.addMenuOption('开始游戏', function () {
      game.state.start("Game");
    });
    this.addMenuOption('游戏准备', function () {
      game.state.start('Prepare');
    });
    this.addMenuOption('选项', function () {
      game.state.start("Options");
    });
    this.addMenuOption('人员', function () {
      game.state.start("Credits");
    });
  }
};

Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);
