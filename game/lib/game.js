var util = require('util');
var http = require('http');
var path = require('path');
var ecstatic = require('ecstatic');
var io = require('socket.io');

var Player = require('./Player');

var port = process.env.PORT || 8080;


var socket;	  // Socket controller
var players;	// Array of connected players

// 创建并启动http服务器
var server = http.createServer(
  ecstatic({ root: path.resolve(__dirname, '../public') })
).listen(port, function (err) {
  if (err) {
    throw err;
  }

  init();
})

// 初始化
function init () {
  // 创建空数组储存玩家
  players = [];

  // 使Socket.IO连接服务器
  socket = io.listen(server);

  // 开始监听事件
  setEventHandlers();
}

// 事件句柄
var setEventHandlers = function () {
  socket.sockets.on('connection', onSocketConnection);
}

// 新的socket连接
function onSocketConnection (client) {
  util.log('New player has connected: ' + client.id);

  // 监听客户端断开
  client.on('disconnect', onClientDisconnect);

  // 监听新玩家创建信息
  client.on('new player', onNewPlayer);

  // 监听玩家移动信息
  client.on('move player', onMovePlayer);

  // 监听玩家借命
  client.on('give life', onLifeGiven);
}

// Socket服务端断开
function onClientDisconnect () {
  util.log('Player has disconnected: ' + this.id)

  var removePlayer = playerById(this.id)

  // 无法找到玩家
  if (!removePlayer) {
    util.log('Player not found: ' + this.id)
    return
  }

  // 从数组中移除断开的玩家
  players.splice(players.indexOf(removePlayer), 1)

  // 将移除玩家的事件广播给其他的所有玩家
  this.broadcast.emit('remove player', {id: this.id})
}

// 新玩家加入
function onNewPlayer (data) {

  console.log("new player");
  // 创建新玩家
  var newPlayer = new Player(data.x, data.y);
  newPlayer.id = this.id;

  // 广播新玩家加入的信息
  if(!players.length) {
    // 第一个玩家连入，通过此事件将id创回给客户端
    this.emit('first player', {id: newPlayer.id});
  } else {
    this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});
  }

  // 将已存在玩家信息传入给新创建玩家
  // 第一个玩家连入，也是无效的
  var i, existingPlayer;
  for (i = 0; i < players.length; i++) {
    existingPlayer = players[i];
    this.emit('new player', {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
  }

  // 将新玩家加入数组
  players.push(newPlayer);
}

// 玩家移动
function onMovePlayer (data) {
  // 找到数组中的具体位置
  // this.id是随着socket对象传进来的
  var movePlayer = playerById(this.id);
  // console.log(this.id);
  // 找不到玩家
  if (!movePlayer) {
    util.log('Player not found: ' + this.id);
    return;
  }

  // 更新玩家位置
  movePlayer.setX(data.x);
  movePlayer.setY(data.y);

  // 广播给其他客户端玩家，此玩家的新的移动位置
  // 只有一个玩家时，不发送此信息
  if(players.length > 1) {
    this.broadcast.emit('move player', {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
  }
}

// 玩家借命
function onLifeGiven() {
  this.broadcast.emit('give life');
}

/*
  util
 */
// 通过玩家ID查找玩家
function playerById (id) {
  var i;
  for (i = 0; i < players.length; i++) {
    if (players[i].id === id) {
      return players[i];
    }
  }

  return false;
}
