function punch(hero) {
  hero.acting = true;
  console.log('punch');
  let anima = 'punch-' + hero.facing;
  let angle, posX, posY, offX, offY;
  let frame = 0;
  punchWoosh.play();

  console.log(hero);
  
  hero.anims.play(anima, true);
  hero.body.setSize(20, 50, true).setOffset(40, 0);

  hero.body.setVelocity(vel[hero.facing][0] * 1.5, vel[hero.facing][1] * 1.5);


  switch (hero.facing) {
    case 'down':
      angle = 180;
      posX = 5;
      posY = 30;
      offX = 10;
      offY = 60;
      break;
    case 'up':
      angle = 0;
      posX = 40;
      posY = 25;
      offX = 0;
      offY = 0;
      break;
    case 'left':
      angle = -90;
      frame = 10;
      posX = 20;
      posY = 15;
      offX = -20;
      offY = 30;
      break;
    case 'right':
      angle = 90;
      posX = 20;
      posY = 40;
      // frame = 14;
      offX = 40;
      offY = 30;
      break;
    case 'upright':
      angle = 45;
      posX = 35;
      posY = 35;
      offX = 30;
      offY = 10;
      break;
    case 'upleft':
      angle = -45;
      posX = 30;
      posY = 10;
      offX = -20;
      offY = 10;
      break;
    case 'downright':
      angle = 135;
      posX = 20;
      posY = 40;
      offX = 30;
      offY = 50;
      break;
    case 'downleft':
      angle = -135;
      posX = 5;
      posY = 20;
      offX = -10;
      offY = 60;
      break;
  }

  self.punch = self.physics.add.sprite((hero.x + posX), (hero.y + posY), 'punch', 0).setScale(0.5).setSize(40, 40).setAngle(angle).setFrame(frame).setOffset(offX, offY);

  self.punch.damage = 10;
  self.attacks.add(self.punch);
  if (hero.team === 'blue') {
    self.punch.setTint(0xAAAAFF);
  } else {
    self.punch.setTint(0xFFAAAA);
  }

  self.punch.setVelocity(vel[hero.facing][0] * 2, vel[hero.facing][1] * 2);


  self.punch.facing = hero.facing;

  var timer = self.time.delayedCall(400, () => {
    hero.acting = false;
    if (self.punch) {
      self.punch.destroy();
    }
    timer.destroy();
  });
}
