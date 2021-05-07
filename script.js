//Serce gry
let game = new Phaser.Game({
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
            debug: true
        }
    }
})

//Ładowanie zasobów
function preload() {
    this.load.image('background', 'img/Background.png')

    for (i = 0; i < 10; i++) {
        this.load.image('layer' + i, 'img/Layer' + i + '.png')
    }

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
}

//Tworzenie obiektów gry
function create() {
    jump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0)

    layers = []
    for (let i = 0; i < 10; i++) {
        layers[i] = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'layer' + i).setOrigin(0)
    }

    player = this.physics.add.sprite(150, 300, 'flyingPlayer')
    player.setOrigin()
    player.body.gravity.y = 18000
    player.setBodySize(100, 150, true)

    this.anims.create({
        key: 'running',
        frames: this.anims.generateFrameNumbers('runningPlayer', { start: 0, end: 14 }),
        frameRate: 20, repeat: -1
    })

    this.anims.create({
        key: 'flying',
        frames: this.anims.generateFrameNumbers('flyingPlayer', { start: 0, end: 14 }),
        frameRate: 20, repeat: -1
    })

    this.anims.create({
        key: 'death',
        frames: this.anims.generateFrameNumbers('deathPlayer', { start: 0, end: 4 }),
        frameRate: 5
    })

    this.anims.create({
        key: 'redShot',
        frames: this.anims.generateFrameNumbers('redBullet', { start: 0, end: 5 }),
        frameRate: 10, repeat: -1
    })

    this.anims.create({
        key: 'blueShot',
        frames: this.anims.generateFrameNumbers('blueBullet', { start: 0, end: 5 }),
        frameRate: 10, repeat: -1
    })

    this.anims.create({
        key: 'pinkShot',
        frames: this.anims.generateFrameNumbers('pinkBullet', { start: 0, end: 5 }),
        frameRate: 10, repeat: -1
    })

    //bullets.createMultiple(5, 'redBullet')

    // bullets.setAll('anchor.y', 0.5)
    // bullets.setAll('outOfBoundsKill', true)
    // bullets.setAll('checkWorldBounds', true)

    enemy = this.physics.add.sprite(1200, Math.floor(Math.random() * game.config.height - 50) + 50, 'redBullet')
    enemy.setOrigin()
    enemy.setVelocityX(-400)
    enemy.setVelocityY(-300)
    enemy.anims.play('redShot', true)
    enemy.body.bounce.set(1)

    //this.cameras.main.setBounds(0, 0, game.config.width, game.config.height) //Kamera porusza się tylko w obrębie świata
    this.physics.world.setBounds(0, 0, game.config.width, game.config.height - 45) //Świat gry jest większy/mniejszy niż ekran
    this.physics.world.setBoundsCollision(false, false, true, true)
    //this.cameras.main.startFollow(player) //Kamera podąża za graczem

    //Kolizja z krawędziami świata
    player.body.setCollideWorldBounds(true)
    enemy.body.setCollideWorldBounds(true)

    //Inne ciała nie mogą go przesuwać
    player.body.immovable = true

    //bullets = game.add.physicsGroup()
}

death = false
deathAnimationPlayed = false

//Metoda uruchamiana co klatkę
function update() {
    player.setVelocityY(0)

    // let playerSpeed = 500
    let speed = 5

    if (death) {
        if (!deathAnimationPlayed) {
            player.anims.play('death', true)
            deathAnimationPlayed = true
        }

        for (let i = 0; i < 10; i++) {
            layers[i].tilePositionX += 0
        }
    }
    else {
        for (let i = 0; i < 10; i++) {
            layers[i].tilePositionX += speed * i * 0.12
        }

        if (jump.isDown) player.setVelocityY(-600)
        if (player.body.touching.down || player.body.onFloor()) player.anims.play('running', true)
        else player.anims.play('flying', true)

        //enemy.setVelocityY(-200)
    }

    //Wywołanie funkcji przy kolizji
    this.physics.collide(player, enemy, collision)
}

function collision(player, enemy) {
    enemy.disableBody(true, true)
    death = true
    player.body.gravity.y = 90000
}