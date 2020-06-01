let cost = 10;

function dodge(hero, dir) {
  hero.acting = true;

  let anima = 'idle-' + hero.facing;
  punchWoosh.play();

  hero.anims.play(anima, true);
  hero.body.setSize(20, 50, true).setOffset(40, 0);

  hero.body.setVelocity(vel[dir][0] * 4, vel[dir][1] * 4);

  hero.takeDamage(cost);




  var timer = self.time.delayedCall(200, () => {
    hero.acting = false;
    timer.destroy();
  });
}
