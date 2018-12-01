import 'phaser';

import Player from '../sprites/player';
import Enemy from '../sprites/enemy';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene'
        });

        this.map;
        this.player;
        this.enemies = [];
        this.cursors;
        this.groundLayer;
        this.coinLayer;
        this.text;
        this.score = 0;
        this.moveSpeed = 10;
        this.startColor = 'green';
    }

    create() {
        console.log('Game Scene');

        this.createTiledMap();
        this.createPlayer();
        this.initPhysics();
        this.loadMusic();
    }

    createTiledMap() {
        // load the map 
        this.map = this.make.tilemap({ key: 'map' });

        // tiles for the ground layer
        var groundTiles = this.map.addTilesetImage('tiles');
        // create the ground layer
        this.groundLayer = this.map.createDynamicLayer('World', groundTiles, 0, 0);
        // the player will collide with this layer
        this.groundLayer.setCollisionByExclusion([-1]);

        // set the boundaries of our game world
        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;

        this.cameras.main.setBackgroundColor(0xffc0cb);
    }

    /**
     * Tell the physics system to collide player, appropriate tiles, 
     * and other objects based on group, run callbacks when appropriate
     */
    initPhysics() {
        console.log(this.player, this.groundLayer)
        this.physics.add.collider(this.player, this.groundLayer);
    }

    createPlayer() {
        this.player = new Player({
            scene: this,
            x: 72,
            y: 430,
            color: 'green'
        });
    }

    createEnemy() {
        var spawnX = this.groundLayer.x + 800;
        var spawnY = 450;
        if (Math.random() < 0.5) {
            spawnY -= this.player.height;
        }

        var enemy = new Enemy({
            scene: this,
            x: spawnX,
            y: spawnY
        });

        this.physics.add.collider(this.player, enemy);
        this.enemies.push(enemy);
    }

    loadMusic() {

    }

    // this function will be called when the player touches a coin
    collectCoin(sprite, tile) {

    }

    gameOver() {
        this.moveSpeed = 0;
        this.gameOverText = this.add.text(16, 200, 'You are dead.\nScore: ' + this.score, { fontSize: '32px', fill: '#000' });

        this.score = 0;
        this.player.color = 'green';

        var self = this;
        var playButton = this.add.image(400, 120, "playButton").setInteractive();

        playButton.on("pointerdown", function (e) {
            self.scene.restart('GameScene');
        });
    }

    update(time, delta) {
        // The player class update method must be called each cycle as the class is not currently part of a group
        this.player.update(time, delta);

        console.log(this.player.color)

        var moveSpeed = this.moveSpeed;
        var enemies = this.enemies;
        this.groundLayer.x -= moveSpeed;
        //var firstElems = this.groundLayer.culledTiles[0].layer.data[0].slice(0, 10);
        //this.groundLayer.culledTiles[0].layer.data[0].push(firstElems);

        // Endless scrolling fugly hack
        if (this.groundLayer.x < -this.map.widthInPixels / 2) {
            this.groundLayer.x = 0;
            this.createEnemy();
        }

        enemies.forEach(function (enemy, index) {
            enemy.x -= moveSpeed;
            if (enemy.x < -50) {
                enemy.destroy();
                enemies.splice(index, 1);
            }
        })

        /**
         * If Player dies, kill the game.
         */
        //this.player.alive = false;
        if (this.player.alive === false) {
            this.gameOver();
        }
    }
}
