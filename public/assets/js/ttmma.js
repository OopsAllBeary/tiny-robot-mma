
let gameWidth = 800;
let gameHeight = 600;

var config = {
  type: Phaser.AUTO,
  width: gameWidth,
  height: gameHeight,
  scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

var cursors,
    keyW,
    keyA,
    keyS,
    keyD,
    self;

var punchStrong,
    punchSlap,
    punchWoosh;

var vel = {
  down: [0, 100],
  downleft: [-75, 75],
  left: [-100, 0],
  upleft: [-75, -75],
  up: [0, -100],
  upright: [75, -75],
  right: [100, 0],
  downright: [75, 75]
}

function preload ()
{
  this.load.spritesheet('blueman', '/assets/sprites/bluemansp/spritesheet.png', { frameWidth: 104, frameHeight: 92, endFrame: 16 });

  this.load.spritesheet('blueman-walk', '/assets/sprites/blueman-walk/spritesheet.png', { frameWidth: 108, frameHeight: 94, endFrame: 192 });

  this.load.spritesheet('blueman-cheer', '/assets/sprites/blueman-cheer/spritesheet.png', { frameWidth: 122, frameHeight: 102, endFrame: 336 });

  this.load.spritesheet('blueman-punch', '/assets/sprites/blueman-punch/spritesheet.png', { frameWidth: 124, frameHeight: 100, endFrame: 224 });

  this.load.spritesheet('punch', '/assets/sprites/fist/spritesheet.png', { frameWidth: 54, frameHeight: 104, endFrame: 16 });

  this.load.audio('punchSlap', 'assets/audio/slap.mp3');
  this.load.audio('punchStrong', 'assets/audio/spunch.mp3');
  this.load.audio('punchWoosh', 'assets/audio/woosh.mp3');
}

function create ()
{
  self = this;
  this.socket = io();

  createAnimations(this, ['blueman', 'blueman-walk', 'blueman-punch', 'punch']);

  punchStrong = game.sound.add("punchStrong");
  punchSlap = game.sound.add("punchSlap");
  punchWoosh = game.sound.add("punchWoosh");

  let fakeRect = new Phaser.Geom.Rectangle(0, 0, gameWidth, gameHeight);

  this.heros = this.physics.add.group({ collideWorldBounds: true, customBoundsRectangle: fakeRect });
  this.otherPlayers = this.physics.add.group({ collideWorldBounds: true, immovable: true, customBoundsRectangle: fakeRect });
  this.attacks = this.physics.add.group({ collideWorldBounds: true, customBoundsRectangle: fakeRect });


  this.physics.add.collider(this.otherPlayers, this.heros);
  this.physics.add.collider(this.otherPlayers, this.otherPlayers);
  this.physics.add.overlap(this.otherPlayers, this.attacks, hitCollide, null, this);


  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        const urlParams = new URLSearchParams(window.location.search);
        const playerEmail = urlParams.get('email');
        getPlayerData(playerEmail, players[id]);
      } else {
        let player = addPlayer(self, players[id]);
        self.otherPlayers.add(player);
      }
    });
  });
  this.socket.on('newPlayer', function (playerInfo) {
    let player = addPlayer(self, playerInfo);
    self.otherPlayers.add(player);
  });
  this.socket.on('disconnect', function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy();
      }
    });
  });
  this.socket.on('playerMoved', function (playerInfo) {
    if (playerInfo.playerId === self.socket.id) {
      self.heros.getChildren()[0].updateSprite(playerInfo);
    } else {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.updateSprite(playerInfo);
        }
      });
    }
  });
  this.socket.on('playerAttack', function (playerInfo) {
    console.log('test');
    if (playerInfo.playerId === self.socket.id) {
      self.heros.getChildren()[0].mainAttack(self.socket);
      console.log('att');
    } else {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.mainAttack();
        }
      });
    }

  });
  this.socket.on('playerIdle', function (playerInfo) {
    if (playerInfo.playerId === self.socket.id) {
      self.heros.getChildren()[0].idle(playerInfo.facing);
    } else {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.idle(playerInfo.facing);
        }
      });
    }

  });
  this.socket.on('playerHealthChange', function (playerInfo) {
    // console.log(playerInfo);
    // console.log(self.socket.id);
    if (playerInfo.playerId === self.socket.id) {
      console.log('ouch');
      self.heros.getChildren()[0].setHP(playerInfo);
    } else {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setHP(playerInfo);
        }
      })
    }
  });

  cursors = this.input.keyboard.createCursorKeys();
  keyW = this.input.keyboard.addKey('W');
  keyA = this.input.keyboard.addKey('A');
  keyS = this.input.keyboard.addKey('S');
  keyD = this.input.keyboard.addKey('D');
}

function update ()
{
  let allPlayers = this.heros.getChildren();
  for (let i = 0; i < allPlayers.length; i++) {
    allPlayers[i].update();
    if (allPlayers[i].hp <= 0) {
      console.log(allPlayers[i]);
      allPlayers[i].healthbar.bar.destroy();
      allPlayers[i].destroy();


      // window.location.href = 'https://www.youtube.com/watch?v=t-v6xe1X1zo';
    }
  }

  if (allPlayers[0]) {
    controls(allPlayers[0], this.socket);
  }

  let allEnemies = this.otherPlayers.getChildren();
  for (let i = 0; i < allEnemies.length; i++) {
    allEnemies[i].update();
    if (allEnemies[i].hp <= 0) {
      allEnemies[i].healthbar.bar.destroy();
      allEnemies[i].destroy();
    }
  }
}

function addPlayer(selfs, playerInfo) {

  console.log(playerInfo);
  // if (!playerInfo.data) {
  //   playerInfo.data = playerInfo;
  // }

  let thePlayer = new Player({scene: selfs, x: playerInfo.x, y: playerInfo.y, sprite: 'blueman', socket: self.socket, data: playerInfo.data});

  if (playerInfo.team === 'blue') {
    thePlayer.team = 'blue';
    thePlayer.setTint(0xAAAAFF);
  } else {
    thePlayer.team = 'red';
    thePlayer.setTint(0xFFAAAA);
  }

  thePlayer.anims.play('idle-down', true);
  thePlayer.facing = 'down';
  thePlayer.acting = false;
  thePlayer.playerId = playerInfo.playerId;
  selfs.physics.add.existing(thePlayer);

  return thePlayer;
}

function hitCollide (player, attack) {

  punchSlap.play();

  player.body.setVelocity(vel[attack.facing][0] * 3, vel[attack.facing][1] * 3);
  attack.body.setVelocity(vel[attack.facing][0], vel[attack.facing][1]);
  player.forcedMove = true;

  self.time.delayedCall(100, () => {
    attack.destroy();
  });

  self.time.delayedCall(300, () => {

    player.forcedMove = false;
    if (player.body) {player.body.setVelocity(0);}

    player.takeDamage(attack.damage);
    this.socket.emit('playerHealthChange', { hp: player.hp, playerId: player.playerId });
  });
}

function controls (player, socket) {
  if (!player.acting) {
    if (cursors.space.isDown) {
      socket.emit('playerAttack', { facing: player.facing, playerId: player.playerId, x: player.x, y: player.y });
    } else if (keyA.isDown) {
      if (keyW.isDown) {
        player.legAbility('upleft', socket);
      } else if (keyS.isDown) {
        player.legAbility('downleft', socket);
      } else {
        player.legAbility('left', socket);
      }
    } else if (keyD.isDown) {
      if (keyW.isDown) {
        player.legAbility('upright', socket);
      } else if (keyS.isDown) {
        player.legAbility('downright', socket);
      } else {
        player.legAbility('right', socket);
      }
    } else if (keyW.isDown) {
      player.legAbility('up', socket);
    } else if (keyS.isDown) {
      player.legAbility('down', socket);
    } else {
      if (cursors.left.isDown) {
        if (cursors.up.isDown) {
          player.moveInDirection('upleft', socket);
        } else if (cursors.down.isDown) {
          player.moveInDirection('downleft', socket);
        } else {
          player.moveInDirection('left', socket);
        }
      } else if (cursors.right.isDown) {
        if (cursors.up.isDown) {
          player.moveInDirection('upright', socket);
        } else if (cursors.down.isDown) {
          player.moveInDirection('downright', socket);
        } else {
          player.moveInDirection('right', socket);
        }
      } else if (cursors.up.isDown) {
        player.moveInDirection('up', socket);
      } else if (cursors.down.isDown) {
        player.moveInDirection('down', socket);
      } else {
        player.idle(player.facing, socket);
      }
    }
  }
}

function getPlayerData(id, dataObject) {
  $.ajax({
    type: 'POST',
    async: false,
    data: {
      email: id
    },
    url: '/retrieve-login',
    success: function(data) {
      dataObject.data = data;
      let player = addPlayer(self, dataObject);
      self.heros.add(player);
    },
    error: function(xhr) {
      console.log(xhr);
      return null;
    }
  });
}
