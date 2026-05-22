const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false      
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let stars;
let platforms;
let score = 0;
let scoreText;
let cursors;

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('dude', 'assets/dude.png'); // Ganti jadi image biasa, bukan spritesheet
}

function create() {
    // Background
    let sky = this.add.image(400, 300, 'sky');
    sky.setDisplaySize(800, 600);

    // Platforms
    platforms = this.physics.add.staticGroup();
    
    // Ground platform - LEBIH TEBAL
    let ground = platforms.create(400, 560, 'ground');
    ground.displayWidth = 800;
    ground.displayHeight = 80;
    ground.refreshBody();
    
    // Platform 1 - LEBIH TEBAL
    let plat1 = platforms.create(600, 400, 'ground');
    plat1.setDisplaySize(200, 60);
    plat1.refreshBody();
    
    // Platform 2 - LEBIH TEBAL
    let plat2 = platforms.create(50, 250, 'ground');
    plat2.setDisplaySize(200, 60);
    plat2.refreshBody();
    
    // Platform 3 - LEBIH TEBAL
    let plat3 = platforms.create(750, 220, 'ground');
    plat3.setDisplaySize(200, 60);
    plat3.refreshBody();

    // Player - GEDEIN BIAR KELIATAN
    player = this.physics.add.sprite(100, 400, 'dude');
    player.setDisplaySize(80, 120); // GEDEIN dengan setDisplaySize
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    
    console.log('Player created at:', player.x, player.y, 'Size:', player.displayWidth, player.displayHeight);

    // Stars - GEDEIN BIAR KELIATAN
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 50, y: 0, stepX: 65 }
    });

    stars.children.iterate(function (child) {
        child.setDisplaySize(40, 40); // GEDEIN bintang
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        child.refreshBody();
    });

    // Score
    scoreText = this.add.text(16, 16, 'Score: 0', 
        { fontSize: '32px', fill: '#ffff00', fontFamily: 'Arial',
          stroke: '#000', strokeThickness: 5 }
    );
    
    // Instruksi game
    this.add.text(400, 30, 'Use Arrow Keys to Move & Jump!', 
        { fontSize: '20px', fill: '#ffffff', fontFamily: 'Arial',
          stroke: '#000', strokeThickness: 3 }
    ).setOrigin(0.5);

    // Keyboard
    cursors = this.input.keyboard.createCursorKeys();

    // Colliders
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    
    console.log('Game ready! Press arrow keys to play.');
}

function update() {
    // KONTROL KIRI
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
        player.setFlipX(true); // Balik gambar ke kiri
    }
    // KONTROL KANAN
    else if (cursors.right.isDown) {
        player.setVelocityX(200);
        player.setFlipX(false); // Balik gambar ke kanan
    }
    // STOP
    else {
        player.setVelocityX(0);
    }
    
    // KONTROL LOMPAT
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-350);
    }
}

function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
    
    console.log('Star collected! Score:', score);

    // Kalau semua bintang sudah diambil, spawn lagi
    if(stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });
        
        console.log('All stars collected! Respawning...');
    }
}