// GameScene.js

class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  preload() {
    // Load semua aset dari folder assets/
    const a = (key) => this.load.image(key, `assets/${key}.png`);
    ['player','bullet','pizza','burger','donut','taco','icecream',
     'sushi','chicken','watermelon','bomb','shield','explosion',
     'platform','star_big','star_small'].forEach(a);
  }

  create() {
    this.W = this.scale.width;
    this.H = this.scale.height;
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.combo = 0;
    this.comboTimer = null;
    this.gameOverFlag = false;
    this.shielded = false;
    this.lastShot = 0;
    this.shotDelay = 280;
    this.foodTypes = ['pizza','burger','donut','taco','icecream','sushi','chicken','watermelon'];

    this._bg();
    this._ground();
    this._player();
    this._groups();
    this._hud();
    this._input();
    this._timers();
  }

  _bg() {
    this.add.rectangle(this.W/2, this.H/2, this.W, this.H, 0x1a0a2e);
    this.stars = [];
    for (let i = 0; i < 60; i++) {
      const t = Math.random() > 0.6 ? 'star_big' : 'star_small';
      const s = this.add.image(
        Phaser.Math.Between(0, this.W),
        Phaser.Math.Between(0, this.H - 60), t
      ).setAlpha(Math.random() * 0.7 + 0.2);
      s.speed = Math.random() * 0.3 + 0.1;
      this.stars.push(s);
    }
  }

  _ground() {
    this.ground = this.physics.add.staticImage(this.W/2, this.H - 8, 'platform');
    this.ground.setDisplaySize(this.W, 16);
    this.ground.refreshBody();
  }

  _player() {
    this.player = this.physics.add.sprite(this.W/2, this.H - 80, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(10);
    this.player.body.setGravityY(0);
    this.shieldSpr = this.add.circle(0, 0, 44, 0x00AAFF, 0.22).setDepth(9);
    this.shieldRing = this.add.circle(0, 0, 44).setStrokeStyle(2, 0x00CCFF).setDepth(9);
    this.shieldSpr.setVisible(false);
    this.shieldRing.setVisible(false);
  }

  _groups() {
    this.bullets = this.physics.add.group();
    this.foods = this.physics.add.group();
    this.pups = this.physics.add.group();
    this.physics.add.overlap(this.bullets, this.foods, (b, f) => this._bHitF(b, f));
    this.physics.add.overlap(this.player, this.foods, (p, f) => this._fHitP(p, f));
    this.physics.add.overlap(this.player, this.pups, (p, u) => this._pickup(p, u));
    this.physics.add.overlap(this.foods, this.ground, (f) => this._fHitG(f));
  }

  _hud() {
    this.add.text(10, 8, 'SCORE', { font: '11px monospace', color: '#aaaaaa' }).setDepth(20);
    this.scoreTxt = this.add.text(10, 20, '0', { font: 'bold 22px monospace', color: '#FFFF44' }).setDepth(20);
    this.add.text(this.W/2, 8, 'LEVEL', { font: '11px monospace', color: '#aaaaaa' }).setOrigin(0.5, 0).setDepth(20);
    this.levelTxt = this.add.text(this.W/2, 20, '1', { font: 'bold 22px monospace', color: '#FF69B4' }).setOrigin(0.5, 0).setDepth(20);
    this.add.text(this.W - 10, 8, 'LIVES', { font: '11px monospace', color: '#aaaaaa' }).setOrigin(1, 0).setDepth(20);
    this.livesTxt = this.add.text(this.W - 10, 20, '♥ ♥ ♥', { font: '18px monospace', color: '#FF4444' }).setOrigin(1, 0).setDepth(20);
    this.comboTxt = this.add.text(this.W/2, this.H/2 - 60, '', {
      font: 'bold 28px monospace', color: '#FF6B00'
    }).setOrigin(0.5).setDepth(25).setAlpha(0);
  }

  _input() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.on('pointermove', p => {
      if (p.isDown && !this.gameOverFlag)
        this.player.x = Phaser.Math.Clamp(p.x, 38, this.W - 38);
    });
    this.input.on('pointerdown', () => { if (!this.gameOverFlag) this._shoot(); });
  }

  _timers() {
    this.spawnDelay = 1600;
    this.spawnTimer = this.time.addEvent({
      delay: this.spawnDelay, callback: this._spawnFood, callbackScope: this, loop: true
    });
    this.time.addEvent({
      delay: 20000, callback: this._lvlUp, callbackScope: this, loop: true
    });
  }

  _spawnFood() {
    if (this.gameOverFlag) return;
    const type = Phaser.Utils.Array.GetRandom(this.foodTypes);
    const f = this.physics.add.sprite(Phaser.Math.Between(30, this.W - 30), -40, type);
    f.type = type;
    f.hp = this.level >= 3 ? 2 : 1;
    f.setVelocityY(Phaser.Math.Between(80, 80 + this.level * 30));
    f.setVelocityX(Phaser.Math.Between(-40, 40));
    f.setAngularVelocity(Phaser.Math.Between(-80, 80));
    f.setDepth(5);
    this.foods.add(f);
    if (Math.random() < 0.07) {
      this.time.delayedCall(400, () => {
        const t = Math.random() < 0.5 ? 'bomb' : 'shield';
        const u = this.physics.add.sprite(Phaser.Math.Between(30, this.W - 30), -40, t);
        u.puType = t;
        u.setVelocityY(100);
        u.setDepth(6);
        this.pups.add(u);
      });
    }
  }

  _lvlUp() {
    if (this.gameOverFlag) return;
    this.level++;
    this.levelTxt.setText(this.level);
    this.spawnDelay = Math.max(600, this.spawnDelay - 120);
    this.spawnTimer.delay = this.spawnDelay;
    const fl = this.add.text(this.W/2, this.H/2, `LEVEL ${this.level}!`, {
      font: 'bold 36px monospace', color: '#FF69B4'
    }).setOrigin(0.5).setDepth(30);
    this.tweens.add({ targets: fl, alpha: 0, y: fl.y - 60, duration: 1200, ease: 'Power2', onComplete: () => fl.destroy() });
    this.cameras.main.flash(300, 255, 150, 255);
  }

  _shoot() {
    const now = this.time.now;
    if (now - this.lastShot < this.shotDelay) return;
    this.lastShot = now;
    const b = this.physics.add.sprite(this.player.x, this.player.y - 30, 'bullet');
    b.setVelocityY(-560);
    b.setDepth(8);
    this.bullets.add(b);
    const fl = this.add.circle(this.player.x + 36, this.player.y - 4, 6, 0xFFFF00).setDepth(12).setAlpha(0.9);
    this.time.delayedCall(60, () => fl.destroy());
  }

  _bHitF(bullet, food) {
    bullet.destroy();
    food.hp--;
    if (food.hp <= 0) {
      this._explode(food);
      this._addScore(food);
      this._combo();
      food.destroy();
    } else {
      food.setTint(0xFFFFFF);
      this.time.delayedCall(80, () => { if (food.active) food.clearTint(); });
    }
  }

  _fHitP(player, food) {
    if (this.shielded) { this._explode(food); food.destroy(); return; }
    this._explode(food); food.destroy();
    this.combo = 0;
    this.lives--;
    this._updateLives();
    this.cameras.main.shake(200, 0.015);
    this.cameras.main.flash(150, 255, 0, 0);
    if (this.lives <= 0) this._gameOver();
    else { this.player.setAlpha(0.4); this.time.delayedCall(1000, () => { if (this.player.active) this.player.setAlpha(1); }); }
  }

  _fHitG(food) {
    if (!food.active) return;
    this._explode(food); food.destroy(); this.combo = 0;
    if (!this.shielded) {
      this.lives--;
      this._updateLives();
      this.cameras.main.shake(100, 0.008);
      if (this.lives <= 0) this._gameOver();
    }
  }

  _pickup(player, pu) {
    if (pu.puType === 'bomb') {
      this.foods.getChildren().slice().forEach(f => { this._explode(f); this._addScore(f); f.destroy(); });
      this.cameras.main.flash(400, 255, 200, 0);
      this._float('FOOD BOMB! 💥', this.W/2, this.H/2, '#FFAA00');
    } else {
      this.shielded = true;
      this.shieldSpr.setVisible(true);
      this.shieldRing.setVisible(true);
      this._float('SHIELD! 🛡️', this.player.x, this.player.y - 40, '#00CCFF');
      this.time.delayedCall(5000, () => {
        this.shielded = false;
        this.shieldSpr.setVisible(false);
        this.shieldRing.setVisible(false);
      });
    }
    pu.destroy();
  }

  _addScore(food) {
    const base = { pizza:10, burger:15, donut:8, taco:12, icecream:10, sushi:20, chicken:14, watermelon:10 };
    const pts = (base[food.type] || 10) * this.level * (1 + Math.floor(this.combo / 3));
    this.score += pts;
    this.scoreTxt.setText(this.score);
    this._float('+' + pts, food.x, food.y, '#FFFF44');
  }

  _combo() {
    this.combo++;
    if (this.comboTimer) this.comboTimer.remove();
    this.comboTimer = this.time.delayedCall(2000, () => this.combo = 0);
    if (this.combo >= 3) {
      this.comboTxt.setText(`${this.combo}x COMBO!`);
      this.comboTxt.setAlpha(1);
      this.tweens.killTweensOf(this.comboTxt);
      this.tweens.add({ targets: this.comboTxt, alpha: 0, duration: 900, delay: 600, ease: 'Power1' });
    }
  }

  _explode(food) {
    const ex = this.add.sprite(food.x, food.y, 'explosion').setDepth(15).setScale(0.5 + Math.random() * 0.6);
    this.time.delayedCall(320, () => { if (ex.active) ex.destroy(); });
    const em = { pizza:'🍕', burger:'🍔', donut:'🍩', taco:'🌮', icecream:'🍦', sushi:'🍣', chicken:'🍗', watermelon:'🍉' };
    const e = this.add.text(food.x, food.y, em[food.type] || '💥', { font: '24px Arial' }).setDepth(16).setOrigin(0.5);
    this.tweens.add({ targets: e, y: food.y - 50, alpha: 0, duration: 700, ease: 'Power2', onComplete: () => e.destroy() });
  }

  _float(text, x, y, color) {
    const t = this.add.text(x, y, text, { font: 'bold 20px monospace', color }).setOrigin(0.5).setDepth(25);
    this.tweens.add({ targets: t, y: y - 55, alpha: 0, duration: 900, ease: 'Power2', onComplete: () => t.destroy() });
  }

  _updateLives() {
    const h = ['♥ ♥ ♥', '♥ ♥ ·', '♥ · ·', '· · ·'];
    this.livesTxt.setText(h[Math.max(0, 3 - this.lives)] || '· · ·');
  }

  _getGrade() {
    if (this.score >= 3000) return { grade: 'S', color: '#FFD700', msg: 'SEMPURNA!' };
    if (this.score >= 1500) return { grade: 'A', color: '#FF6B6B', msg: 'LUAR BIASA!' };
    if (this.score >= 800)  return { grade: 'B', color: '#5DCAA5', msg: 'BAGUS!' };
    if (this.score >= 300)  return { grade: 'C', color: '#AFA9EC', msg: 'LUMAYAN~' };
    if (this.score >= 100)  return { grade: 'D', color: '#F0997B', msg: 'PERLU LATIHAN' };
    return                         { grade: 'E', color: '#888780', msg: 'MISI GAGAL' };
  }

  _gameOver() {
    this.gameOverFlag = true;
    this.physics.pause();
    this.spawnTimer.remove();

    const cx = this.W / 2;
    const { grade, color, msg } = this._getGrade();

    // Dark overlay — animate in
    const overlay = this.add.rectangle(cx, this.H/2, this.W, this.H, 0x000000, 0).setDepth(40);
    this.tweens.add({ targets: overlay, alpha: 0.85, duration: 500 });

    // Panel background
    const panelH = 420;
    const panel = this.add.rectangle(cx, this.H/2, this.W - 40, panelH, 0x111118, 0)
      .setDepth(41).setStrokeStyle(1, 0x333344);
    this.tweens.add({ targets: panel, alpha: 1, duration: 400, delay: 200 });

    // Corner brackets (decorative)
    const bx = cx - (this.W-40)/2, by = this.H/2 - panelH/2;
    const bw = this.W - 40, bh = panelH;
    const corners = [
      this.add.text(bx + 4,      by + 4,      '┌', { font: '20px monospace', color: '#444466' }).setDepth(42),
      this.add.text(bx+bw-18,    by + 4,      '┐', { font: '20px monospace', color: '#444466' }).setDepth(42),
      this.add.text(bx + 4,      by+bh-24,    '└', { font: '20px monospace', color: '#444466' }).setDepth(42),
      this.add.text(bx+bw-18,    by+bh-24,    '┘', { font: '20px monospace', color: '#444466' }).setDepth(42),
    ];

    // GAME OVER title — drops in
    const goTxt = this.add.text(cx, by + 44, 'GAME OVER', {
      font: 'bold 40px monospace', color: '#FFFFFF', letterSpacing: 6
    }).setOrigin(0.5, 0).setDepth(42).setAlpha(0).setY(by + 20);
    this.tweens.add({ targets: goTxt, y: by + 44, alpha: 1, duration: 400, delay: 300, ease: 'Back.Out' });

    // Subtitle / msg
    const subTxt = this.add.text(cx, by + 96, `— ${msg} —`, {
      font: '13px monospace', color: color, letterSpacing: 3
    }).setOrigin(0.5, 0).setDepth(42).setAlpha(0);
    this.tweens.add({ targets: subTxt, alpha: 1, duration: 500, delay: 600 });

    // Divider line
    const line = this.add.rectangle(cx, by + 124, 0, 1, 0x333355).setDepth(42);
    this.tweens.add({ targets: line, width: bw - 40, duration: 400, delay: 700 });

    // "TOTAL SKOR" label
    const lblTxt = this.add.text(cx, by + 138, 'TOTAL SKOR', {
      font: '12px monospace', color: '#666688', letterSpacing: 4
    }).setOrigin(0.5, 0).setDepth(42).setAlpha(0);
    this.tweens.add({ targets: lblTxt, alpha: 1, duration: 300, delay: 900 });

    // Score — count up animation
    const scoreTxt = this.add.text(cx, by + 158, '000000', {
      font: 'bold 48px monospace', color: '#FFD700'
    }).setOrigin(0.5, 0).setDepth(42).setAlpha(0);
    this.tweens.add({ targets: scoreTxt, alpha: 1, duration: 300, delay: 950 });
    const finalScore = this.score;
    let displayed = 0;
    this.time.addEvent({
      delay: 30, repeat: 40, startAt: 0,
      callback: () => {
        displayed = Math.min(displayed + Math.ceil(finalScore / 40), finalScore);
        scoreTxt.setText(String(displayed).padStart(6, '0'));
      }
    });

    // Second divider
    const line2 = this.add.rectangle(cx, by + 222, 0, 1, 0x333355).setDepth(42);
    this.tweens.add({ targets: line2, width: bw - 40, duration: 400, delay: 1200 });

    // Level + Grade boxes
    const boxY = by + 234;
    const boxW = (bw - 60) / 2;

    // Level box
    this.add.rectangle(cx - boxW/2 - 5, boxY + 36, boxW, 72, 0x1a1a2e)
      .setDepth(41).setStrokeStyle(1, 0x333355).setAlpha(0)
      .setInteractive(false);
    const levelBox = this.add.rectangle(cx - boxW/2 - 5, boxY + 36, boxW, 72, 0x1a1a2e)
      .setDepth(42).setStrokeStyle(1, 0x333355).setAlpha(0);
    this.tweens.add({ targets: levelBox, alpha: 1, duration: 300, delay: 1300 });
    const lvlLbl = this.add.text(cx - boxW/2 - 5, boxY + 14, 'LEVEL', {
      font: '11px monospace', color: '#666688', letterSpacing: 3
    }).setOrigin(0.5, 0).setDepth(43).setAlpha(0);
    const lvlVal = this.add.text(cx - boxW/2 - 5, boxY + 34, String(this.level), {
      font: 'bold 28px monospace', color: '#FFFFFF'
    }).setOrigin(0.5, 0).setDepth(43).setAlpha(0);
    this.tweens.add({ targets: [lvlLbl, lvlVal], alpha: 1, duration: 300, delay: 1350 });

    // Grade box
    const gradeBox = this.add.rectangle(cx + boxW/2 + 5, boxY + 36, boxW, 72, 0x1a1a2e)
      .setDepth(42).setStrokeStyle(1, 0x333355).setAlpha(0);
    this.tweens.add({ targets: gradeBox, alpha: 1, duration: 300, delay: 1400 });
    const gradeLbl = this.add.text(cx + boxW/2 + 5, boxY + 14, 'GRADE', {
      font: '11px monospace', color: '#666688', letterSpacing: 3
    }).setOrigin(0.5, 0).setDepth(43).setAlpha(0);
    const gradeVal = this.add.text(cx + boxW/2 + 5, boxY + 30, grade, {
      font: 'bold 32px monospace', color: color
    }).setOrigin(0.5, 0).setDepth(43).setAlpha(0).setScale(0.4);
    this.tweens.add({ targets: [gradeLbl], alpha: 1, duration: 300, delay: 1450 });
    this.tweens.add({ targets: gradeVal, alpha: 1, scaleX: 1, scaleY: 1, duration: 400, delay: 1500, ease: 'Back.Out' });

    // MAIN LAGI button
    const btnY = by + panelH - 58;
    const btn = this.add.text(cx, btnY, '  ▶  MAIN LAGI  ', {
      font: 'bold 18px monospace', color: '#CCCCCC',
      backgroundColor: '#222233',
      padding: { x: 20, y: 12 }
    }).setOrigin(0.5, 0).setDepth(43).setAlpha(0).setInteractive({ useHandCursor: true });

    this.tweens.add({ targets: btn, alpha: 1, duration: 400, delay: 1800 });

    // Pulse animation on button
    this.time.delayedCall(2000, () => {
      if (!btn.active) return;
      this.tweens.add({ targets: btn, alpha: 0.6, duration: 600, yoyo: true, repeat: -1 });
    });

    btn.on('pointerover', () => { btn.setColor('#FFD700'); this.tweens.killTweensOf(btn); btn.setAlpha(1); });
    btn.on('pointerout', () => { btn.setColor('#CCCCCC'); });
    btn.on('pointerdown', () => this.scene.restart());

    // Grade S special effect — sparks
    if (grade === 'S') {
      this.time.delayedCall(1600, () => {
        for (let i = 0; i < 20; i++) {
          this.time.delayedCall(i * 80, () => {
            const spark = this.add.text(
              Phaser.Math.Between(bx+10, bx+bw-10),
              Phaser.Math.Between(by+10, by+panelH-10),
              '★', { font: '16px Arial', color: '#FFD700' }
            ).setDepth(44).setAlpha(1);
            this.tweens.add({ targets: spark, alpha: 0, y: spark.y - 30, duration: 600, onComplete: () => spark.destroy() });
          });
        }
      });
    }
  }

  update() {
    if (this.gameOverFlag) return;
    this.stars.forEach(s => { s.y += s.speed; if (s.y > this.H) s.y = -4; });
    const spd = 260;
    this.player.setVelocityX(0);
    if (this.cursors.left.isDown || this.wasd.A.isDown) this.player.setVelocityX(-spd);
    else if (this.cursors.right.isDown || this.wasd.D.isDown) this.player.setVelocityX(spd);
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || this.cursors.up.isDown) this._shoot();
    this.player.setFlipX(this.player.body.velocity.x < 0);
    this.shieldSpr.setPosition(this.player.x, this.player.y);
    this.shieldRing.setPosition(this.player.x, this.player.y);
    this.bullets.getChildren().forEach(b => { if (b.y < -20) b.destroy(); });
    this.pups.getChildren().forEach(p => { if (p.y > this.H + 30) p.destroy(); });
  }
}