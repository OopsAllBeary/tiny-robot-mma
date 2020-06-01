class Healthbar {
  constructor (scene, x, y, max)
  {
    this.bar = new Phaser.GameObjects.Graphics(scene);

    this.x = x;
    this.y = y;
    this.value = max;
    this.p = 56 / max;

    this.draw();

    scene.add.existing(this.bar);
  }

  changeTo (amount)
  {
    this.value = amount;

    if (this.value < 0)
    {
      this.value = 0;
    }

    this.draw();

    return (this.value === 0);
  }

  follow (newX, newY) {
    if (newX != this.x || newY != this.y) {
      this.x = newX;
      this.y = newY;
      this.draw();
    }
  }

  draw ()
  {
    this.bar.clear();

    //  BG
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(this.x, this.y, 60, 16);

    //  Health

    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(this.x + 2, this.y + 2, 56, 12);

    if (this.value < 30)
    {
      this.bar.fillStyle(0xff0000);
    }
    else
    {
      this.bar.fillStyle(0x00ff00);
    }

    var d = Math.floor(this.p * this.value);

    this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
  }
}







// class Healthbar extends Phaser.GameObjects.Rectangle {
//   constructor(config) {
//     super(config.scene, config.x, config.y, config.width, config.height, config.color, config.alpha);
//   }
// }
