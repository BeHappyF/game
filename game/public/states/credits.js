// 这是一个状态state，是所有不同游戏切换界面中的一个。是Phaser.Game.state.states下的一个对象属性
var Credits = function(game) {};

Credits.prototype = {

  preload: function () {
    this.optionCount = 1;
    this.creditCount = 0;

  },

  addCredit: function(task, author) {
    var authorStyle = { font: '40px Microsoft YaHei', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var taskStyle = { font: '30px Microsoft YaHei', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var authorText = game.add.text(game.world.centerX, 900, author, authorStyle);
    var taskText = game.add.text(game.world.centerX, 950, task, taskStyle);
    authorText.anchor.setTo(0.5);
    authorText.stroke = "rgba(0,0,0,0)";
    authorText.strokeThickness = 4;
    taskText.anchor.setTo(0.5);
    taskText.stroke = "rgba(0,0,0,0)";
    taskText.strokeThickness = 4;
    game.add.tween(authorText).to( { y: -300 }, 10000, Phaser.Easing.Cubic.Out, true, this.creditCount * 4000);
    game.add.tween(taskText).to( { y: -200 }, 10000, Phaser.Easing.Cubic.Out, true, this.creditCount * 4000);
    this.creditCount ++;
  },

  addMenuOption: function(text, callback) {
    var optionStyle = { font: '28px Microsoft YaHei', fill: 'white', align: 'right', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var txt = game.add.text(700, (this.optionCount * 60) + 460, text, optionStyle);

    txt.stroke = "rgba(0,0,0,0)";
    txt.strokeThickness = 4;
    var onOver = function (target) {
      target.fill = "#FEFFD5";
      target.stroke = "rgba(200,200,200,0.5)";
      txt.useHandCursor = true;
    };
    var onOut = function (target) {
      target.fill = "white";
      target.stroke = "rgba(0,0,0,0)";
      txt.useHandCursor = false;
    };
    //txt.useHandCursor = true;
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback, this);
    txt.events.onInputOver.add(onOver, this);
    txt.events.onInputOut.add(onOut, this);

    this.optionCount ++;
  },

  create: function () {
    this.stage.disableVisibilityChange = true;
    if (gameOptions.playMusic) {
      musicPlayer.stop();
      musicPlayer = game.add.audio('exit');
      musicPlayer.play();
    }
    var bg = game.add.sprite(0, 0, 'gameover-bg');
    this.addCredit('Music', 'Kevin Macleod');
    this.addCredit('Developer', 'Humiliter');
    this.addCredit('Powered By', 'Phaser.io');
    this.addCredit('for playing', 'Thank you');
    this.addMenuOption('返回', function (e) {
      game.state.start("GameMenu");
    });
    game.add.tween(bg).to({alpha: 0}, 20000, Phaser.Easing.Cubic.Out, true, 40000);
  }

};
