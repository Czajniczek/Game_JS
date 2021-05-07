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
        default: 'arcade'
    },
};

//serce gry
var game = new Phaser.Game(config);

//sterowanie
var cursors;

//tu ładujemy zasoby
function preload() {
    this.load.image('player', 'img/player1.png');
    this.load.image('enemy', 'img/enemy1.png');

    for (i = 1; i < 12; i++) {
        this.load.image('layer' + i, 'img/Layer' + i + '.png');
    }
}

//tu tworzymy obiekty gry
function create() {
    cursors = this.input.keyboard.createCursorKeys();

    const width = game.config.width;
    const height = game.config.height;

    background = this.add.tileSprite(0, 0, width, height, 'layer1').setOrigin(0);
    background1 = this.add.tileSprite(0, -160, width, height, 'layer2').setOrigin(0);
    background2 = this.add.tileSprite(0, -160, width, height, 'layer3').setOrigin(0);
    background3 = this.add.tileSprite(0, -160, width, height, 'layer4').setOrigin(0);
    background4 = this.add.tileSprite(0, -160, width, height, 'layer5').setOrigin(0);
    background5 = this.add.tileSprite(0, -160, width, height, 'layer6').setOrigin(0);
    background6 = this.add.tileSprite(0, -160, width, height, 'layer7').setOrigin(0);
    background7 = this.add.tileSprite(0, -160, width, height, 'layer8').setOrigin(0);
    background8 = this.add.tileSprite(0, -160, width, height, 'layer9').setOrigin(0);
    background9 = this.add.tileSprite(0, -160, width, height, 'layer10').setOrigin(0);
    background10 = this.add.tileSprite(0, -160, width, height, 'layer11').setOrigin(0);

    player = this.physics.add.sprite(200, 300, 'player');
    player.setOrigin(0.5, 0.5);

    enemy = this.physics.add.sprite(900, 300, 'enemy');
    enemy.setOrigin(0.5, 0.5);

    this.cameras.main.setBounds(0, 0, width, height)
    //this.physics.world.setBounds(0, 0, 1600, height)
    this.cameras.main.startFollow(player)

    enemy.body.velocity.x = -100;

    //rozmiar 2x większy
    // player.setScale(2);
    // enemy.setScale(2);

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

    background1.tilePositionX += 0.1;
    background2.tilePositionX += 0.15;
    background3.tilePositionX += 0.2;
    background4.tilePositionX += 0.25;
    background5.tilePositionX += 0.3;
    background6.tilePositionX += 0.35;
    background7.tilePositionX += 0.4;
    background8.tilePositionX += 0.45;
    background9.tilePositionX += 0.5;
    background10.tilePositionX += 0.55;

    //ruch strzałkami góra-dół
    if (cursors.up.isDown) {
        player.body.velocity.y = -250;
    } else if (cursors.down.isDown) {
        player.body.velocity.y = 250;
    }

    //ruch strzałkami lewo-prawo
    if (cursors.left.isDown) {
        player.body.velocity.x = -250;
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 250;
    }

    //wywołanie funkcji przy kolizji
    this.physics.collide(player, enemy, przyKolizji);
}

function przyKolizji(player, enemy) {
    enemy.disableBody(true, true);
}