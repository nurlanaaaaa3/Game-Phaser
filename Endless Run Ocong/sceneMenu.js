var sceneMenu = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, {"key": "sceneMenu"});
    },
    init() {},
    preload: function() {
        this.load.setBaseURL('assets');
        this.load.image('bg_start', 'images/bg_start.png');
        this.load.image('btn_play', 'images/btn_play.png');
        this.load.image('title_game', 'images/title_game.png');
        this.load.image('panel_skor', 'images/panel_skor.png');
        this.load.audio('snd_ambience', 'audio/ambience.mp3');
        this.load.audio('snd_touch', 'audio/touch.mp3');
        this.load.audio('snd_transisi_menu', 'audio/transisi_menu.mp3');
        this.load.spritesheet('sps_mummy', 'sprite/mummy37x45.png', {frameWidth: 37, frameHeight: 45});
    },

    create: function() {
        X_POSITION = {
            LEFT: 0,
            CENTER: game.canvas.width / 2,
            RIGHT: game.canvas.width,
        };

        Y_POSITION = {
            TOP: 0,
            CENTER: game.canvas.height / 2,
            BOTTOM: game.canvas.height,
        };
        
        if(snd_ambience == null){
            snd_ambience = this.sound.add('snd_ambience');
            snd_ambience.loop = true;
            snd_ambience.setVolume(0.35);
            snd_ambience.play();
        }

        this.snd_touch = this.sound.add('snd_touch');
        var snd_transisi = this.sound.add('snd_transisi_menu');

        var skorTertinggi = localStorage["highscore"] || 0;

        // FIX: hanya 1 background
        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'bg_start');

        // menambahkan sprite mummy
        var mummy = this.add.sprite(1024/2, 768-170, 'sps_mummy');
        mummy.setDepth(5);
        mummy.setScale(3);
        
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('sps_mummy', { start: 0, end: 17 }),
            frameRate: 16,
        });
        mummy.play({key: 'walk', repeat:-1});

        // menambahkan judul game
        this.titleGame = this.add.image(1024/2, 200, 'title_game');
        this.titleGame.setDepth(10);
        this.titleGame.y -= 384;
        this.titleGame.setScale(0); // FIX: pindah ke sini sebelum tween

        // membuat panel nilai
        var panelSkor = this.add.image(1024/2, 768-120, 'panel_skor');
        panelSkor.setOrigin(0.5);

        var lblSkor = this.add.text(panelSkor.x + 25, panelSkor.y, "High Score : " + skorTertinggi);
        lblSkor.setOrigin(0.5);
        lblSkor.setDepth(10);
        lblSkor.setFontSize(30);
        lblSkor.setTint(0xff732e);

        var diz = this;

        // animasi judul game
        this.tweens.add({
            targets: diz.titleGame,
            ease: 'Elastic',
            duration: 750,
            delay: 1000,
            scaleX: 1,
            scaleY: 1,
            onComplete: function() {
                snd_transisi.play();
            }
        });

        // FIX: hanya 1 btnPlay, langsung setInteractive sebelum event
        var btnPlay = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, "btn_play");
        btnPlay.setDepth(10);
        btnPlay.setScale(0);
        btnPlay.setInteractive(); // FIX: dipindah ke sini sebelum event listener

        // animasi tombol play
        this.tweens.add({
            targets: btnPlay,
            ease: 'Back',
            duration: 500,
            delay: 750,
            scaleX: 1,
            scaleY: 1
        });

        var btnClicked = false; // FIX: dipindah ke atas sebelum event listener

        this.input.on('gameobjectover', function (pointer, gameObject){
            if(!btnClicked) return;
            if(gameObject == btnPlay) {
                btnPlay.setTint(0x616161);
            }
        }, this);

        this.input.on('gameobjectout', function (pointer, gameObject){
            if(!btnClicked) return;
            if(gameObject == btnPlay) {
                btnPlay.setTint(0xffffff);
                btnClicked = true;
            }
        }, this);

        this.input.on('gameobjectdown', function (pointer, gameObject){
            if(gameObject == btnPlay){
                btnPlay.setTint(0x616161);
                btnClicked = true;
            }
        }, this);

        // FIX: gamObject -> gameObject
        this.input.on('gameobjectup', function(pointer, gameObject){
            if(gameObject == btnPlay){
                btnPlay.setTint(0xffffff);
                this.snd_touch.play();
                this.scene.start('scenePlay');
            }
        }, this);

        this.input.on('pointerup', function(pointer){
            btnClicked = false;
        }, this);
    },
    update() {}
});