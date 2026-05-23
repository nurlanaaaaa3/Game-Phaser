const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    backgroundColor: '#1a1a2e',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 400 }, debug: false }
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let player, stars, platforms, enemies;
let cursors, wasd;
let score = 0, lives = 3, level = 1;
let scoreText, livesText, levelText;
let isInvincible = false;
let gameOver = false;
let levelClearing = false;

function preload() {
    this.load.image('sky',    'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star',   'assets/star.png');
    this.load.image('dude',   'assets/dude.png');

    // Generate sprite musuh (slime) pakai Canvas
    const canvas = document.createElement('canvas');
    canvas.width  = 48;
    canvas.height = 48;
    const ctx = canvas.getContext('2d');

    // Body slime (bulat gepeng)
    const grd = ctx.createRadialGradient(24, 28, 4, 24, 26, 22);
    grd.addColorStop(0,   '#ff6666');
    grd.addColorStop(0.6, '#cc0000');
    grd.addColorStop(1,   '#660000');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.ellipse(24, 30, 20, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Highlight atas
    ctx.fillStyle = 'rgba(255,180,180,0.45)';
    ctx.beginPath();
    ctx.ellipse(20, 22, 10, 7, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // Mata kiri
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(17, 25, 5, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.ellipse(18, 26, 2.5, 3, 0, 0, Math.PI*2); ctx.fill();
    // Sorot mata kiri
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(19, 24.5, 1, 1, 0, 0, Math.PI*2); ctx.fill();

    // Mata kanan
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(31, 25, 5, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.ellipse(32, 26, 2.5, 3, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(33, 24.5, 1, 1, 0, 0, Math.PI*2); ctx.fill();

    // Mulut jahat
    ctx.strokeStyle = '#660000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(18, 34); ctx.quadraticCurveTo(24, 38, 30, 34);
    ctx.stroke();

    // Taring kecil
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(21,34); ctx.lineTo(19,38); ctx.lineTo(23,34); ctx.fill();
    ctx.beginPath(); ctx.moveTo(27,34); ctx.lineTo(25,38); ctx.lineTo(29,34); ctx.fill();

    // Antena
    ctx.strokeStyle = '#cc0000';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(18, 14); ctx.lineTo(15, 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(30, 14); ctx.lineTo(33, 6); ctx.stroke();
    ctx.fillStyle = '#ff3333';
    ctx.beginPath(); ctx.arc(15, 5, 3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(33, 5, 3, 0, Math.PI*2); ctx.fill();

    // Kaki kecil
    ctx.fillStyle = '#990000';
    ctx.beginPath(); ctx.ellipse(14, 44, 5, 4, -0.3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(24, 46, 5, 4, 0,    0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(34, 44, 5, 4,  0.3, 0, Math.PI*2); ctx.fill();

    this.textures.addCanvas('enemy', canvas);
}

function create() {
    gameOver      = false;
    levelClearing = false;

    this.add.image(400, 250, 'sky').setDisplaySize(800, 500);

    // Platforms
    platforms = this.physics.add.staticGroup();
    const ground = platforms.create(400, 478, 'ground');
    ground.setDisplaySize(800, 44);
    ground.refreshBody();

    const layouts = {
        1: [[600,360,220,28],[50,240,180,28],[740,210,180,28],[300,290,160,28]],
        2: [[100,380,150,28],[380,310,140,28],[640,250,150,28],[200,200,130,28],[500,160,140,28]],
        3: [[80,400,120,28],[280,350,120,28],[480,290,120,28],[680,230,120,28],[530,160,120,28],[290,120,110,28]],
    };
    for (const [x,y,w,h] of layouts[Math.min(level,3)]) {
        const p = platforms.create(x, y, 'ground');
        p.setDisplaySize(w, h);
        p.refreshBody();
    }

    // Player
    player = this.physics.add.image(100, 380, 'dude');
    player.setDisplaySize(40, 56);
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);
    player.jumpsLeft = 2;

    // Stars
    const starCount = 8 + level * 2;
    stars = this.physics.add.group();
    const starTex = this.textures.get('star').getSourceImage();
    const starScale = 28 / Math.max(starTex.width, starTex.height, 1);
    for (let i = 0; i < starCount; i++) {
        const x = 50 + (i / starCount) * 700;
        const star = stars.create(x, -30 - i * 15, 'star');
        star.setScale(starScale);
        star.setBounceY(Phaser.Math.FloatBetween(0.3, 0.6));
        star.setCollideWorldBounds(true);
    }

    // Enemies (slime)
    enemies = this.physics.add.group();
    const enemyData = {
        1: [
            { x: 600, y: 340, speed: 80,  range: 100 },
            { x: 400, y: 440, speed: 90,  range: 150 },
        ],
        2: [
            { x: 380, y: 290, speed: 100, range: 100 },
            { x: 640, y: 230, speed: 110, range: 110 },
            { x: 150, y: 440, speed: 95,  range: 130 },
        ],
        3: [
            { x: 280, y: 330, speed: 120, range: 90  },
            { x: 480, y: 270, speed: 130, range: 90  },
            { x: 680, y: 210, speed: 120, range: 90  },
            { x: 200, y: 440, speed: 110, range: 120 },
        ],
    };

    enemyData[Math.min(level, 3)].forEach(data => {
        const e = enemies.create(data.x, data.y, 'enemy');
        e.setDisplaySize(44, 44);
        e.setCollideWorldBounds(true);
        e.setBounce(0);
        e.patrolOrigin = data.x;
        e.patrolRange  = data.range;
        e.patrolSpeed  = data.speed;
        e.setVelocityX(-data.speed);
    });

    // HUD
    const s = { fontSize:'18px', fill:'#fff', fontFamily:'Arial Black', stroke:'#000', strokeThickness:4 };
    scoreText = this.add.text(12, 10, 'Score: ' + score, s).setDepth(10);
    livesText = this.add.text(12, 36, '♥♥♥', { ...s, fontSize:'22px', fill:'#ff6b6b' }).setDepth(10);
    levelText = this.add.text(400, 10, 'Level ' + level, { ...s, fontSize:'20px', fill:'#ffe84d' }).setOrigin(0.5,0).setDepth(10);
    this.add.text(400, 483, '← → Move  |  ↑ / Space = Jump  (Double Jump!)', {
        fontSize:'11px', fill:'#ccc', fontFamily:'Arial'
    }).setOrigin(0.5,0).setDepth(10);

    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys({
        up:    Phaser.Input.Keyboard.KeyCodes.W,
        left:  Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
        space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });

    this.physics.add.collider(player, platforms, () => { player.jumpsLeft = 2; });
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(enemies, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.overlap(player, enemies, () => hitPlayer(this), null, this);

    // Level banner
    const b = this.add.text(400, 200, 'LEVEL ' + level, {
        fontSize:'52px', fill:'#ffe84d', fontFamily:'Arial Black', stroke:'#000', strokeThickness:7
    }).setOrigin(0.5).setDepth(20).setAlpha(0);
    this.tweens.add({
        targets:b, alpha:{from:0,to:1}, y:{from:220,to:200},
        duration:400, ease:'Back.Out', yoyo:true, hold:700,
        onComplete: () => b.destroy()
    });
}

function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    updateHUD();

    const t = this.add.text(star.x, star.y - 8, '+10', {
        fontSize:'13px', fill:'#ffe84d', fontFamily:'Arial Black', stroke:'#000', strokeThickness:3
    }).setDepth(15);
    this.tweens.add({ targets:t, y:star.y - 45, alpha:0, duration:550, onComplete:()=>t.destroy() });

    if (stars.countActive(true) === 0) {
        levelClearing = true;
        score += 100;
        updateHUD();

        const bonus = this.add.text(400, 200, '🎉 LEVEL CLEAR! +100', {
            fontSize:'26px', fill:'#7effd4', fontFamily:'Arial Black', stroke:'#000', strokeThickness:5
        }).setOrigin(0.5).setDepth(20);
        this.tweens.add({ targets:bonus, alpha:0, y:160, duration:1000, onComplete:()=>bonus.destroy() });

        this.time.delayedCall(1200, () => {
            level++;
            this.scene.restart();
        });
    }
}

function hitPlayer(scene) {
    if (isInvincible || gameOver) return;
    lives--;
    updateHUD();

    if (lives <= 0) {
        gameOver = true;
        scene.physics.pause();
        player.setTint(0xff0000);

        // Overlay gelap
        scene.add.rectangle(400, 250, 800, 500, 0x000000, 0.55).setDepth(18);

        scene.add.text(400, 170, 'GAME OVER', {
            fontSize:'64px', fill:'#ff4444', fontFamily:'Arial Black',
            stroke:'#000', strokeThickness:8
        }).setOrigin(0.5).setDepth(20);

        scene.add.text(400, 262, 'Score: ' + score, {
            fontSize:'28px', fill:'#fff', fontFamily:'Arial Black',
            stroke:'#000', strokeThickness:5
        }).setOrigin(0.5).setDepth(20);

        const r = scene.add.text(400, 330, '[ Tekan R untuk Restart ]', {
            fontSize:'17px', fill:'#ffe84d', fontFamily:'Arial',
            stroke:'#000', strokeThickness:3
        }).setOrigin(0.5).setDepth(20);
        scene.tweens.add({ targets:r, alpha:0, duration:500, yoyo:true, repeat:-1 });

        scene.input.keyboard.once('keydown-R', () => {
            score = 0; lives = 3; level = 1; isInvincible = false;
            scene.scene.restart();
        });
    } else {
        isInvincible = true;
        player.setTint(0xff8888);
        scene.time.delayedCall(150, () => player.clearTint());
        scene.time.delayedCall(2200, () => { isInvincible = false; player.clearTint(); });
        player.setPosition(100, 380);
        player.setVelocity(0, 0);
    }
}

function updateHUD() {
    scoreText.setText('Score: ' + score);
    levelText.setText('Level ' + level);
    livesText.setText('♥'.repeat(Math.max(0,lives)) + '♡'.repeat(Math.max(0,3-lives)));
}

function update() {
    if (gameOver || levelClearing) return;

    const left  = cursors.left.isDown  || wasd.left.isDown;
    const right = cursors.right.isDown || wasd.right.isDown;
    const jump  = Phaser.Input.Keyboard.JustDown(cursors.up)   ||
                  Phaser.Input.Keyboard.JustDown(wasd.up)       ||
                  Phaser.Input.Keyboard.JustDown(wasd.space)    ||
                  Phaser.Input.Keyboard.JustDown(cursors.space);

    if (left) {
        player.setVelocityX(-220);
        player.setFlipX(true);
    } else if (right) {
        player.setVelocityX(220);
        player.setFlipX(false);
    } else {
        player.setVelocityX(0);
    }

    if (player.body.blocked.down) player.jumpsLeft = 2;
    if (jump && player.jumpsLeft > 0) {
        player.setVelocityY(-500);
        player.jumpsLeft--;
    }

    if (player.y > 530) hitPlayer(this);

    player.setAlpha(isInvincible ? (Math.floor(Date.now()/80) % 2 === 0 ? 0.3 : 1.0) : 1);

    // Patrol musuh + animasi bounce slime
    enemies.getChildren().forEach(e => {
        if (!e.active) return;
        const dist = e.x - e.patrolOrigin;

        if (dist > e.patrolRange) {
            e.setVelocityX(-e.patrolSpeed);
            e.setFlipX(false);
        } else if (dist < -e.patrolRange) {
            e.setVelocityX(e.patrolSpeed);
            e.setFlipX(true);
        }

        // Animasi "squish" slime: scale Y naik-turun saat jalan
        const t = this.time.now / 200;
        e.setScale(e.scaleX, e.texture.key === 'enemy'
            ? 1 + Math.sin(t + e.patrolOrigin) * 0.08
            : 1);
    });
}