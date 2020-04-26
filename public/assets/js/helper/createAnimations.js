function createAnimations (self, animationArray) {
  for (let i = 0; i < animationArray.length; i++) {
    console.log(animationArray[i]);
  }

  self.anims.create({
    key: 'idle-down',
    frames: [ { key: 'blueman', frame: 0 } ],
    frameRate: 10,
    repeat: -1
  });

  self.anims.create({
    key: 'idle-left',
    frames: [ { key: 'blueman', frame: 4 } ],
    frameRate: 10,
    repeat: -1
  });

  self.anims.create({
    key: 'idle-right',
    frames: [ { key: 'blueman', frame: 12 } ],
    frameRate: 10,
    repeat: -1
  });

  self.anims.create({
    key: 'idle-up',
    frames: [ { key: 'blueman', frame: 8 } ],
    frameRate: 10,
    repeat: -1
  });

  self.anims.create({
    key: 'idle-downleft',
    frames: [ { key: 'blueman', frame: 2 } ],
    frameRate: 10,
    repeat: -1
  });

  self.anims.create({
    key: 'idle-upleft',
    frames: [ { key: 'blueman', frame: 6 } ],
    frameRate: 10,
    repeat: -1
  });

  self.anims.create({
    key: 'idle-upright',
    frames: [ { key: 'blueman', frame: 10 } ],
    frameRate: 10,
    repeat: -1
  });

  self.anims.create({
    key: 'idle-downright',
    frames: [ { key: 'blueman', frame: 14 } ],
    frameRate: 10,
    repeat: -1
  });

  self.anims.create({
    key: 'walk-down',
    frames: frames('blueman-walk', 12, 0),
    frameRate: 10,
    repeat: -1
  });

  self.anims.create({
    key: 'walk-downleft',
    frames: frames('blueman-walk', 12, 2),
    frameRate: 10,
    repeat: -1
  });

  self.anims.create({
    key: 'walk-left',
    frames: frames('blueman-walk', 12, 4),
    frameRate: 10,
    repeat: -1
  });

  self.anims.create({
    key: 'walk-upleft',
    frames: frames('blueman-walk', 12, 6),
    frameRate: 10,
    repeat: -1
  });

  self.anims.create({
    key: 'walk-up',
    frames: frames('blueman-walk', 12, 8),
    frameRate: 10,
    repeat: -1
  });

  self.anims.create({
    key: 'walk-upright',
    frames: frames('blueman-walk', 12, 10),
    frameRate: 10,
    repeat: -1
  });

  self.anims.create({
    key: 'walk-right',
    frames: frames('blueman-walk', 12, 12),
    frameRate: 10,
    repeat: -1
  });

  self.anims.create({
    key: 'walk-downright',
    frames: frames('blueman-walk', 12, 14),
    frameRate: 10,
    repeat: -1
  });

  self.anims.create({
    key: 'punch-down',
    frames: frames('blueman-punch', 14, 0),
    frameRate: 35,
    repeat: 0
  });

  self.anims.create({
    key: 'punch-downleft',
    frames: frames('blueman-punch', 14, 2),
    frameRate: 35,
    repeat: 0
  });

  self.anims.create({
    key: 'punch-left',
    frames: frames('blueman-punch', 14, 4),
    frameRate: 35,
    repeat: 0
  });

  self.anims.create({
    key: 'punch-upleft',
    frames: frames('blueman-punch', 14, 6),
    frameRate: 35,
    repeat: 0
  });

  self.anims.create({
    key: 'punch-up',
    frames: frames('blueman-punch', 14, 8),
    frameRate: 35,
    repeat: 0
  });

  self.anims.create({
    key: 'punch-upright',
    frames: frames('blueman-punch', 14, 10),
    frameRate: 35,
    repeat: 0
  });

  self.anims.create({
    key: 'punch-right',
    frames: frames('blueman-punch', 14, 12),
    frameRate: 35,
    repeat: 0
  });

  self.anims.create({
    key: 'punch-downright',
    frames: frames('blueman-punch', 14, 14),
    frameRate: 35,
    repeat: 0
  });

  self.anims.create({
    key: 'punch',
    frames: [ { key: 'punch', frame: 8 } ],
    frameRate: 10,
    repeat: -1
  });
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
