//game instantiation object
let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

// global game variables
let sky;
let hero;
let cursors;
let gameOver;
// var player;
// var stars;
// var bombs;
// var platforms;
// var cursors;
// var score = 0;
// var gameOver = false;
// var scoreText;

//create instance of game
let game = new Phaser.Game(config);

function preload() {
  this.load.image('background', 'assets/background.png');
  this.load.image('heroShip', 'assets/ships/shipgrey3.png');

  // this.load.image('ground', 'assets/platform.png');
  // this.load.image('star', 'assets/star.png');
  // this.load.image('bomb', 'assets/bomb.png');
  // this.load.spritesheet('dude', 'assets/dude.png', {
  //   frameWidth: 32,
  //   frameHeight: 48,
  // });
}

function create() {
  //  A simple background for our game
  sky = this.add.image(400, 300, 'background');
  // sky.fixedToCamera = true;
  // The hero ship
  hero = this.physics.add.sprite(200, 100, 'heroShip').setScale(0.25);
  hero.setCollideWorldBounds(true);

  //input events
  cursors = this.input.keyboard.createCursorKeys();
  this.cameras.main.startFollow(hero);
}

function update() {
  if (gameOver) {
    return;
  }
  if (cursors.left.isDown) {
    hero.setVelocityX(-140);
  } else if (cursors.right.isDown) {
    hero.setVelocityX(140);
  } else if (cursors.up.isDown) {
    hero.setVelocityY(-80);
  } else if (cursors.down.isDown) {
    hero.setVelocityY(80);
  }
  if (cursors.right.isDown && cursors.up.isDown) {
    hero.angle -= 0.4;
  } else if (cursors.right.isDown && cursors.down.isDown) {
    hero.angle += 0.4;
  } else if (cursors.left.isDown && cursors.up.isDown) {
    hero.angle -= 0.4;
  } else if (cursors.left.isDown && cursors.down.isDown) {
    hero.angle += 0.4;
  }
}
//  The platforms group contains the ground and the 2 ledges we can jump on
// platforms = this.physics.add.staticGroup();

//  Here we create the ground.
//  Scale it to fit the width of the game (the original sprite is 400x32 in size)
// platforms
//   .create(400, 568, 'ground')
//   .setScale(2)
//   .refreshBody();

// //  Now let's create some ledges
// platforms.create(600, 400, 'ground');
// platforms.create(50, 250, 'ground');
// platforms.create(750, 220, 'ground');

// // The player and its settings
// player = this.physics.add.sprite(100, 450, 'dude');

// //  Player physics properties. Give the little guy a slight bounce.
// player.setBounce(0.2);
// player.setCollideWorldBounds(true);

// //  Our player animations, turning, walking left and walking right.
// this.anims.create({
//   key: 'left',
//   frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
//   frameRate: 10,
//   repeat: -1,
// });

// this.anims.create({
//   key: 'turn',
//   frames: [{ key: 'dude', frame: 4 }],
//   frameRate: 20,
// });

// this.anims.create({
//   key: 'right',
//   frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
//   frameRate: 10,
//   repeat: -1,
// });

//   //  Input Events
//   cursors = this.input.keyboard.createCursorKeys();

//   //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
//   stars = this.physics.add.group({
//     key: 'star',
//     repeat: 11,
//     setXY: { x: 12, y: 0, stepX: 70 },
//   });

//   stars.children.iterate(function(child) {
//     //  Give each star a slightly different bounce
//     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
//   });

//   bombs = this.physics.add.group();

//   //  The score
//   scoreText = this.add.text(16, 16, 'score: 0', {
//     fontSize: '32px',
//     fill: '#000',
//   });

//   //  Collide the player and the stars with the platforms
//   this.physics.add.collider(player, platforms);
//   this.physics.add.collider(stars, platforms);
//   this.physics.add.collider(bombs, platforms);

//   //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
//   this.physics.add.overlap(player, stars, collectStar, null, this);

//   this.physics.add.collider(player, bombs, hitBomb, null, this);
// }

// function update() {
//   if (gameOver) {
//     return;
//   }

//   if (cursors.left.isDown) {
//     player.setVelocityX(-160);

//     player.anims.play('left', true);
//   } else if (cursors.right.isDown) {
//     player.setVelocityX(160);

//     player.anims.play('right', true);
//   } else {
//     player.setVelocityX(0);

//     player.anims.play('turn');
//   }

//   if (cursors.up.isDown && player.body.touching.down) {
//     player.setVelocityY(-330);
//   }
// }

// function collectStar(player, star) {
//   star.disableBody(true, true);

//   //  Add and update the score
//   score += 10;
//   scoreText.setText('Score: ' + score);

//   if (stars.countActive(true) === 0) {
//     //  A new batch of stars to collect
//     stars.children.iterate(function(child) {
//       child.enableBody(true, child.x, 0, true, true);
//     });

//     var x =
//       player.x < 400
//         ? Phaser.Math.Between(400, 800)
//         : Phaser.Math.Between(0, 400);

//     var bomb = bombs.create(x, 16, 'bomb');
//     bomb.setBounce(1);
//     bomb.setCollideWorldBounds(true);
//     bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
//     bomb.allowGravity = false;
//   }
// }

// function hitBomb(player, bomb) {
//   this.physics.pause();

//   player.setTint(0xff0000);

//   player.anims.play('turn');

//   gameOver = true;
// }
