function punch(hero) {
  hero.acting = true;

  let anima = 'punch-' + hero.facing;

  hero.anims.play(anima, true);

  hero.body.setVelocity(vel[hero.facing][0] * 1.5, vel[hero.facing][1] * 1.5);

  self.punch = self.physics.add.sprite(hero.x, hero.y, 'punch', 0).setOrigin(0.5, 0.5).setScale(0.5).setSize(40, 40);

  self.punch.damage = 10;
  self.attacks.add(self.punch);
  if (hero.team === 'blue') {
    self.punch.setTint(0xAAAAFF);
  } else {
    self.punch.setTint(0xFFAAAA);
  }

  self.punch.setVelocity(vel[hero.facing][0] * 2, vel[hero.facing][1] * 2);

  switch (hero.facing) {
    case 'down':
      self.punch.setAngle(180);
      self.punch.setPosition(hero.x - 20, hero.y + 25);
      self.punch.setOffset(10, 60);
      break;
    case 'up':
      self.punch.setAngle(0);
      self.punch.setPosition(hero.x + 15, hero.y + 25);
      self.punch.setOffset(0, 0);
      break;
    case 'left':
      self.punch.setAngle(-90);
      self.punch.setFrame(10);
      self.punch.setPosition(hero.x - 10, hero.y + 10);
      self.punch.setOffset(-20, 30);
      break;
    case 'right':
      self.punch.setAngle(90);
      // self.punch.setFrame(14);
      self.punch.setPosition(hero.x, hero.y + 30);
      self.punch.setOffset(40, 30);
      break;
    case 'upright':
      self.punch.setAngle(45);
      self.punch.setPosition(hero.x + 5, hero.y + 35);
      self.punch.setOffset(30, 10);
      break;
    case 'upleft':
      self.punch.setAngle(-45);
      self.punch.setPosition(hero.x + 10, hero.y + 10);
      self.punch.setOffset(-20, 10);
      break;
    case 'downright':
      self.punch.setAngle(135);
      self.punch.setPosition(hero.x - 15, hero.y + 30);
      self.punch.setOffset(30, 50);
      break;
    case 'downleft':
      self.punch.setAngle(-135);
      self.punch.setPosition(hero.x - 15, hero.y + 15);
      self.punch.setOffset(-10, 60);
      break;
  }
  self.punch.facing = hero.facing;

  var timer = self.time.delayedCall(400, () => {
    hero.acting = false;
    if (self.punch) {
      self.punch.destroy();
    }
    timer.destroy();
  });
}
