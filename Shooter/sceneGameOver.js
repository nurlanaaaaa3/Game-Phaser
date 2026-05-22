var sceneGameOver = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, { key: "sceneGameOver"});
    },
    init: function () {},
    preload: function () {
        this.load.setBaseURL('assets/');
        this.load.image("BGPlay", "BGPlay.png");
        this.load.image("ButtonPlay", "ButtonPlay.png");
        this.load.audio("snd_gameover", "music_gameover.mp3");
        this.load.audio("snd_touchshooter", "fx_touch.mp3");
    },
    create: function () {},
    update: function () {},
});