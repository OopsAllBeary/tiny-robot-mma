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
facing;

function preload ()
{
  this.load.spritesheet('blueman', '/assets/assets/bluemansp/spritesheet.png', { frameWidth: 104, frameHeight: 92, endFrame: 16 });

  this.load.spritesheet('blueman-walk', '/assets/assets/blueman-walk/spritesheet.png', { frameWidth: 108, frameHeight: 94, endFrame: 192 });

  this.load.spritesheet('blueman-cheer', '/assets/assets/blueman-cheer/spritesheet.png', { frameWidth: 122, frameHeight: 102, endFrame: 336 });

  // this.load.setBaseURL('http://labs.phaser.io');
  //
  this.load.image('sky', 'http://labs.phaser.io/assets/skies/space3.png');
  // this.load.image('logo', 'assets/sprites/phaser3-logo.png');
  // this.load.image('red', 'assets/particles/red.png');
}

function create ()
{

  var self = this;
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
    frames: walkFrames(0),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'walk-downleft',
    frames: walkFrames(2),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'walk-left',
    frames: walkFrames(4),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'walk-upleft',
    frames: walkFrames(6),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'walk-up',
    frames: walkFrames(8),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'walk-upright',
    frames: walkFrames(10),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'walk-right',
    frames: walkFrames(12),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'walk-downright',
    frames: walkFrames(14),
    frameRate: 10,
    repeat: -1
  });
  //
  // var particles = this.add.particles('red');
  //
  // var emitter = particles.createEmitter({
  //     speed: 100,
  //     scale: { start: 1, end: 0 },
  //     blendMode: 'ADD'
  // });
  //
  // var logo = this.physics.add.image(400, 100, 'logo');
  //
  // logo.setVelocity(100, 200);
  // logo.setBounce(1, 1);
  // logo.setCollideWorldBounds(true);
  //
  // emitter.startFollow(logo);
}

function update ()
{
  if (this.hero) {
    if (cursors.left.isDown)
    {
      if (cursors.up.isDown)
      {
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

    // emit player movement
    var x = this.hero.x;
    var y = this.hero.y;
    var face = this.hero.facing;
    if (this.hero.oldPosition && (x !== this.hero.oldPosition.x || y !== this.hero.oldPosition.y || face !== this.hero.oldPosition.facing)) {
      this.socket.emit('playerMovement', { x: this.hero.x, y: this.hero.y, facing: this.hero.facing });
    }

    // save old position data
    this.hero.oldPosition = {
      x: this.hero.x,
      y: this.hero.y,
      facing: this.hero.facing
    };
  }
}

function walkFrames(d) {
  return ([
    { key: 'blueman-walk', frame: 16 + d },
    { key: 'blueman-walk', frame: 32 + d },
    { key: 'blueman-walk', frame: 48 + d },
    { key: 'blueman-walk', frame: 64 + d },
    { key: 'blueman-walk', frame: 80 + d },
    { key: 'blueman-walk', frame: 96 + d },
    { key: 'blueman-walk', frame: 112 + d },
    { key: 'blueman-walk', frame: 128 + d },
    { key: 'blueman-walk', frame: 144 + d },
    { key: 'blueman-walk', frame: 160 + d },
    { key: 'blueman-walk', frame: 176 + d },
    { key: 'blueman-walk', frame: d }
  ]);
}

function addPlayer(self, playerInfo) {
  self.hero = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'blueman', 0).setOrigin(0.5, 0.5);
  if (playerInfo.team === 'blue') {
    self.hero.setTint(0xAAAAFF);
  } else {
    self.hero.setTint(0xFFAAAA);
  }
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'blueman', 0).setOrigin(0.5, 0.5);
  if (playerInfo.team === 'blue') {
    otherPlayer.setTint(0x0000ff);
  } else {
    otherPlayer.setTint(0xff0000);
  }
  otherPlayer.playerId = playerInfo.playerId;
  otherPlayer.facing = 'down';
  self.otherPlayers.add(otherPlayer);
}

function moveHero(hero, playerInfo) {
  console.log(hero);
  console.log(playerInfo);

  if (hero.x > playerInfo.x) {
    if (hero.y > playerInfo.y) {
      //upleft
      if (hero.anims.currentAnim != 'walk-upleft') {
        hero.anims.play('walk-upleft', true);
      }

      hero.facing = "upleft";
      hero.setPosition(playerInfo.x, playerInfo.y);
    } else if (hero.y < playerInfo.y) {
      //downleft
      if (hero.anims.currentAnim != 'walk-downleft') {
        hero.anims.play('walk-downleft', true);
      }

      hero.facing = "downleft";
      hero.setPosition(playerInfo.x, playerInfo.y);
    } else {
      //left
      if (hero.anims.currentAnim != 'walk-left') {
        hero.anims.play('walk-left', true);
      }

      hero.facing = "left";
      hero.setPosition(playerInfo.x, playerInfo.y);
    }
  } else if (hero.x < playerInfo.x) {
    if (hero.y > playerInfo.y) {
      //upright
      if (hero.anims.currentAnim != 'walk-upright') {
        hero.anims.play('walk-upright', true);
      }

      hero.facing = "upright";
      hero.setPosition(playerInfo.x, playerInfo.y);
    } else if (hero.y < playerInfo.y) {
      //downright
      if (hero.anims.currentAnim != 'walk-downright') {
        hero.anims.play('walk-downright', true);
      }

      hero.facing = "downright";
      hero.setPosition(playerInfo.x, playerInfo.y);
    } else {
      //right
      if (hero.anims.currentAnim != 'walk-right') {
        hero.anims.play('walk-right', true);
      }

      hero.facing = "right";
      hero.setPosition(playerInfo.x, playerInfo.y);
    }
  } else {
    if (hero.y > playerInfo.y) {
      //up
      if (hero.anims.currentAnim != 'walk-up') {
        hero.anims.play('walk-up', true);
      }

      hero.facing = "up";
      hero.setPosition(playerInfo.x, playerInfo.y);
    } else if (hero.y < playerInfo.y) {
      //down
      if (hero.anims.currentAnim != 'walk-down') {
        hero.anims.play('walk-down', true);
      }

      hero.facing = "down";
      hero.setPosition(playerInfo.x, playerInfo.y);
    } else {
      //idle
      switch (hero.facing) {
        case "up":
          hero.anims.play('idle-up', true);
          break;
        case "upright":
          hero.anims.play('idle-upright', true);
          break;
        case "upleft":
          hero.anims.play('idle-upleft', true);
          break;
        case "down":
          hero.anims.play('idle-down', true);
          break;
        case "downright":
          hero.anims.play('idle-downright', true);
          break;
        case "downleft":
          hero.anims.play('idle-downleft', true);
          break;
        case "right":
          hero.anims.play('idle-right', true);
          break;
        case "left":
          hero.anims.play('idle-left', true);
          break;
      }
    }
  }


}
