var sceneMenu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:
    function () {
        Phaser.Scene.call(this, { key: "sceneMenu" });
    },

    init: function () {},

    preload: function () {

        this.load.setBaseURL('assets/');

        this.load.image("BGPlay", "BGPlay.png");
        this.load.image("Title", "Title.png");
        this.load.image("ButtonPlay", "ButtonPlay.png");
        this.load.image("ButtonSoundOn", "ButtonSoundOn.png");
        this.load.image("ButtonSoundOff", "ButtonSoundOff.png");
        this.load.image("ButtonMusicOn", "ButtonMusicOn.png");
        this.load.image("ButtonMusicOff", "ButtonMusicOff.png");

        this.load.audio("snd_menu", "music_menu.mp3");
        this.load.audio("snd_touchshooter", "fx_touch.mp3");
    },

    create: function () {

        X_POSITION = {
            LEFT: 0,
            CENTER: game.canvas.width / 2,
            RIGHT: game.canvas.width
        };

        Y_POSITION = {
            TOP: 0,
            CENTER: game.canvas.height / 2,
            BOTTOM: game.canvas.height
        };

        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, "BGPlay");

        var titleGame = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER - 150, "Title");

        var buttonPlay = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER + 150, "ButtonPlay");

        buttonPlay.setInteractive();

        this.input.on('gameobjectover', function (pointer, gameObject) {
            if (gameObject === buttonPlay) {
                buttonPlay.setTint(0x999999);
            }
        }, this);

        this.input.on('gameobjectout', function (pointer, gameObject) {
            if (gameObject === buttonPlay) {
                buttonPlay.setTint(0xffffff);
            }
        }, this);

        this.input.on('gameobjectup', function (pointer, gameObject) {
            if (gameObject === buttonPlay) {
                buttonPlay.setTint(0xffffff);
                this.scene.start("scenePilihHero");
            }
        }, this);
    },

    update: function () {}

});