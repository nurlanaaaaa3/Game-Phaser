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

  _gameOver() {
    this.gameOverFlag = true;
    this.physics.pause();
    this.spawnTimer.remove();
    this.add.rectangle(this.W/2, this.H/2, this.W, this.H, 0x000000, 0.72).setDepth(40);
    this.add.text(this.W/2, this.H/2 - 80, '😵 GAME OVER!', { font: 'bold 34px monospace', color: '#FF4444' }).setOrigin(0.5).setDepth(41);
    this.add.text(this.W/2, this.H/2 - 28, `Score: ${this.score}`, { font: '24px monospace', color: '#FFFF44' }).setOrigin(0.5).setDepth(41);
    this.add.text(this.W/2, this.H/2 + 12, `Level: ${this.level}`, { font: '18px monospace', color: '#FF69B4' }).setOrigin(0.5).setDepth(41);
    const btn = this.add.text(this.W/2, this.H/2 + 60, '[ MAIN LAGI ]', {
      font: '22px monospace', color: '#9FE1CB', backgroundColor: '#0F3030', padding: { x: 16, y: 8 }
    }).setOrigin(0.5).setDepth(41).setInteractive({ useHandCursor: true });
    btn.on('pointerover', () => btn.setColor('#5DCAA5'));
    btn.on('pointerout', () => btn.setColor('#9FE1CB'));
    btn.on('pointerdown', () => this.scene.restart());
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
