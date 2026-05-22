var scenePilihHero = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, { key: "scenePilihHero"});
    },
    init: function () {},
    preload: function () {
        this.load.setBaseURL('assets/');
        this.load.image("BGPilihPesawat", "BGPilihPesawat.png");
        this.load.image("ButtonMenu", "ButtonMenu.png");
        this.load.image("ButtonNext", "ButtonNext.png");
        this.load.image("ButtonPrev", "ButtonPrev.png");
        this.load.image("Pesawat1", "Pesawat1.png");
        this.load.image("Pesawat2", "Pesawat2.png");
    },
    
    create: function () {
        this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'BGPilihPesawat');
        var buttonMenu = this.add.image(50, 50, 'ButtonMenu');
        var buttonNext = this.add.image(X_POSITION.CENTER + 250, Y_POSITION.CENTER, 'ButtonNext');
        var buttonPrevisous = this.add.image(X_POSITION.CENTER - 250, Y_POSITION.CENTER, 'ButtonPrev');
        var heroShip = this.add.image(X_POSITION.CENTER, Y_POSITION.CENTER, 'Pesawat' + (currentHero + 1));

        buttonMenu.setInteractive();
        buttonNext.setInteractive();
        buttonPrevisous.setInteractive();
        heroShip.setInteractive();

        this.input.on('gameobjectover', function(pointer, gameObject){
            if(gameObject == buttonMenu) buttonMenu.setTint(0x999999);
            if(gameObject == buttonNext) buttonNext.setTint(0x999999);
            if(gameObject == buttonPrevisous) buttonPrevisous.setTint(0x999999);
            if(gameObject == heroShip) heroShip.setTint(0x999999);
        }, this);

        this.input.on('gameobjectdown', function(pointer, gameObject){
            if(gameObject == buttonMenu) buttonMenu.setTint(0x999999);
            if(gameObject == buttonNext) buttonNext.setTint(0x999999);
            if(gameObject == buttonPrevisous) buttonPrevisous.setTint(0x999999);
            if(gameObject == heroShip) heroShip.setTint(0x999999);
        }, this);

        this.input.on('gameobjectout', function(pointer, gameObject){
            if(gameObject == buttonMenu) buttonMenu.setTint(0xffffff);
            if(gameObject == buttonNext) buttonNext.setTint(0xffffff);
            if(gameObject == buttonPrevisous) buttonPrevisous.setTint(0xffffff);
            if(gameObject == heroShip) heroShip.setTint(0xffffff);
        }, this);

        this.input.on('gameobjectup', function(pointer, gameObject){
            if(gameObject == buttonMenu){
                buttonMenu.setTint(0xffffff);
                this.scene.start("sceneMenu");
            }
            if(gameObject == buttonNext){
                buttonNext.setTint(0xffffff);
                currentHero++;
                if(currentHero >= countHero) currentHero = 0;
                heroShip.setTexture('Pesawat' + (currentHero + 1));
            }
            if(gameObject == buttonPrevisous){
                buttonPrevisous.setTint(0xffffff);
                currentHero--;
                if(currentHero < 0) currentHero = (countHero - 1);
                heroShip.setTexture('Pesawat' + (currentHero + 1));
            }
            if(gameObject == heroShip){
                heroShip.setTint(0xffffff);
                this.scene.start("scenePlay");
            }
        }, this);
    },
    update: function () {},
});