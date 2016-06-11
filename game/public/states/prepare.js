var Prepare = function(game) {};

Prepare.prototype = {

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
    var lifeGiven = gameOptions.isLifeGiven,
        toolsShared = gameOptions.isToolsShared;

    game.add.sprite(0, 0, 'options-bg');
    game.add.existing(this.titleText);
    this.addMenuOption(lifeGiven ? '共享生命：是' : '共享生命：否', function (target) {
      lifeGiven = !lifeGiven;
      target.text = lifeGiven ? '共享生命：是' : '共享生命：否';
      // musicPlayer.volume = lifeGiven ? 1 : 0;
    });
    this.addMenuOption(toolsShared ? '共享道具：是' : '共享道具：否', function (target) {
      toolsShared = !toolsShared;
      target.text = toolsShared ? '共享道具：是' : '共享道具：否';
    });
    this.addMenuOption('返回', function () {
      game.state.start("GameMenu");
    });
  }
};

Phaser.Utils.mixinPrototype(Prepare.prototype, mixins);
