var scenePlay = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, { key: "scenePlay"});
    },
    init: function () {},
    preload: function () {
        this.load.setBaseURL('assets/');
        this.load.image("BG1", "BG1.png");
        this.load.image("BG2", "BG2.png");
        this.load.image("BG3", "BG3.png");
        this.load.image("GroundTransisi", "Transisi.png");
        this.load.image("Pesawat1", "Pesawat1.png");
        this.load.image("Pesawat2", "Pesawat2.png");
        this.load.image("Peluru", "Peluru.png");
        this.load.image("EfekLedakan", "EfekLedakan.png");
        this.load.image("cloud", "cloud.png");
        this.load.image("Musuh1", "Musuh1.png");
        this.load.image("Musuh2", "Musuh2.png");
        this.load.image("Musuh3", "Musuh3.png");
        this.load.image("MusuhBos", "MusuhBos.png");
        this.load.audio("snd_shoot", "music_menu.mp3");
        this.load.audio("snd_explode", "fx_explode.mp3");
        this.load.audio("snd_play", "music_play.mp3");
    },

    create: function () {
        this.lastBgIndex = Phaser.Math.Between(1, 3);
        this.bgBottomSize = { width: 768, height: 1664 };
        this.arrBgBottom = [];

        this.createBGBottom = function(xPos, yPos) {
            let bgBottom = this.add.image(xPos, yPos, 'BG' + this.lastBgIndex);
            bgBottom.setData('Kecepatan', 3);
            bgBottom.setDepth(1);
            bgBottom.flipX = Phaser.Math.Between(0, 1);
            this.arrBgBottom.push(bgBottom);

            let newBgIndex = Phaser.Math.Between(1, 3);
            if (newBgIndex != this.lastBgIndex) {
                let bgBottomAdditon = this.add.image(xPos, yPos - this.bgBottomSize.height / 2, 'GroundTransisi');
                bgBottomAdditon.setData('Kecepatan', 3);
                bgBottomAdditon.setData('tambahan', true);
                bgBottomAdditon.setDepth(2);
                bgBottomAdditon.flipX = Phaser.Math.Between(0, 1);
                this.arrBgBottom.push(bgBottomAdditon);
            }
            this.lastBgIndex = newBgIndex;
        };

        this.addBGBottom = function() {
            if (this.arrBgBottom.length > 0) {
                let lastBG = this.arrBgBottom[this.arrBgBottom.length - 1];
                if (lastBG.getData('tambahan')) {
                    lastBG = this.arrBgBottom[this.arrBgBottom.length - 2];
                }
                this.createBGBottom(game.canvas.width / 2, lastBG.y - this.bgBottomSize.height);
            } else {
                this.createBGBottom(game.canvas.width / 2, game.canvas.height - this.bgBottomSize.height / 2);
            }
        };

        this.addBGBottom();
        this.addBGBottom();
        this.addBGBottom();

        this.bgCloundSize = { 'width': 768, 'height': 1962 };
        this.arrBgTop = [];

        this.createBGTop = function(xPos, yPos) {
            var bgTop = this.add.image(xPos, yPos, 'cloud');
            bgTop.setData('kecepatan', 6);
            bgTop.setDepth(5);
            bgTop.flipX = Phaser.Math.Between(0, 1);
            bgTop.setAlpha(Phaser.Math.Between(4, 7) / 10);
            this.arrBgTop.push(bgTop);
        };

        this.addBGTop = function() {
            if (this.arrBgTop.length > 0) {
                let lastBG = this.arrBgTop[this.arrBgTop.length - 1];
                this.createBGTop(game.canvas.width / 2, lastBG.y - this.bgCloundSize.height * Phaser.Math.Between(1, 4));
            } else {
                this.createBGTop(game.canvas.width / 2, -this.bgCloundSize.height);
            }
        };

        this.addBGTop();

        this.scoreValue = 0;
        this.scoreLabel = this.add.text(X_POSITION.CENTER, Y_POSITION.TOP + 80, '0', {
            fontFamily: 'Verdana, Arial',
            fontSize: '70px',
            color: '#ffffff',
            stroke: '#5c5c5c',
            strokeThickness: 2
        });
        this.scoreLabel.setOrigin(0.5);
        this.scoreLabel.setDepth(100);

        this.heroShip = this.add.image(X_POSITION.CENTER, Y_POSITION.BOTTOM - 200, 'Pesawat' + (currentHero + 1));
        this.heroShip.setDepth(4);
        this.heroShip.setScale(0.35);

        this.cursorKeys = this.input.keyboard.createCursorKeys();

        this.lastPointer = { x: X_POSITION.CENTER, y: Y_POSITION.BOTTOM - 200 };
        this.input.on('pointermove', function(pointer) {
            this.lastPointer = { x: pointer.x, y: pointer.y };
        }, this);

        this.points = [];

        let pointA = [];
        pointA.push(new Phaser.Math.Vector2(-200, 100));
        pointA.push(new Phaser.Math.Vector2(250, 200));
        pointA.push(new Phaser.Math.Vector2(200, (Y_POSITION.BOTTOM + 200) / 2));
        pointA.push(new Phaser.Math.Vector2(200, Y_POSITION.BOTTOM + 200));

        let pointB = [];
        pointB.push(new Phaser.Math.Vector2(900, 100));
        pointB.push(new Phaser.Math.Vector2(550, 200));
        pointB.push(new Phaser.Math.Vector2(500, (Y_POSITION.BOTTOM + 200) / 2));
        pointB.push(new Phaser.Math.Vector2(500, Y_POSITION.BOTTOM + 200));

        let pointC = [];
        pointC.push(new Phaser.Math.Vector2(900, 100));
        pointC.push(new Phaser.Math.Vector2(500, 200));
        pointC.push(new Phaser.Math.Vector2(400, (Y_POSITION.BOTTOM + 200) / 2));
        pointC.push(new Phaser.Math.Vector2(0, Y_POSITION.BOTTOM + 200));

        let pointD = [];
        pointD.push(new Phaser.Math.Vector2(-200, 100));
        pointD.push(new Phaser.Math.Vector2(550, 200));
        pointD.push(new Phaser.Math.Vector2(650, (Y_POSITION.BOTTOM + 200) / 2));
        pointD.push(new Phaser.Math.Vector2(0, Y_POSITION.BOTTOM + 200));

        this.points.push(pointA);
        this.points.push(pointB);
        this.points.push(pointC);
        this.points.push(pointD);

        this.arrEnemies = [];

        var points = this.points;

        var Enemy = new Phaser.Class({
            Extends: Phaser.GameObjects.Image,
            initialize:
            function Enemy(scene, idxPath) {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Musuh' + Phaser.Math.Between(1, 3));
                this.setDepth(4);
                this.setScale(0.35);
                this.curve = new Phaser.Curves.Spline(points[idxPath]);
                let lastEnemyCreated = this;
                this.path = { t: 0, vec: new Phaser.Math.Vector2() };
                scene.tweens.add({
                    targets: this.path,
                    t: 1,
                    duration: 3000,
                    onComplete: function() {
                        if (lastEnemyCreated) {
                            lastEnemyCreated.setActive(false);
                        }
                    }
                });
            },
            move: function() {
                this.curve.getPoint(this.path.t, this.path.vec);
                this.x = this.path.vec.x;
                this.y = this.path.vec.y;
            }
        });

        this.EnemyClass = Enemy;

        this.time.addEvent({
            delay: 250, callback: function() {
                if (this.arrEnemies.length < 3) {
                    this.arrEnemies.push(this.children.add(new this.EnemyClass(this, Phaser.Math.Between(0, this.points.length - 1))));
                }
            }, callbackScope: this, loop: true
        });

        var Bullet = new Phaser.Class({
            Extends: Phaser.GameObjects.Image,
            initialize:
            function Bullet(scene, x, y) {
                Phaser.GameObjects.Image.call(this, scene, 0, 0, 'Peluru');
                this.setDepth(3);
                this.setPosition(x, y);
                this.setScale(0.5);
                this.speed = Phaser.Math.GetSpeed(20000, 1);
            },
            move: function() {
                this.y -= this.speed;
                if (this.y < -50) {
                    this.setActive(false);
                }
            }
        });

        this.BulletClass = Bullet;
        this.arrBullets = [];

        this.time.addEvent({
            delay: 250, callback: function() {
                this.arrBullets.push(this.children.add(new this.BulletClass(this, this.heroShip.x, this.heroShip.y - 30)));
            }, callbackScope: this, loop: true
        });

        let partikelExplode = this.add.particles('EfekLedakan');
        partikelExplode.setDepth(4);

        this.emiterExplode1 = partikelExplode.createEmitter({
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.8, end: 0 },
            blendMode: 'SCREEN',
            lifespan: 200,
            tint: 0xffa500
        });
        this.emiterExplode1.setPosition(-100, -100);
        this.emiterExplode1.explode(10, -100, -100);

        this.emiterExplode2 = partikelExplode.createEmitter({
            speed: { min: -400, max: 400 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'SCREEN',
            lifespan: 300,
            tint: 0xff4500
        });
        this.emiterExplode2.setPosition(-100, -100);
        this.emiterExplode2.explode(10, -100, -100);
    },

    update: function (time, delta) {
        // Gerak background bawah
        for (let i = 0; i < this.arrBgBottom.length; i++) {
            this.arrBgBottom[i].y += this.arrBgBottom[i].getData('Kecepatan');
            if (this.arrBgBottom[i].y >= game.canvas.height + this.bgBottomSize.height / 2) {
                this.addBGBottom();
                this.arrBgBottom[i].destroy();
                this.arrBgBottom.splice(i, 1);
                break;
            }
        }

        // Gerak background atas
        for (let i = 0; i < this.arrBgTop.length; i++) {
            this.arrBgTop[i].y += this.arrBgTop[i].getData('kecepatan');
            if (this.arrBgTop[i].y >= game.canvas.height + this.bgCloundSize.height / 2) {
                this.arrBgTop[i].destroy();
                this.arrBgTop.splice(i, 1);
                this.addBGTop();
                break;
            }
        }

        // Kontrol pointer
        var pointer = this.lastPointer;
        let movementX = this.heroShip.x;
        let movementY = this.heroShip.y;

        if (pointer.x > 70 && pointer.x < (X_POSITION.RIGHT - 70)) {
            movementX = pointer.x;
        } else {
            movementX = pointer.x <= 70 ? 70 : (X_POSITION.RIGHT - 70);
        }

        if (pointer.y > 70 && pointer.y < (Y_POSITION.BOTTOM - 70)) {
            movementY = pointer.y;
        } else {
            movementY = pointer.y <= 70 ? 70 : (Y_POSITION.BOTTOM - 70);
        }

        let a = this.heroShip.x - movementX;
        let b = this.heroShip.y - movementY;
        let durationToMove = Math.sqrt(a * a + b * b) * 0.8;

        this.tweens.add({
            targets: this.heroShip,
            x: movementX,
            y: movementY,
            duration: durationToMove,
        });

        // Kontrol keyboard
        if (this.cursorKeys.left.isDown && this.heroShip.x > 70) {
            this.heroShip.x -= 7;
        }
        if (this.cursorKeys.right.isDown && this.heroShip.x < (X_POSITION.RIGHT - 70)) {
            this.heroShip.x += 7;
        }
        if (this.cursorKeys.up.isDown && this.heroShip.y > 70) {
            this.heroShip.y -= 7;
        }
        if (this.cursorKeys.down.isDown && this.heroShip.y < (Y_POSITION.BOTTOM - 70)) {
            this.heroShip.y += 7;
        }

        // Gerakkan peluru
        for (let i = 0; i < this.arrBullets.length; i++) {
            this.arrBullets[i].move();
        }

        // Hapus peluru tidak aktif
        for (let i = 0; i < this.arrBullets.length; i++) {
            if (!this.arrBullets[i].active) {
                this.arrBullets[i].destroy();
                this.arrBullets.splice(i, 1);
                break;
            }
        }

        // Gerakkan musuh
        for (let i = 0; i < this.arrEnemies.length; i++) {
            this.arrEnemies[i].move();
        }

        // Hapus musuh tidak aktif
        for (let i = 0; i < this.arrEnemies.length; i++) {
            if (!this.arrEnemies[i].active) {
                this.arrEnemies[i].destroy();
                this.arrEnemies.splice(i, 1);
                break;
            }
        }

        // Deteksi tabrakan peluru dengan musuh
        for (let i = 0; i < this.arrEnemies.length; i++) {
            for (let j = 0; j < this.arrBullets.length; j++) {
                if (this.arrEnemies[i].getBounds().contains(this.arrBullets[j].x, this.arrBullets[j].y)) {
                    this.arrEnemies[i].setActive(false);
                    this.arrBullets[j].setActive(false);
                    this.scoreValue++;
                    this.scoreLabel.setText(this.scoreValue);
                    this.emiterExplode1.setPosition(this.arrBullets[j].x, this.arrBullets[j].y);
                    this.emiterExplode2.setPosition(this.arrBullets[j].x, this.arrBullets[j].y);
                    this.emiterExplode1.explode(10, this.arrBullets[j].x, this.arrBullets[j].y);
                    this.emiterExplode2.explode(10, this.arrBullets[j].x, this.arrBullets[j].y);
                    break;
                }
            }
        }
    },
});