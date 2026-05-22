// main.js

const W = Math.min(480, window.innerWidth - 16);
const H = Math.round(W * 1.45);

const config = {
  type: Phaser.AUTO,
  width: W,
  height: H,
  parent: 'game-container',
  backgroundColor: '#1a0a2e',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 0 }, debug: false }
  },
  scene: [GameScene]
};

window.game = new Phaser.Game(config);
