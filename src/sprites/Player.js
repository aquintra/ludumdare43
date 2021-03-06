export default class Player extends Phaser.GameObjects.Sprite {
    constructor(Config) {
        super(Config.scene, Config.x, Config.y, 'player', Config.color);

        Config.scene.physics.world.enable(this)
        this.scene = Config.scene;
        this.body.setBounce(0.2)
        this.body.setSize(this.width, this.height - 8);
        this.alive = true;
        this.key = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        game.anims.create({
            key: 'left',
            frames: game.anims.generateFrameNames('player'),
            frameRate: 20,
            repeat: -1
        });

        this.jumpSound = this.scene.sound.add('jumpSound');
        this.jumpSound.setVolume(0.1)
        this.pickupSound = this.scene.sound.add('pickupSound');
        this.deadSound = this.scene.sound.add('deadSound');
        this.pickupSound.setVolume(0.5)

        this.scene.add.existing(this);
        this.color = Config.color;
        this.setTint(this.color);

        var self = this;

        this.scene.input.on('pointerdown', function() {
            self.key.isDown = true;
        });

        this.scene.input.on('pointerup', function() {
            self.key.isDown = false;
        });
    }

    jump() {
        this.body.setVelocityY(-450);
        this.jumpSound.play();
    }

    setColor(newColor) {
        this.color = newColor;
        this.setTint(this.color);
        this.pickupSound.play();
    }

    dead() {
        this.deadSound.play();
    }

    update(time, delta) {
        if (this.alive) {
            if (this.key.isDown && this.body.onFloor()) {
                this.jump();
            }
        }
    }
}