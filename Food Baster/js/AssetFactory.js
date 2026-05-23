// AssetFactory.js
// Generates all game textures procedurally using Phaser Graphics API

const AssetFactory = {

  createAll(scene) {
    this.createPlayer(scene);
    this.createBullet(scene);
    this.createFoods(scene);
    this.createExplosion(scene);
    this.createStars(scene);
    this.createBomb(scene);
    this.createShield(scene);
    this.createPlatform(scene);
  },

  // Player: food chef with a fork-gun
  createPlayer(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    // Body - chef coat
    g.fillStyle(0xFFFFFF);
    g.fillRoundedRect(10, 22, 36, 30, 6);
    // Buttons
    g.fillStyle(0xCCCCCC);
    g.fillCircle(28, 28, 2);
    g.fillCircle(28, 35, 2);
    g.fillCircle(28, 42, 2);
    // Head
    g.fillStyle(0xFFD700);
    g.fillCircle(28, 16, 12);
    // Eyes
    g.fillStyle(0x222222);
    g.fillCircle(24, 14, 2);
    g.fillCircle(32, 14, 2);
    // Smile
    g.lineStyle(2, 0x222222);
    g.beginPath();
    g.arc(28, 18, 5, 0.3, Math.PI - 0.3);
    g.strokePath();
    // Chef hat
    g.fillStyle(0xFFFFFF);
    g.fillRect(18, 0, 20, 8);
    g.fillRoundedRect(14, 5, 28, 10, 3);
    // Fork-gun arm
    g.fillStyle(0xFFD700);
    g.fillRect(44, 30, 18, 6);
    // Fork prongs
    g.fillStyle(0xC0C0C0);
    g.fillRect(58, 24, 3, 8);
    g.fillRect(63, 24, 3, 8);
    g.fillRect(68, 24, 3, 8);
    // Fork handle
    g.fillStyle(0x8B4513);
    g.fillRect(46, 31, 12, 4);
    // Legs
    g.fillStyle(0x333399);
    g.fillRect(14, 50, 12, 16);
    g.fillRect(30, 50, 12, 16);
    // Shoes
    g.fillStyle(0x222222);
    g.fillRoundedRect(12, 62, 14, 6, 3);
    g.fillRoundedRect(28, 62, 14, 6, 3);

    g.generateTexture('player', 76, 70);
    g.destroy();
  },

  // Bullet: mini star/sparkle
  createBullet(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xFFFF00);
    // Star shape
    const cx = 8, cy = 8, r1 = 7, r2 = 3, pts = 5;
    const points = [];
    for (let i = 0; i < pts * 2; i++) {
      const angle = (i * Math.PI) / pts - Math.PI / 2;
      const r = i % 2 === 0 ? r1 : r2;
      points.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    g.fillPoints(points, true);
    g.fillStyle(0xFFFFAA);
    g.fillCircle(cx, cy, 3);
    g.generateTexture('bullet', 16, 16);
    g.destroy();
  },

  // Bomb powerup: round bomb
  createBomb(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x222222);
    g.fillCircle(14, 16, 12);
    g.fillStyle(0x444444);
    g.fillCircle(11, 13, 4);
    // Fuse
    g.lineStyle(3, 0x8B4513);
    g.beginPath();
    g.moveTo(14, 4);
    g.bezierCurveTo(20, -2, 26, 2, 24, 8);
    g.strokePath();
    // Spark
    g.fillStyle(0xFFAA00);
    g.fillCircle(24, 8, 3);
    g.generateTexture('bomb', 30, 30);
    g.destroy();
  },

  // Shield powerup
  createShield(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x00AAFF);
    g.fillRoundedRect(2, 2, 26, 30, 8);
    g.fillStyle(0x0088CC);
    g.fillRoundedRect(5, 5, 20, 24, 6);
    g.fillStyle(0xAADDFF);
    g.fillRect(13, 6, 4, 18);
    g.fillRect(7, 12, 16, 4);
    g.generateTexture('shield', 30, 34);
    g.destroy();
  },

  // Stars for background
  createStars(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xFFFFFF);
    g.fillCircle(2, 2, 2);
    g.generateTexture('star_big', 4, 4);
    g.clear();
    g.fillStyle(0xCCCCCC);
    g.fillRect(0, 0, 2, 2);
    g.generateTexture('star_small', 2, 2);
    g.destroy();
  },

  // Explosion
  createExplosion(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    const colors = [0xFF6B00, 0xFF0000, 0xFFAA00, 0xFFFF00, 0xFF4444];
    const cx = 24, cy = 24;
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const r = 12 + (i % 3) * 6;
      const size = 4 + (i % 4) * 2;
      g.fillStyle(colors[i % colors.length]);
      g.fillCircle(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, size);
    }
    g.fillStyle(0xFFFF88);
    g.fillCircle(cx, cy, 10);
    g.generateTexture('explosion', 48, 48);
    g.destroy();
  },

  // Ground platform
  createPlatform(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x8B4513);
    g.fillRect(0, 0, 480, 16);
    g.fillStyle(0xA0522D);
    g.fillRect(0, 0, 480, 6);
    g.fillStyle(0x654321);
    for (let i = 0; i < 480; i += 30) {
      g.fillRect(i, 6, 28, 4);
    }
    g.generateTexture('platform', 480, 16);
    g.destroy();
  },

  // ---- FOOD ITEMS ----

  createFoods(scene) {
    this.createPizza(scene);
    this.createBurger(scene);
    this.createDonut(scene);
    this.createTacos(scene);
    this.createIceCream(scene);
    this.createSushi(scene);
    this.createChicken(scene);
    this.createWatermelon(scene);
  },

  createPizza(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    // Crust
    g.fillStyle(0xDEB887);
    g.fillTriangle(24, 0, 0, 44, 48, 44);
    // Sauce
    g.fillStyle(0xCC2200);
    g.fillTriangle(24, 6, 4, 40, 44, 40);
    // Cheese
    g.fillStyle(0xFFDD44);
    g.fillTriangle(24, 10, 8, 38, 40, 38);
    // Toppings - pepperoni
    g.fillStyle(0xAA0000);
    g.fillCircle(20, 20, 5);
    g.fillCircle(30, 28, 5);
    g.fillCircle(24, 30, 4);
    // Dots on pepperoni
    g.fillStyle(0xCC3333);
    g.fillCircle(20, 20, 2);
    g.fillCircle(30, 28, 2);
    g.generateTexture('pizza', 48, 46);
    g.destroy();
  },

  createBurger(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    // Top bun
    g.fillStyle(0xDEB887);
    g.fillEllipse(26, 10, 44, 22);
    g.fillStyle(0xC8963E);
    g.fillEllipse(26, 8, 44, 18);
    // Sesame seeds
    g.fillStyle(0xFFFFAA);
    g.fillEllipse(18, 6, 5, 3);
    g.fillEllipse(28, 4, 5, 3);
    g.fillEllipse(36, 7, 5, 3);
    // Lettuce
    g.fillStyle(0x44BB44);
    g.fillRect(4, 18, 44, 6);
    g.fillStyle(0x33AA33);
    for (let x = 4; x < 48; x += 6) {
      g.fillCircle(x, 18, 4);
    }
    // Tomato
    g.fillStyle(0xFF4444);
    g.fillRect(6, 22, 40, 5);
    // Cheese
    g.fillStyle(0xFFCC00);
    g.fillRect(4, 26, 44, 5);
    // Patty
    g.fillStyle(0x7B3F00);
    g.fillRect(6, 30, 40, 10);
    g.fillStyle(0x8B4513);
    g.fillRect(6, 30, 40, 5);
    // Bottom bun
    g.fillStyle(0xDEB887);
    g.fillEllipse(26, 44, 44, 14);
    g.generateTexture('burger', 52, 52);
    g.destroy();
  },

  createDonut(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    // Main donut
    g.fillStyle(0xDEB887);
    g.fillCircle(24, 24, 22);
    // Icing
    g.fillStyle(0xFF69B4);
    g.fillCircle(24, 20, 20);
    // Hole
    g.fillStyle(0x1a0a2e);  // match bg
    g.fillCircle(24, 24, 8);
    // Sprinkles
    const sprinkleColors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF];
    const sprinkles = [
      [14, 14, 30], [32, 12, 60], [10, 24, 0], [36, 26, 45],
      [16, 34, 90], [30, 36, 20], [22, 10, 70]
    ];
    sprinkles.forEach(([x, y, ang], i) => {
      g.fillStyle(sprinkleColors[i % sprinkleColors.length]);
      g.fillRect(x, y, 6, 2);
    });
    g.generateTexture('donut', 48, 48);
    g.destroy();
  },

  createTacos(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    // Shell
    g.fillStyle(0xF4D03F);
    g.fillEllipse(26, 30, 50, 32);
    g.fillStyle(0xE8B84B);
    g.fillRect(2, 30, 48, 16);
    // Lettuce
    g.fillStyle(0x2ECC71);
    for (let x = 6; x < 46; x += 7) {
      g.fillCircle(x, 24, 5);
    }
    // Meat
    g.fillStyle(0x8B4513);
    g.fillRect(8, 26, 36, 6);
    // Cheese shreds
    g.fillStyle(0xFFD700);
    for (let x = 8; x < 44; x += 5) {
      g.fillRect(x, 22, 3, 6);
    }
    // Tomato
    g.fillStyle(0xFF4444);
    g.fillCircle(16, 22, 3);
    g.fillCircle(26, 20, 3);
    g.fillCircle(36, 22, 3);
    // Sour cream
    g.fillStyle(0xFFFFFF);
    g.fillEllipse(26, 21, 14, 6);
    g.generateTexture('taco', 52, 48);
    g.destroy();
  },

  createIceCream(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    // Cone
    g.fillStyle(0xDEB887);
    g.fillTriangle(22, 50, 4, 28, 40, 28);
    // Cone lines
    g.lineStyle(1, 0xC19A6B);
    g.beginPath(); g.moveTo(22, 50); g.lineTo(14, 28); g.strokePath();
    g.beginPath(); g.moveTo(22, 50); g.lineTo(22, 28); g.strokePath();
    g.beginPath(); g.moveTo(22, 50); g.lineTo(30, 28); g.strokePath();
    // Ice cream scoops
    g.fillStyle(0xFF9EBC);
    g.fillCircle(22, 22, 14);
    g.fillStyle(0xA0522D);
    g.fillCircle(16, 12, 10);
    g.fillStyle(0xFFE4B5);
    g.fillCircle(28, 12, 10);
    // Sprinkles on top
    const sc = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00];
    [[18,6],[26,8],[14,14],[30,14],[22,10]].forEach(([x,y],i)=>{
      g.fillStyle(sc[i%sc.length]);
      g.fillRect(x, y, 5, 2);
    });
    g.generateTexture('icecream', 44, 52);
    g.destroy();
  },

  createSushi(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    // Rice
    g.fillStyle(0xFFFFFF);
    g.fillRoundedRect(2, 14, 42, 22, 6);
    // Nori (seaweed)
    g.fillStyle(0x1A3300);
    g.fillRect(2, 14, 42, 8);
    // Fish topping
    g.fillStyle(0xFF7043);
    g.fillEllipse(23, 22, 36, 16);
    g.fillStyle(0xFF5722);
    g.fillEllipse(23, 20, 30, 8);
    // Wasabi dot
    g.fillStyle(0x66BB6A);
    g.fillCircle(38, 26, 4);
    g.generateTexture('sushi', 46, 40);
    g.destroy();
  },

  createChicken(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    // Drumstick bone
    g.fillStyle(0xF5DEB3);
    g.fillRoundedRect(20, 32, 8, 20, 4);
    // Meat
    g.fillStyle(0xD2691E);
    g.fillEllipse(24, 26, 38, 34);
    // Crispy coating texture
    g.fillStyle(0xA0522D);
    g.fillCircle(16, 20, 5);
    g.fillCircle(28, 16, 6);
    g.fillCircle(36, 22, 5);
    g.fillCircle(14, 30, 4);
    g.fillCircle(32, 32, 5);
    g.fillStyle(0xCD853F);
    g.fillCircle(22, 24, 4);
    g.fillCircle(30, 26, 3);
    g.generateTexture('chicken', 48, 52);
    g.destroy();
  },

  createWatermelon(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    // Rind
    g.fillStyle(0x2ECC40);
    g.fillArc(24, 24, 22, Math.PI, 0, false);
    // White inner rind
    g.fillStyle(0xEEFFEE);
    g.fillArc(24, 24, 19, Math.PI, 0, false);
    // Red flesh
    g.fillStyle(0xFF3333);
    g.fillArc(24, 24, 17, Math.PI, 0, false);
    // Seeds
    g.fillStyle(0x222222);
    [[14, 20], [22, 16], [30, 18], [10, 28], [24, 24], [36, 26]].forEach(([x, y]) => {
      g.fillEllipse(x, y, 3, 5);
    });
    // Stripe on rind
    g.fillStyle(0x27AE60);
    for (let a = 200; a < 340; a += 25) {
      const rad = (a * Math.PI) / 180;
      g.fillRect(
        24 + Math.cos(rad) * 18,
        24 + Math.sin(rad) * 18,
        3, 6
      );
    }
    g.generateTexture('watermelon', 48, 28);
    g.destroy();
  }

};
