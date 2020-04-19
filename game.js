var Phaser = require('phaser');

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
    cursors;

function preload ()
{
    this.load.spritesheet('blueman', 'assets/bluemansp/spritesheet.png', { frameWidth: 252, frameHeight: 180, endFrame: 16 });
    // this.load.setBaseURL('http://labs.phaser.io');
    //
    // this.load.image('sky', 'assets/skies/space3.png');
    // this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    // this.load.image('red', 'assets/particles/red.png');
}

function create ()
{
    blueman = this.physics.add.sprite(400, 300, 'blueman', 0).setOrigin(0.2, 0.8);
    cursors = this.input.keyboard.createCursorKeys();

    this.anims.create({
        key: 'down',
        frames: [ { key: 'blueman', frame: 0 } ],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'left',
        frames: [ { key: 'blueman', frame: 4 } ],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: [ { key: 'blueman', frame: 12 } ],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: [ { key: 'blueman', frame: 8 } ],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'downleft',
        frames: [ { key: 'blueman', frame: 2 } ],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'upleft',
        frames: [ { key: 'blueman', frame: 6 } ],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'upright',
        frames: [ { key: 'blueman', frame: 10 } ],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'downright',
        frames: [ { key: 'blueman', frame: 14 } ],
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
  if (cursors.left.isDown)
  {
      blueman.setVelocityX(-100);
      blueman.setVelocityY(0);

      blueman.anims.play('left', true);

      if (cursors.up.isDown)
      {
        blueman.setVelocityX(-75);
        blueman.setVelocityY(-75);

        blueman.anims.play('upleft', true);
      }
      else if (cursors.down.isDown)
      {
        blueman.setVelocityX(-75);
        blueman.setVelocityY(75);

        blueman.anims.play('downleft', true);
      }
  }
  else if (cursors.right.isDown)
  {
      blueman.setVelocityX(100);
      blueman.setVelocityY(0);

      blueman.anims.play('right', true);

      if (cursors.up.isDown)
      {
        blueman.setVelocityX(75);
        blueman.setVelocityY(-75);

        blueman.anims.play('upright', true);
      }
      else if (cursors.down.isDown)
      {
        blueman.setVelocityX(75);
        blueman.setVelocityY(75);

        blueman.anims.play('downright', true);
      }
  }
  else if (cursors.up.isDown)
  {
      blueman.setVelocityX(0);
      blueman.setVelocityY(-100);

      blueman.anims.play('up', true);
  }
  else if (cursors.down.isDown)
  {
      blueman.setVelocityX(0);
      blueman.setVelocityY(100);

      blueman.anims.play('down', true);
  } else
  {
    blueman.setVelocityX(0);
    blueman.setVelocityY(0);
  }
}
