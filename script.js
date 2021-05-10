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

    this.load.spritesheet('coin', 'img/Coin.png', {
        frameWidth: 32, frameHeight: 32
    })

    this.load.spritesheet('upArrow', 'img/ArrowUp.png', {
        frameWidth: 100, frameHeight: 100
    })

    this.load.spritesheet('downArrow', 'img/ArrowDown.png', {
        frameWidth: 100, frameHeight: 100
    })

    this.load.spritesheet('rightArrow', 'img/ArrowRight.png', {
        frameWidth: 100, frameHeight: 100
    })
}

//Tworzenie obiektów gry
function create() {
    //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Components.Origin.html
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

    this.anims.create({
        key: 'upArrow',
        frames: this.anims.generateFrameNumbers('upArrow', { start: 0, end: 29 }),
        frameRate: 15, repeat: -1
    })

    this.anims.create({
        key: 'downArrow',
        frames: this.anims.generateFrameNumbers('downArrow', { start: 0, end: 29 }),
        frameRate: 15, repeat: -1
    })

    this.anims.create({
        key: 'rightArrow',
        frames: this.anims.generateFrameNumbers('rightArrow', { start: 0, end: 29 }),
        frameRate: 15, repeat: -1
    })

    jump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    player = this.physics.add.sprite(150, (game.config.height / 2) - 50, 'flyingPlayer')
    player.body.gravity.y = 500
    player.setBodySize(80, 140, false).setOffset(65, 0)
    player.anims.play('flyingPlayer', true)

    scoreCoin = this.add.sprite(30, 35, 'coin').setScale(1.5)
    scoreCoin.anims.play('coin', true)

    coins = this.physics.add.group()
    bullets = this.physics.add.group()
    arrows = this.physics.add.group()

    coinsLoop = this.time.addEvent({ delay: 3000, callback: addCoin, callbackScope: this, loop: true });
    bulletsLoop = this.time.addEvent({ delay: 1500, callback: addBullet, callbackScope: this, loop: true });
    arrowLoop = this.time.addEvent({ delay: 5000, callback: addArrow, callbackScope: this, loop: true });

    //this.cameras.main.setBounds(0, 0, game.config.width, game.config.height) //Kamera porusza się tylko w obrębie świata
    this.physics.world.setBounds(0, 0, game.config.width, game.config.height - 45) //Świat gry jest większy/mniejszy niż ekran
    this.physics.world.setBoundsCollision(false, false, true, true) //Prawo, lewo, góra, dół
    //this.cameras.main.startFollow(player) //Kamera podąża za graczem

    //Kolizja z krawędziami świata
    player.body.setCollideWorldBounds(true)

    //Inne ciała nie mogą go przesuwać
    player.body.immovable = true
}

function addCoin() {
    if (!death) {
        coin = coins.create(1350, Math.floor(Math.random() * (game.config.height - 100) + 50), 'coin').setScale(1.5)
        coin.setVelocityX(-300)
        coin.anims.play('coin', true)
    }
}

function addBullet() {
    //https://developer.mozilla.org/pl/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    //https://www.w3schools.com/js/js_random.asp
    choice = Math.floor(Math.random() * 4) + 1;

    switch (choice) {
        //RED BULLET
        case 1:
            bullet = bullets.create(1350, Math.floor(Math.random() * (game.config.height - 100) + 50), 'redBullet');
            bullet.setBodySize(40, 40, false).setOffset(0, 13)
            bullet.setVelocityX(-450)
            bullet.anims.play('redBullet', true)
            break

        //PINK BULLET
        case 2:
            bullet = bullets.create(1350, Math.floor(Math.random() * (game.config.height - 100) + 50), 'pinkBullet');
            bullet.setBodySize(40, 40, false).setOffset(0, 13)
            bullet.setVelocityX(-500)
            direction = Math.floor(Math.random() * 2) + 1;
            value = Math.floor(Math.random() * 400) + 100;

            if (direction != 1) value = value * (-1)

            bullet.setVelocityY(value)

            bullet.anims.play('pinkBullet', true)
            bullet.body.bounce.set(1)
            bullet.body.setCollideWorldBounds(true)
            break

        //BLUE BULLET
        case 3:
            bullet = bullets.create(1350, Math.floor(Math.random() * (game.config.height - 100) + 50), 'blueBullet');
            bullet.setBodySize(40, 40, false).setOffset(0, 13)
            bullet.setVelocityX(-550)
            bullet.anims.play('blueBullet', true)
            break
    }
}

function addArrow() {
    choice = Math.floor(Math.random() * 4) + 1;
    //choice = 1

    switch (choice) {
        //UP ARROW
        case 1:
            arrow = arrows.create(1350, game.config.height - 100, 'upArrow').setScale(1.2);
            arrow.setBodySize(30, 55, false).setOffset(37, 20)
            arrow.setVelocityX(-300)
            arrow.anims.play('upArrow', true)
            break;

        //DOWN ARROW
        case 2:
            arrow = arrows.create(1350, 50, 'downArrow').setScale(1.2);
            arrow.setBodySize(30, 55, false).setOffset(32, 25)
            arrow.setVelocityX(-300)
            arrow.anims.play('downArrow', true)
            break;

        //RIGHT ARROW
        case 3:
            arrow = arrows.create(1350, Math.floor(Math.random() * (game.config.height - 100) + 50), 'rightArrow').setScale(1.2);
            arrow.setBodySize(55, 30, false).setOffset(25, 37)
            arrow.setVelocityX(-300)
            arrow.anims.play('rightArrow', true)
            break;
    }
}

death = false
deathAnimationPlayed = false
flyingFlag = true
fasterGameFlag = false
backgroundSpeed = 5

//Metoda uruchamiana co klatkę
function update() {
    if (death) {
        if (!deathAnimationPlayed) {
            player.anims.play('deathPlayer', true)
            deathAnimationPlayed = true
        }

        for (let i = 0; i < 10; i++) {
            layers[i].tilePositionX += 0
        }

        if (coins.active == true) coins.setVelocityX(0)
        if (arrows.active == true) arrows.setVelocityX(0)
        //if (bullets.active == true) bullets.setVelocityX(0)
    }
    else {
        //Animacja lasu
        for (let i = 0; i < 10; i++) {
            layers[i].tilePositionX += i * backgroundSpeed * 0.12
        }

        if (flyingFlag) {
            if (jump.isDown) player.setVelocityY(-200)
        }
        if (player.body.touching.down || player.body.onFloor()) player.anims.play('runningPlayer', true)
        else player.anims.play('flyingPlayer', true)

        if (fasterGameFlag) {
            arrows.children.iterate((arrow) => {
                if (arrow != undefined) arrow.setVelocityX(-600)
            })
            coins.children.iterate((coin) => {
                if (coin != undefined) coin.setVelocityX(-600)
            })
            bullets.children.iterate((bullet) => {
                if (bullet != undefined) {
                    switch (bullet.texture.key) {
                        case "redBullet":
                            bullet.setVelocityX(-900)
                            break

                        case "pinkBullet":
                            bullet.setVelocityX(-1000)
                            break

                        case "blueBullet":
                            bullet.setVelocityX(-1100)
                            break
                    }
                }
            })

            coinsLoop.delay = 1500
            bulletsLoop.delay = 750
            arrowLoop.delay = 2500
        }

        coins.children.iterate((coin) => {
            if (coin != undefined) {
                if (coin.x <= -50) coins.remove(coin, true, true)
            }
        })

        arrows.children.iterate((arrow) => {
            if (arrow != undefined) {
                if (arrow.x < -100) arrows.remove(arrow, true, true)
            }
        })

        this.physics.collide(player, coins, collectCoin)
        this.physics.collide(player, arrows, collectArrow)
    }

    bullets.children.iterate((bullet) => {
        if (bullet != undefined) {
            if (bullet.texture.key == "redBullet") {
                if (player.y > bullet.y) bullet.y += 0.6
                else bullet.y -= 0.6
            }

            if (bullet.x < -150) bullets.remove(bullet, true, true)
        }
    })

    //Wywołanie funkcji przy kolizji
    this.physics.collide(player, bullets, playerDeath)
}

function playerDeath(player, bullets) {
    player.setBodySize(140, 70, false).setOffset(0, 80)
    death = true
    player.body.gravity.y = 90000
    bullets.destroy()
}

function collectCoin(player, coins) {
    score.text = (parseInt(score.text) + 1).toString()
    coins.destroy()
}

function collectArrow(player, arrows) {
    if (arrows.texture.key == "upArrow") {
        player.setVelocityY(-3000)
        flyingFlag = false

        setTimeout(() => {
            flyingFlag = true
        }, 250)
    }
    else if (arrows.texture.key == "rightArrow") {
        backgroundSpeed = 10
        fasterGameFlag = true

        setTimeout(() => {
            backgroundSpeed = 5
            fasterGameFlag = false

            coinsLoop.delay = 3000
            bulletsLoop.delay = 1500
            arrowLoop.delay = 5000
        }, 3000)
    }
    else if (arrows.texture.key == "downArrow") {
        player.setVelocityY(2500)
        flyingFlag = false

        setTimeout(() => {
            flyingFlag = true
            console.log(flyingFlag)
        }, 250)
    }
    arrows.destroy()
}