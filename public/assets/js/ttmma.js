var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

var blueman,
cursors,
facing,
self;

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
  this.load.spritesheet('blueman', '/assets/assets/bluemansp/spritesheet.png', { frameWidth: 104, frameHeight: 92, endFrame: 16 });

  this.load.spritesheet('blueman-walk', '/assets/assets/blueman-walk/spritesheet.png', { frameWidth: 108, frameHeight: 94, endFrame: 192 });

  this.load.spritesheet('blueman-cheer', '/assets/assets/blueman-cheer/spritesheet.png', { frameWidth: 122, frameHeight: 102, endFrame: 336 });

  this.load.spritesheet('blueman-punch', '/assets/assets/blueman-punch/spritesheet.png', { frameWidth: 124, frameHeight: 100, endFrame: 224 });

  this.load.spritesheet('punch', '/assets/assets/blueman-punch/spritesheet.png', { frameWidth: 54, frameHeight: 104, endFrame: 16 });
}

function create ()
{

  self = this;
  this.socket = io();
  this.otherPlayers = this.physics.add.group();
  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id]);
      } else {
        addOtherPlayers(self, players[id]);
      }
    });
  });
  this.socket.on('newPlayer', function (playerInfo) {
    addOtherPlayers(self, playerInfo);
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
        moveHero(otherPlayer, playerInfo);
      }
    });
  });



  // blueman = this.physics.add.sprite(400, 300, 'blueman', 0);
  cursors = this.input.keyboard.createCursorKeys();

  this.anims.create({
    key: 'idle-down',
    frames: [ { key: 'blueman', frame: 0 } ],
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'idle-left',
    frames: [ { key: 'blueman', frame: 4 } ],
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'idle-right',
    frames: [ { key: 'blueman', frame: 12 } ],
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'idle-up',
    frames: [ { key: 'blueman', frame: 8 } ],
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'idle-downleft',
    frames: [ { key: 'blueman', frame: 2 } ],
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'idle-upleft',
    frames: [ { key: 'blueman', frame: 6 } ],
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'idle-upright',
    frames: [ { key: 'blueman', frame: 10 } ],
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'idle-downright',
    frames: [ { key: 'blueman', frame: 14 } ],
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'walk-down',
    frames: frames('blueman-walk', 12, 0),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'walk-downleft',
    frames: frames('blueman-walk', 12, 2),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'walk-left',
    frames: frames('blueman-walk', 12, 4),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'walk-upleft',
    frames: frames('blueman-walk', 12, 6),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'walk-up',
    frames: frames('blueman-walk', 12, 8),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'walk-upright',
    frames: frames('blueman-walk', 12, 10),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'walk-right',
    frames: frames('blueman-walk', 12, 12),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'walk-downright',
    frames: frames('blueman-walk', 12, 14),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'punch-down',
    frames: frames('blueman-punch', 14, 0),
    frameRate: 35,
    repeat: 0
  });

  this.anims.create({
    key: 'punch-downleft',
    frames: frames('blueman-punch', 14, 2),
    frameRate: 35,
    repeat: 0
  });

  this.anims.create({
    key: 'punch-left',
    frames: frames('blueman-punch', 14, 4),
    frameRate: 35,
    repeat: 0
  });

  this.anims.create({
    key: 'punch-upleft',
    frames: frames('blueman-punch', 14, 6),
    frameRate: 35,
    repeat: 0
  });

  this.anims.create({
    key: 'punch-up',
    frames: frames('blueman-punch', 14, 8),
    frameRate: 35,
    repeat: 0
  });

  this.anims.create({
    key: 'punch-upright',
    frames: frames('blueman-punch', 14, 10),
    frameRate: 35,
    repeat: 0
  });

  this.anims.create({
    key: 'punch-right',
    frames: frames('blueman-punch', 14, 12),
    frameRate: 35,
    repeat: 0
  });

  this.anims.create({
    key: 'punch-downright',
    frames: frames('blueman-punch', 14, 14),
    frameRate: 35,
    repeat: 0
  });

  this.anims.create({
    key: 'punch',
    frames: [ { key: 'punch', frame: 8 } ],
    frameRate: 10,
    repeat: -1
  });

}

function update ()
{
  if (this.hero) {
    if (!this.hero.acting) {
      if (cursors.space.isDown) {
        punch(this.hero);
      } else {
        if (cursors.left.isDown) {
          if (cursors.up.isDown) {
            this.hero.setVelocityX(-75);
            this.hero.setVelocityY(-75);

            this.hero.anims.play('walk-upleft', true);

            this.hero.facing = "upleft";
          }

          else if (cursors.down.isDown)
          {
            this.hero.setVelocityX(-75);
            this.hero.setVelocityY(75);

            this.hero.anims.play('walk-downleft', true);

            this.hero.facing = "downleft";
          } else {
            this.hero.setVelocityX(-100);
            this.hero.setVelocityY(0);

            this.hero.anims.play('walk-left', true);

            this.hero.facing = "left";
          }
        }
        else if (cursors.right.isDown)
        {
          if (cursors.up.isDown)
          {
            this.hero.setVelocityX(75);
            this.hero.setVelocityY(-75);

            this.hero.anims.play('walk-upright', true);

            this.hero.facing = "upright";
          }
          else if (cursors.down.isDown)
          {
            this.hero.setVelocityX(75);
            this.hero.setVelocityY(75);

            this.hero.anims.play('walk-downright', true);

            this.hero.facing = "downright";
          } else {
            this.hero.setVelocityX(100);
            this.hero.setVelocityY(0);

            this.hero.anims.play('walk-right', true);

            this.hero.facing = "right";
          }
        }
        else if (cursors.up.isDown)
        {
          this.hero.setVelocityX(0);
          this.hero.setVelocityY(-100);

          this.hero.anims.play('walk-up', true);

          this.hero.facing = "up";
        }
        else if (cursors.down.isDown)
        {
          this.hero.setVelocityX(0);
          this.hero.setVelocityY(100);

          this.hero.anims.play('walk-down', true);

          this.hero.facing = "down";
        } else
        {
          this.hero.setVelocityX(0);
          this.hero.setVelocityY(0);

          switch (this.hero.facing) {
            case "up":
            this.hero.anims.play('idle-up', true);
            break;
            case "upright":
            this.hero.anims.play('idle-upright', true);
            break;
            case "upleft":
            this.hero.anims.play('idle-upleft', true);
            break;
            case "down":
            this.hero.anims.play('idle-down', true);
            break;
            case "downright":
            this.hero.anims.play('idle-downright', true);
            break;
            case "downleft":
            this.hero.anims.play('idle-downleft', true);
            break;
            case "right":
            this.hero.anims.play('idle-right', true);
            break;
            case "left":
            this.hero.anims.play('idle-left', true);
            break;
          }
        }
      }
    }

    // emit player movement
    var x = this.hero.x;
    var y = this.hero.y;
    var face = this.hero.facing;
    var anima;
    if (this.hero.anims.currentAnim) {
      anima = this.hero.anims.currentAnim.key;
    }
    if (this.hero.oldPosition && (x !== this.hero.oldPosition.x || y !== this.hero.oldPosition.y || face !== this.hero.oldPosition.facing || anima !== this.hero.oldPosition.animata)) {
      this.socket.emit('playerMovement', { x: x, y: y, facing: face, animata: anima });
    }

    // save old position data
    this.hero.oldPosition = {
      x: this.hero.x,
      y: this.hero.y,
      facing: this.hero.facing,
      animata: this.hero.animata
    };

  }
}

function frames(type, frames, offset) {
  let object = [];
  for (let i = 0; i < frames; i++) {
    object.push({ key: type, frame: ((i * 16) + offset) });
  }

  let item = object.shift();
  object.push(item);

  return object;
}

function addPlayer(selfs, playerInfo) {
  selfs.hero = selfs.physics.add.sprite(playerInfo.x, playerInfo.y, 'blueman', 0).setOrigin(0.5, 0.5);
  if (playerInfo.team === 'blue') {
    selfs.hero.setTint(0xAAAAFF);
  } else {
    selfs.hero.setTint(0xFFAAAA);
  }

  selfs.hero.acting = false;
  selfs.hero.facing = 'down';
}

function addOtherPlayers(selfs, playerInfo) {
  const otherPlayer = selfs.add.sprite(playerInfo.x, playerInfo.y, 'blueman', 0).setOrigin(0.5, 0.5);
  if (playerInfo.team === 'blue') {
    otherPlayer.setTint(0x0000ff);
  } else {
    otherPlayer.setTint(0xff0000);
  }
  otherPlayer.playerId = playerInfo.playerId;
  otherPlayer.facing = 'down';
  selfs.otherPlayers.add(otherPlayer);
}

function moveHero(hero, playerInfo) {
  // console.log(hero);
  // console.log(playerInfo);

  if (hero.x > playerInfo.x) {
    if (hero.y > playerInfo.y) {
      //upleft

      hero.facing = "upleft";
      hero.setPosition(playerInfo.x, playerInfo.y);
    } else if (hero.y < playerInfo.y) {
      //downleft

      hero.facing = "downleft";
      hero.setPosition(playerInfo.x, playerInfo.y);
    } else {
      //left

      hero.facing = "left";
      hero.setPosition(playerInfo.x, playerInfo.y);
    }
  } else if (hero.x < playerInfo.x) {
    if (hero.y > playerInfo.y) {
      //upright

      hero.facing = "upright";
      hero.setPosition(playerInfo.x, playerInfo.y);
    } else if (hero.y < playerInfo.y) {
      //downright

      hero.facing = "downright";
      hero.setPosition(playerInfo.x, playerInfo.y);
    } else {
      //right

      hero.facing = "right";
      hero.setPosition(playerInfo.x, playerInfo.y);
    }
  } else {
    if (hero.y > playerInfo.y) {
      //up

      hero.facing = "up";
      hero.setPosition(playerInfo.x, playerInfo.y);
    } else if (hero.y < playerInfo.y) {
      //down

      hero.facing = "down";
      hero.setPosition(playerInfo.x, playerInfo.y);
    }
  }

  if (hero.animata !== playerInfo.animata) {
    hero.anims.play(playerInfo.animata, true);
  }
}

function punch(hero) {
  hero.acting = true;

  let anima = 'punch-' + hero.facing;
  console.log(anima);


  hero.anims.play(anima, true);

  hero.setVelocity(vel[hero.facing][0] * 1.5, vel[hero.facing][1] * 1.5);

  self.punch = self.physics.add.sprite(hero.x, hero.y, 'punch', 8).setOrigin(0.5, 0.5);
  if (hero.team === 'blue') {
    self.punch.setTint(0xAAAAFF);
  } else {
    self.punch.setTint(0xFFAAAA);
  }



  hero.on('animationcomplete', () => {
    hero.acting = false;
  });
}
