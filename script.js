//struktura
var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
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

    this.load.image('backgrnd', 'img/bg-stars.png')
}

//tu tworzymy obiekty gry
function create() {
    cursors = this.input.keyboard.createCursorKeys();

    let back = this.add.tileSprite(0, 0, 1000, 600, 'backgrnd');
    back.setOrigin(0)

    player = this.physics.add.sprite(200, 300, 'player');
    player.setOrigin(0.5, 0.5);

    enemy = this.physics.add.sprite(900, 300, 'enemy');
    enemy.setOrigin(0.5, 0.5);

    var enemies = this.physics.add.staticGroup();
    for (var x = 0; x < 7; ++x) {
        let enemy = enemies.create(900, 100 + x * 60, 'enemy');
    }

    enemy.body.velocity.x = -100;

    //rozmiar 2x większy
    player.setScale(2);
    enemy.setScale(2);

    //kolizja z krawędziami ekranu
    player.body.setCollideWorldBounds(true);
    enemy.body.setCollideWorldBounds(true);

    //inne ciała nie mogą go przesuwać
    //enemy.body.immovable = true;
}

//metoda uruchamiana co klatkę
function update() {
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

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