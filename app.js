require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const routes = require('./routes/main');
const secureRoutes = require('./routes/secure');

// setup mongo connection
const uri = process.env.MONGO_CONNECTION_URL;
mongoose.connect(uri, { useNewUrlParser : true, useCreateIndex: true });
mongoose.connection.on('error', (error) => {
  console.log(error);
  process.exit(1);
});
mongoose.connection.on('connected', function () {
  console.log('connected to mongo');
});

//setup app
const app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var players = {};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// require passport auth
require('./auth/auth');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// main routes
app.use('/', routes);
app.use('/', passport.authenticate('jwt', { session : false }), secureRoutes);

// catch all other routes
app.use((req, res) => {
  res.status(404);
  res.json({ message: '404 - Not Found' });
});

// handle errors
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({ error : err });
});

io.on('connection', function (socket) {
  console.log('a user connected');

  // create a new player and add it to our players object
  players[socket.id] = {
    facing: 'down',
    x: Math.floor(Math.random() * 700) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    playerId: socket.id,
    team: (Math.floor(Math.random() * 2) == 0) ? 'red' : 'blue'
  };

  // send the players object to the new player
  socket.emit('currentPlayers', players);

  // update all other players of the new player
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('disconnect', function () {
    console.log('user disconnected');
    // remove this player from our players object
    delete players[socket.id];
    // emit a message to all players to remove this player
    io.emit('disconnect', socket.id);
  });

  // when a player moves, update the player data
  socket.on('playerMovement', function (movementData) {
    if (players[movementData.playerId]) {
      players[movementData.playerId].x = movementData.x;
      players[movementData.playerId].y = movementData.y;
      players[movementData.playerId].facing = movementData.facing;
      players[movementData.playerId].animata = movementData.animata;
      // emit a message to all players about the player that moved
      socket.broadcast.emit('playerMoved', players[movementData.playerId]);
    }
  });

  socket.on('playerIdle', function (playerData) {
    if (players[playerData.playerId]) {
      players[playerData.playerId].facing = playerData.facing;
      socket.broadcast.emit('playerIdle', players[playerData.playerId]);
    }
  });

  socket.on('playerAttack', function (attackData) {

    if (players[attackData.playerId]) {
      console.log(players[attackData.playerId]);
      players[attackData.playerId].x = attackData.x;
      players[attackData.playerId].y = attackData.y;
      players[attackData.playerId].facing = attackData.facing;
      // socket.broadcast.emit('playerMoved', players[attackData.playerId]);
      socket.broadcast.emit('playerAttack', players[attackData.playerId]);
    }
  });

  socket.on('playerDodge', function (dodgeData) {
    if (players[dodgeData.playerId] && dodgeData.playerId !== socket.id) {
      players[dodgeData.playerId].legAbility(dodgeData.dir);
    }
  });

  socket.on('playerHealthChange', function (playerData) {
    players[playerData.playerId].hp = playerData.hp;
    socket.broadcast.emit('playerHealthChange', players[playerData.playerId]);
  });
});

server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});
