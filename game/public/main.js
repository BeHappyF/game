// Global Variables
var
  // 初始化阶段无法通过window.body.clientHeight获取实际的屏幕高度
  game = new Phaser.Game(800, 600, Phaser.AUTO, 'game'),
  Main = function () {},
  gameOptions = {
    playSound: true,
    playMusic: true,
    // 玩家的初始化设定，因为需要跨越states，所以定义全局变量
    // 是否允许借命
    isLifeGiven: false,
    // 是否开启道具共享
    isToolsShared: false
  },
  musicPlayer;



Main.prototype = {

  preload: function () {
    game.load.image('stars',    'assets/images/stars.jpg');
    game.load.image('loading',  'assets/images/loading.png');
    game.load.image('brand',    'assets/images/logo.png');
    game.load.script('polyfill',   'js/lib/polyfill.js');
    game.load.script('utils',   'js/lib/utils.js');
    game.load.script('splash',  'states/Splash.js');
  },

  create: function () {
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }

};

game.state.add('Main', Main);
game.state.start('Main');
