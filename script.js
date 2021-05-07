//struktura
var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 790,
    backgroundColor: "black",
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        // arcade: {
        //     gravity: {
        //         y: 500
        //     },
        // }
    },
};

//serce gry
var game = new Phaser.Game(config);

//sterowanie
var cursors;

//tu ładujemy zasoby
function preload() {

    // this.load.spritesheet('player', 'img/player.png', {
    //     frameWidth: 534, frameHeight: 419
    // });

    this.load.image('player', 'img/player1.png');
    this.load.image('enemy', 'img/enemy1.png');

    for (i = 1; i < 12; i++) {
        this.load.image('layer' + i, 'img/Layer' + i + '.png');
    }
}

//tu tworzymy obiekty gry
function create() {
    cursors = this.input.keyboard.createCursorKeys();
    jump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    const width = game.config.width;
    const height = game.config.height;

    background = this.add.tileSprite(0, 0, width, height, 'layer1').setOrigin(0);

    bgLayer1 = this.add.tileSprite(0, 0, width, height, 'layer2').setOrigin(0);
    bgLayer2 = this.add.tileSprite(0, 0, width, height, 'layer3').setOrigin(0);
    bgLayer3 = this.add.tileSprite(0, 0, width, height, 'layer4').setOrigin(0);
    bgLayer4 = this.add.tileSprite(0, 0, width, height, 'layer5').setOrigin(0);
    bgLayer5 = this.add.tileSprite(0, 0, width, height, 'layer6').setOrigin(0);
    bgLayer6 = this.add.tileSprite(0, 0, width, height, 'layer7').setOrigin(0);
    bgLayer7 = this.add.tileSprite(0, 0, width, height, 'layer8').setOrigin(0);
    bgLayer8 = this.add.tileSprite(0, 0, width, height, 'layer9').setOrigin(0);
    bgLayer9 = this.add.tileSprite(0, 0, width, height, 'layer10').setOrigin(0);
    bgLayer10 = this.add.tileSprite(0, 0, width, height, 'layer11').setOrigin(0);

    player = this.physics.add.sprite(250, 300, 'player');
    player.setOrigin(0.5, 0.5);
    player.body.gravity.y = 17000

    enemy = this.physics.add.sprite(900, 300, 'enemy');
    enemy.setOrigin(0.5, 0.5);

    this.cameras.main.setBounds(0, 0, width, height)
    this.physics.world.setBounds(0, 0, width, height - 45)
    this.cameras.main.startFollow(player)

    enemy.body.velocity.x = -100;

    //rozmiar 2x większy
    player.setScale(2);
    enemy.setScale(2);

    //kolizja z krawędziami ekranu
    player.body.setCollideWorldBounds(true);
    enemy.body.setCollideWorldBounds(true);

    //inne ciała nie mogą go przesuwać
    player.body.immovable = true;
}

//metoda uruchamiana co klatkę
function update() {
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    let playerSpeed = 500;
    let speed = 5;

    bgLayer1.tilePositionX += speed;
    bgLayer2.tilePositionX += speed + speed * 0.1;
    bgLayer3.tilePositionX += speed + speed * 0.2;
    bgLayer4.tilePositionX += speed + speed * 0.3;
    bgLayer5.tilePositionX += speed + speed * 0.4;
    bgLayer6.tilePositionX += speed + speed * 0.5;
    bgLayer7.tilePositionX += speed + speed * 0.6;
    bgLayer8.tilePositionX += speed + speed * 0.7;
    bgLayer9.tilePositionX += speed + speed * 0.8;
    bgLayer10.tilePositionX += speed + speed * 0.9;


    if (jump.isDown) {
        player.setVelocityY(-600)
    }

    //ruch strzałkami góra-dół
    if (cursors.up.isDown) {
        player.setVelocityY(-playerSpeed);
    } else if (cursors.down.isDown) {
        player.setVelocityY(playerSpeed);
    }

    //ruch strzałkami lewo-prawo
    // if (cursors.left.isDown) {
    //     player.body.velocity.x = -playerSpeed;
    // } else if (cursors.right.isDown) {
    //     player.body.velocity.x = playerSpeed;
    // }

    //wywołanie funkcji przy kolizji
    this.physics.collide(player, enemy, przyKolizji);
}

function przyKolizji(player, enemy) {
    enemy.disableBody(true, true);
}