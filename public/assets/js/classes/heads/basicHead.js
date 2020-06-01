let healRate = 500;

function heal(hero) {
  if (hero.healing === false) {
    hero.healing = true;

    hero.hp += 1;
    hero.healthbar.changeTo(hero.hp);

    var timer = self.time.delayedCall(healRate, () => {
      hero.healing = false;
      timer.destroy();
    });
  }
}
