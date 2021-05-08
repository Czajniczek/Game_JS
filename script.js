//Serce gry
const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 790,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            //gravity: { y: 500 },
            debug: true
        }
    }
}

let game = new Phaser.Game(config)

// let game = new Phaser.Game({
//     type: Phaser.AUTO,
//     width: 1200,
//     height: 790,
//     scene: {
//         preload: preload,
//         create: create,
//         update: update
//     },
//     physics: {
//         default: 'arcade',
//         arcade: {
//             debug: true
//         }
//     }
// })

//Ładowanie zasobów
function preload() {
    this.load.image('background', 'img/Background.png')

    for (i = 0; i < 10; i++) {
        this.load.image('layer' + i, 'img/BackgroundLayer' + i + '.png')
    }

    this.load.bitmapFont('Desyrel', 'fonts/desyrel.png', 'fonts/desyrel.xml')

    this.load.spritesheet('runningPlayer', 'img/PlayerRunning.png', {
        frameWidth: 173, frameHeight: 149.6666
    })

    this.load.spritesheet('flyingPlayer', 'img/PlayerFlying.png', {
        frameWidth: 173, frameHeight: 149.6666
    })

    this.load.spritesheet('deathPlayer', 'img/PlayerDeath.png', {
        frameWidth: 173, frameHeight: 150
    })

    this.load.spritesheet('redBullet', 'img/BulletRed.png', {
        frameWidth: 128, frameHeight: 49.5
    })

    this.load.spritesheet('blueBullet', 'img/BulletBlue.png', {
        frameWidth: 128, frameHeight: 49.5
    })

    this.load.spritesheet('pinkBullet', 'img/BulletPink.png', {
        frameWidth: 128, frameHeight: 49.5
    })

    this.load.spritesheet('coin', '/img/Coin.png', {
        frameWidth: 32, frameHeight: 32
    })
}

var coin
//Tworzenie obiektów gry
function create() {
    background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0)
    score = this.add.bitmapText(50, 10, 'Desyrel', '0', 35)

    //this.scene.pause()
    layers = []
    for (let i = 0; i < 10; i++) {
        layers[i] = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'layer' + i).setOrigin(0)
    }

    this.anims.create({
        key: 'runningPlayer',
        frames: this.anims.generateFrameNumbers('runningPlayer', { start: 0, end: 14 }),
        frameRate: 20, repeat: -1
    })

    this.anims.create({
        key: 'flyingPlayer',
        frames: this.anims.generateFrameNumbers('flyingPlayer', { start: 0, end: 14 }),
        frameRate: 20, repeat: -1
    })

    this.anims.create({
        key: 'deathPlayer',
        frames: this.anims.generateFrameNumbers('deathPlayer', { start: 0, end: 4 }),
        frameRate: 5
    })

    this.anims.create({
        key: 'redBullet',
        frames: this.anims.generateFrameNumbers('redBullet', { start: 0, end: 5 }),
        frameRate: 10, repeat: -1
    })

    this.anims.create({
        key: 'blueBullet',
        frames: this.anims.generateFrameNumbers('blueBullet', { start: 0, end: 5 }),
        frameRate: 10, repeat: -1
    })

    this.anims.create({
        key: 'pinkBullet',
        frames: this.anims.generateFrameNumbers('pinkBullet', { start: 0, end: 5 }),
        frameRate: 10, repeat: -1
    })

    this.anims.create({
        key: 'coin',
        frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 8 }),
        frameRate: 5, repeat: -1
    })

    // redBullets = this.add.group()
    // redBullets.createMultiple(16, "redBullet")
    // redBullets.setAll('anchor.x', 0.5);
    // redBullets.setAll('anchor.y', 1);
    // redBullets.setAll('outOfBoundsKill', true);
    // redBullets.setAll('checkWorldBounds', true);

    // redBullet = redBullets.getFirstExists(false, true, 64, 64, "redBullet", 0)

    jump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    player = this.physics.add.sprite(150, game.config.height / 2 - 50, 'flyingPlayer')
    //player.setOrigin()
    player.body.gravity.y = 500
    player.anims.play('flyingPlayer', true)
    player.setBodySize(80, 140, false).setOffset(65, 0)

    // bullets.createMultiple(5, 'redBullet')
    // bullets.setAll('anchor.y', 0.5)
    // bullets.setAll('outOfBoundsKill', true)
    // bullets.setAll('checkWorldBounds', true)

    enemy = this.physics.add.sprite(1500, Math.floor(Math.random() * (game.config.height - 50)) + 50, 'redBullet')
    //enemy.setOrigin()
    enemy.setVelocityX(-300)
    //enemy.setVelocityY(-200)
    enemy.anims.play('redBullet', true)
    //enemy.body.bounce.set(1)
    enemy.setBodySize(40, 40, false).setOffset(0, 13)

    scoreCoin = this.add.sprite(30, 35, 'coin').setScale(1.5)
    scoreCoin.anims.play('coin', true)

    coins = this.physics.add.group();


    //https://www.w3schools.com/js/js_random.asp
    // coin2 = this.physics.add.sprite(1200, Math.floor(Math.random() * (game.config.height - 50)) + 50, 'coin').setScale(1.5)
    // coin2.setVelocityX(-300)
    // coin2.anims.play('coin', true)

    //this.cameras.main.setBounds(0, 0, game.config.width, game.config.height) //Kamera porusza się tylko w obrębie świata
    this.physics.world.setBounds(0, 0, game.config.width, game.config.height - 45) //Świat gry jest większy/mniejszy niż ekran
    this.physics.world.setBoundsCollision(false, false, true, true) //Prawo, lewo, góra, dół
    //this.cameras.main.startFollow(player) //Kamera podąża za graczem

    //Kolizja z krawędziami świata
    player.body.setCollideWorldBounds(true)
    enemy.body.setCollideWorldBounds(true)

    //Inne ciała nie mogą go przesuwać
    player.body.immovable = true

    //this.time.events.loop(1000, addCoin, this)
}

function addCoin() {
    coin = coins.create(1200, Math.floor(Math.random() * (game.config.height - 50) + 50), 'coin');
    coin.setVelocityX(-400)
    //bullet.setVelocityY(-300)
    coin.anims.play('coin', true)
    //coin.body.bounce.set(1)
    //coin.body.setCollideWorldBounds(true)
}

death = false
deathAnimationPlayed = false

//Metoda uruchamiana co klatkę
function update() {
    //player.setVelocityY(0)

    // let playerSpeed = 500
    let speed = 5

    if (death) {
        if (!deathAnimationPlayed) {
            player.anims.play('deathPlayer', true)
            deathAnimationPlayed = true
        }

        for (let i = 0; i < 10; i++) {
            layers[i].tilePositionX += 0
        }

        //console.log(coin)
        //if (coin.active == true) coin.setVelocityX(0)
    }
    else {
        //Animacja lasu
        for (let i = 0; i < 10; i++) {
            layers[i].tilePositionX += speed * i * 0.12
        }

        if (jump.isDown) player.setVelocityY(-200)
        //console.log(player.body.gravity.y)
        //console.log(player.body.velocity.y) //Jak opada to prędkość + else -
        if (player.body.touching.down || player.body.onFloor()) player.anims.play('runningPlayer', true)
        else player.anims.play('flyingPlayer', true)

        if (player.y > enemy.y) enemy.y += 0.5
        else enemy.y -= 0.5
    }
    //console.log(enemy.body.x)

    //Wywołanie funkcji przy kolizji
    this.physics.collide(player, enemy, collision)
    this.physics.collide(player, coin, collectCoin)
}

function collision(player, enemy) {
    //enemy.disableBody(true,true)
    enemy.destroy()
    death = true
    player.body.gravity.y = 90000
}

function collectCoin(player, coin) {
    coin.destroy()
    score.text = (parseInt(score.text) + 1).toString()
}