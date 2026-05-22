//membuat sebuah class dengan nama bullet yang nantinya
//akan digunakan berulang-ulang untuk membuat objek peluru
var Bullet = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
    //fungsi utama untuk membuat objek peluru ketika class dipanggil
    function Bullet (scene, x, y) {
        Phaser.GameObjects.Image.call (this, scene,0, 0, 'Peluru');
        this.setDepth(3);
        this.setPosition(x, y);
        this.setScale(0.5);
        //menentukan kecepatan pergerakan dari peluru yang di tampung
        //di dalam class, yakni 20000 piksel tiap detik
        this.speed = Phaser.Math.GetSpeed(20000, 1);
    },
    //fungsi tambahan dengan nama 'move' yang nantinya 
    //akan digunakan untuk menggerakkan peluru
    move: function() {
        //memindahkan posisi 'y' peluru untuk
        //membuat peluru dapat bergerak naik 
        this.y -= this.speed;
        //melakukan pengecekan batas untuk
        //bergerak paling atas untuk peluru
        if(this.y -50){
            //menggantikan status dari objek peluru menjadi 
            //tidak aktif (hanya menandai saja)
            this.setActive(false);
        }
    }
});