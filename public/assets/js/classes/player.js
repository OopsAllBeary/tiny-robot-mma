class Player extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.sprite);
    config.scene.add.existing(this);

    if (config.robot) {
      this.parts = config.data.robot;
    } else {
      this.parts = [1, 101, 201, 301, 301];
    }


    this.bodyCheck = false;
    this.forcedMove = false;
    this.invinsible = 0;
    this.hp = 50;
    this.maxHP = 50;

    this.speed = 160;

    this.healing = false;

    this.socket = config.socket;


    this.oldHP = {
      hp: this.hp
    };

    this.healthbar = new Healthbar(config.scene, config.x - 35, config.y - 70, this.hp);
  }
  update () {
    if (this.body && this.bodyCheck === false) {
      // this.setOrigin(0.5, 0);
      this.body.setSize(20, 50, true).setOffset(40, 0);
      this.bodyCheck = true;
    }

    if (this.forcedMove === true) {
      this.socket.emit('playerMovement', { x: this.x, y: this.y, facing: this.facing, animata: this.anims.currentAnim.key, playerId: this.playerId });
    }

    if (this.invinsible > 0) {
      this.invinsible -= 1;
    }

    if (this.hp > this.maxHP) {
      this.hp = this.maxHP;
    }


    this.healthbar.follow(this.x - 35, this.y - 70);
    heal(this);
  }
  moveInDirection (dir, socket) {
    let xx, yy;
    switch (dir) {
      case 'down':
        xx = 0;
        yy = this.speed;

        break;
      case 'downleft':
        xx = this.speed * -.75;
        yy = this.speed * .75;

        break;
      case 'left':
        xx = -this.speed;
        yy = 0;

        break;
      case 'upleft':
        xx = this.speed * -.75;
        yy = this.speed * -.75;

        break;
      case 'up':
        xx = 0;
        yy = -this.speed;

        break;
      case 'upright':
        xx = this.speed * .75;
        yy = this.speed * -.75;

        break;
      case 'right':
        xx = this.speed;
        yy = 0;

        break;
      case 'downright':
        xx = this.speed * .75;
        yy = this.speed * .75;

        break;
    }

    this.body.setVelocityX(xx);
    this.body.setVelocityY(yy);
    this.anims.play('walk-' + dir, true);
    this.facing = dir;

    // emit player movement
    var x = this.x;
    var y = this.y;
    var anima;
    if (this.anims.currentAnim) {
      anima = this.anims.currentAnim.key;
    }
    if (this.oldPosition && (x !== this.oldPosition.x || y !== this.oldPosition.y || this.facing !== this.oldPosition.facing || anima !== this.oldPosition.animata)) {
      socket.emit('playerMovement', { x: x, y: y, facing: this.facing, animata: anima, playerId: this.playerId });
    }

    // save old position data
    this.oldPosition = {
      x: this.x,
      y: this.y,
      facing: this.facing,
      animata: this.animata
    };
  }

  legAbility(dir, socket) {
    dodge(this, dir);
    this.forcedMove = true;

    if (socket) {
      socket.emit('playerDodge', { facing: this.facing, dir: dir });
      socket.emit('playerHealthChange', { hp: this.hp, playerId: this.playerId });
    }

    self.time.delayedCall(200, () => {
      this.forceMove = false;
    });

  }

  updateSprite(playerInfo) {
    if (this.x > playerInfo.x) {
      if (this.y > playerInfo.y) {
        //upleft

        this.facing = "upleft";
        this.setPosition(playerInfo.x, playerInfo.y);
      } else if (this.y < playerInfo.y) {
        //downleft

        this.facing = "downleft";
        this.setPosition(playerInfo.x, playerInfo.y);
      } else {
        //left

        this.facing = "left";
        this.setPosition(playerInfo.x, playerInfo.y);
      }
    } else if (this.x < playerInfo.x) {
      if (this.y > playerInfo.y) {
        //upright

        this.facing = "upright";
        this.setPosition(playerInfo.x, playerInfo.y);
      } else if (this.y < playerInfo.y) {
        //downright

        this.facing = "downright";
        this.setPosition(playerInfo.x, playerInfo.y);
      } else {
        //right

        this.facing = "right";
        this.setPosition(playerInfo.x, playerInfo.y);
      }
    } else {
      if (this.y > playerInfo.y) {
        //up

        this.facing = "up";
        this.setPosition(playerInfo.x, playerInfo.y);
      } else if (this.y < playerInfo.y) {
        //down

        this.facing = "down";
        this.setPosition(playerInfo.x, playerInfo.y);
      }
    }

    if (this.animata !== playerInfo.animata) {
      this.anims.play(playerInfo.animata, true);
    }
  }

  idle(dir, socket) {
    this.body.setVelocityX(0);
    this.body.setVelocityY(0);
    this.anims.play('idle-' + dir, true);

    if (socket) {
      socket.emit('playerIdle', { facing: this.facing, playerId: this.playerId });
    }
  }

  mainAttack(socket) {
    punch(this);
    // this.forcedMove = true;
    if (socket) {
      socket.emit('playerAttack', { facing: this.facing, playerId: this.playerId, x: this.x, y: this.y });
    }

    self.time.delayedCall(300, () => {
      this.forceMove = false;

      if (socket) {
        socket.emit('playerIdle', { facing: this.facing, playerId: this.playerId });
      }
    });
  }

  takeDamage(dam) {

    if (this.invinsible === 0) {
      this.invinsible = 10;
      this.hp -= dam;
    }

    this.healthbar.changeTo(this.hp);


    // if (this.oldHP && this.hp !== this.oldHP) {
    //   socket.emit('playerHealthChange', { hp: this.hp });
    // }

    // save old position data
    this.oldHP = {
      hp: this.hp
    };
  }

  setHP(playerInfo) {
    console.log(playerInfo);
    this.hp = playerInfo.hp;

    this.healthbar.changeTo(this.hp);
  }


}
