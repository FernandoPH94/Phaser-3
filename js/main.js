var score = 0;
var scoreText;
var bullets;

var fireRate = 100;
var nextFire = 0;

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('fondo', '../img/fondo.jpg');
    this.load.image('suelo','../img/ground.png')
    this.load.image('personaje','../img/personaje.png')
    this.load.image('huevo','../img/huevo.png')
    this.load.image('huevo-icon','../img/huevo-icon.png')
    this.load.image('misil','../img/uwu.png')
}

function create ()
{
    this.add.image(400, 300, 'fondo');

    platforms = this.physics.add.staticGroup();


    platforms.create(400, 568, 'suelo').setScale(0.1).refreshBody();

    platforms.create(600, 400, 'suelo').setScale(0.1).refreshBody();
    platforms.create(50, 250, 'suelo').setScale(0.1).refreshBody();
    platforms.create(750, 220, 'suelo').setScale(0.1).refreshBody();

    player = this.physics.add.sprite(100, 450, 'personaje')
    player.setDisplaySize(50,50)

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: 'huevo',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 },
        setScale: { x: 0.04, y: 0.04 }
    });

    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(player, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, this);

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    
    });

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    bullets = this.physics.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'misil');
}

function update(){
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
    }
    else
    {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown)
    {
        player.setVelocityY(-330);
    }

    if (game.input.activePointer.isDown)
    {
        fire();
    }
}

function collectStar (player, star)
{
    star.disableBody(true, true);
}

function collectStar (player, star)
{
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);
}

function fire() {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(sprite.x - 8, sprite.y - 8);

        game.physics.arcade.moveToPointer(bullet, 300);
    }

}
