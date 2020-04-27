var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
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

  this.heros = this.physics.add.group({ collideWorldBounds: true });
  this.otherPlayers = this.physics.add.group({ collideWorldBounds: true, immovable: true });
  this.attacks = this.physics.add.group({ collideWorldBounds: true });


  this.physics.add.collider(this.otherPlayers, this.heros);
  this.physics.add.collider(this.otherPlayers, this.otherPlayers);
  this.physics.add.overlap(this.otherPlayers, this.attacks, hitCollide, null, this);


  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      let player = addPlayer(self, players[id]);
      if (players[id].playerId === self.socket.id) {
        self.heros.add(player);
      } else {
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
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        otherPlayer.updateSprite(playerInfo);
      }
    });
    if (playerInfo.playerId === self.socket.id) {
      console.log('test');
      self.heros.getChildren()[0].updateSprite(playerInfo);
    }
  });
  this.socket.on('playerHurt', function (playerInfo) {
    console.log(playerInfo);
    console.log(self.socket.id);
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
}

function update ()
{
  let allPlayers = this.heros.getChildren();
  for (let i = 0; i < allPlayers.length; i++) {
    allPlayers[i].update();
    if (allPlayers[i].hp <= 0) {
      allPlayers[i].destroy();
      window.location.href = 'https://www.youtube.com/watch?v=t-v6xe1X1zo';
    }
  }

  if (allPlayers[0]) {
    controls(allPlayers[0], this.socket);
  }

  let allEnemies = this.otherPlayers.getChildren();
  for (let i = 0; i < allEnemies.length; i++) {
    allEnemies[i].update();
    if (allEnemies[i].hp <= 0) {
      allEnemies[i].destroy();
    }
  }
}

function addPlayer(selfs, playerInfo) {
  let thePlayer = new Player({scene: selfs, x: playerInfo.x, y: playerInfo.y, sprite: 'blueman', socket: self.socket});

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
    console.log(player);
    this.socket.emit('playerHurt', { hp: player.hp, playerId: player.playerId });
  });

  console.log(player);
  console.log(attack);
}

function controls (player, socket) {
  if (!player.acting) {
    if (cursors.space.isDown) {
      punchWoosh.play();
      player.mainAttack();
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
        player.idle(player.facing);
      }
    }
  }
}
