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
    this.load.spritesheet('player', 'img/PlayerRunning.png', {
        frameWidth: 173, frameHeight: 149.6666
    })
    //this.load.image('enemy', 'img/Enemy.png')
    this.load.image('background', 'img/Background.png')

    for (i = 0; i < 10; i++) {
        this.load.image('layer' + i, 'img/Layer' + i + '.png')
    }
}

//Tworzenie obiektów gry
function create() {
    jump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0)

    layers = []
    for (let i = 0; i < 10; i++) {
        layers[i] = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'layer' + i).setOrigin(0)
    }

    player = this.physics.add.sprite(250, 300, 'player')
    player.setOrigin()
    player.body.gravity.y = 17000

    this.anims.create({
        key: 'running',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 14 }),
        frameRate: 20, repeat: -1
    })

    // enemy = this.physics.add.sprite(900, 300, 'enemy')
    // enemy.setOrigin()
    // enemy.setVelocityX(-100)

    //this.cameras.main.setBounds(0, 0, game.config.width, game.config.height) //Kamera porusza się tylko w obrębie świata
    this.physics.world.setBounds(0, 0, game.config.width, game.config.height - 45) //Świat gry jest większy/mniejszy niż ekran
    //this.cameras.main.startFollow(player) //Kamera podąża za graczem

    //Kolizja z krawędziami ekranu
    player.body.setCollideWorldBounds(true)
    //enemy.body.setCollideWorldBounds(true)

    //Inne ciała nie mogą go przesuwać
    player.body.immovable = true
}

//Metoda uruchamiana co klatkę
function update() {
    player.setVelocityY(0)

    // let playerSpeed = 500
    let speed = 5

    for (let i = 0; i < 10; i++) {
        layers[i].tilePositionX += speed * i * 0.12
    }

    if (jump.isDown) player.setVelocityY(-600)

    if (player.body.touching.down || player.body.onFloor()) {
        player.anims.play('running', true);
    } else {
        player.anims.play('running', false);
    }

    //Wywołanie funkcji przy kolizji
    //this.physics.collide(player, enemy, przyKolizji)
}

// function przyKolizji(player, enemy) {
//     enemy.disableBody(true, true)
// }