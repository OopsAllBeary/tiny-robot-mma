let game, exps;

class Experience extends Phaser.Scene {

  constructor() {
    super({
      key: 'Experience',
      active: true
    });

    this.exps = [];
  }

  preload() {
    this.load.bitmapFont('arcade', 'assets/arcade.png', 'assets/arcade.xml');
  }

  create() {
    this.add.bitmapText(100, 110, 'arcade', 'RANK  EXP   NAME').setTint(0xffffff);

    for (let i = 1; i < 6; i++) {
      if (exps[i-1]) {
        this.add.bitmapText(100, 160 + 50 * i, 'arcade', ` ${i}      ${exps[i-1].experiencePoints}    ${exps[i-1].name}`).setTint(0xffffff);
      } else {
        this.add.bitmapText(100, 160 + 50 * i, 'arcade', ` ${i}      0    ---`).setTint(0xffffff);
      }
    }
  }
}

let config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 800,
  height: 600,
  pixelArt: true,
  scene: [Experience]
};

$.ajax({
  type: 'GET',
  url: '/exp',
  success: function(data) {
    game = new Phaser.Game(config);
    exps = data;
  },
  error: function(xhr) {
    console.log(xhr);
  }
});
