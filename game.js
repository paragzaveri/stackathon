//game instantiation object
let game = new Phaser.Game(1000, 600, Phaser.AUTO, 'arcade', {
  preload: preload,
  create: create,
  update: update,
  render: render,
});

// global game variables

let hero;
let cursors;
let gameOver = false;
let heroBullets;
let heroFireRate = 100;
let nextFire = 0;

let drones;
let droneBullets;
let totalDrones = 0;
let remainingDrones = 0;
let playerHealth = 20;

let score = 0;
let scoreText;

const EnemyDrone = function(name, game, hero, bullets, drone) {
  let x = game.world.randomX;
  let y = game.world.randomY;
  this.name = name;
  this.game = game;
  this.health = 2;
  this.hero = hero;
  this.droneBullets = bullets;
  this.enemyFireRate = 1000;
  this.nextFire = 1000;
  this.alive = true;

  this.drone = game.add.sprite(x, y, drone);
  this.drone.anchor.set(0.5);
  this.drone.scale.setTo(0.25, 0.25);

  game.physics.enable(this.drone, Phaser.Physics.ARCADE);
};

EnemyDrone.prototype.damage = function() {
  this.health -= 1;
  if (this.health <= 0) {
    this.alive = false;
    this.drone.kill();
    // this.drone.disableBody(true, true);
    return true;
  }
  return false;
};

EnemyDrone.prototype.update = function() {
  if (this.game.physics.arcade.distanceBetween(this.drone, this.hero) < 350) {
    if (
      this.game.time.now > this.nextFire &&
      this.droneBullets.countDead() > 0 &&
      this.drone.alive
    ) {
      this.nextFire = this.game.time.now + this.enemyFireRate;
      let bullet = this.droneBullets.getFirstDead();
      bullet.reset(this.drone.x, this.drone.y);
      bullet.scale.setTo(0.25, 0.25);
      bullet.rotation = this.game.physics.arcade.moveToObject(
        bullet,
        hero,
        500
      );
    }
  }
};
//create instance of game

function preload() {
  this.load.image('background', 'assets/background.png');
  this.load.image('heroShip', 'assets/ships/shipgrey3.png');
  this.load.image('heroBullet', 'assets/bullets/BlueBlast001.png');
  this.load.image('droneBullet', 'assets/bullets/OrangeBlast__001.png');

  this.load.image('bluedrone', 'assets/drones/bluedrone1.png');
  this.load.image('greendone', 'assets/drones/greendrone.png');
  this.load.image('greydrone', 'assets/drones/greydrone1.png');
  this.load.image('purpledrone1.png', 'assets/drones/purpledrone1.png');
  this.load.image('reddrone1.png', 'assets/drones/reddrone1.png');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  //  A simple background for our game
  // game.add.tileSprite(0, 0, 800, 600, 'background');
  game.stage.backgroundColor = '#000000';
  // game.world.setBounds(0, 0, 2000, 2000);
  game.world.resize(6000, 600);

  // The hero ship
  hero = game.add.sprite(400, 300, 'heroShip');
  game.physics.enable(hero, Phaser.Physics.ARCADE);
  hero.anchor.setTo(0.5, 0.5);
  hero.scale.setTo(0.25, 0.25);
  game.camera.follow(hero);
  hero.body.collideWorldBounds = true;
  // hero.fixedToCamera = true;

  //input events
  cursors = game.input.keyboard.createCursorKeys();

  //hero bullets
  heroBullets = game.add.group();
  heroBullets.enableBody = true;
  heroBullets.physicsBodyType = Phaser.Physics.ARCADE;
  heroBullets.createMultiple(10000, 'heroBullet');

  //enemy bullets
  droneBullets = game.add.group();
  droneBullets.enableBody = true;
  droneBullets.physicsBodyType = Phaser.Physics.ARCADE;
  droneBullets.createMultiple(25, 'droneBullet');

  //create some enemies
  drones = [];
  totalDrones = 30;
  remainingDrones = 30;
  for (let i = 0; i < totalDrones; i++) {
    drones.push(new EnemyDrone(i, game, hero, droneBullets, 'bluedrone'));
  }
}

function update() {
  if (gameOver) {
    return;
  }
  game.physics.arcade.overlap(droneBullets, hero, dronePlayerHit, null, this);
  // remainingDrones = 0;
  for (let i = 0; i < drones.length; i++) {
    // remainingDrones++;
    game.physics.arcade.collide(hero, drones[i].drone);
    game.physics.arcade.overlap(
      heroBullets,
      drones[i].drone,
      playerDroneHit,
      null,
      this
    );
    drones[i].update();
  }
  if (cursors.left.isDown) {
    hero.body.velocity.x = -240;
    // game.camera.x -= 4;
  } else if (cursors.right.isDown) {
    hero.body.velocity.x = 240;
    // game.camera.x += 4;
  } else if (cursors.up.isDown) {
    hero.body.velocity.y = -130;
    // game.camera.y -= 4;
  } else if (cursors.down.isDown) {
    hero.body.velocity.y = 130;
    // game.camera.y += 4;
  } else {
    hero.body.velocity.x = 0;
    hero.body.velocity.y = 0;
  }
  if (cursors.right.isDown && cursors.up.isDown) {
    hero.angle -= 0.8;
  } else if (cursors.right.isDown && cursors.down.isDown) {
    hero.angle += 0.8;
  } else if (cursors.left.isDown && cursors.up.isDown) {
    hero.angle -= 0.8;
  } else if (cursors.left.isDown && cursors.down.isDown) {
    hero.angle += 0.8;
  }
  if (game.input.activePointer.isDown) {
    shoot();
  }
}

function shoot() {
  if (game.time.now > nextFire && heroBullets.countDead() > 0) {
    nextFire = game.time.now + heroFireRate;
    let bullet = heroBullets.getFirstDead();
    bullet.reset(hero.x, hero.y);
    bullet.scale.setTo(0.25, 0.25);
    game.physics.arcade.moveToPointer(bullet, 600);
  }
}

function dronePlayerHit(hero, droneBullet) {
  droneBullet.kill();
  playerHealth--;
  if (playerHealth <= 0) {
    hero.kill();
    gameOver = true;
  }
}

function playerDroneHit(drone, heroBullet) {
  heroBullet.kill();
  drone.kill();
  score += 10;
  remainingDrones -= 1;
  if (remainingDrones <= 0) {
    gameOver = true;
  }
  // drones[heroBullet.name].damage();
}

function render() {
  game.debug.text(`Enemies: ${remainingDrones}/${totalDrones}`, 32, 32);
  game.debug.text(`Player Health: ${playerHealth}`, 32, 550);
  game.debug.text('Score: ' + score, 800, 32);
}
