// Create a PlayCanvas application
var canvas = document.getElementById("application-canvas");
canvas.focus();

var app = new pc.fw.Application(canvas, {
    mouse: new pc.input.Mouse(canvas),
    keyboard: new pc.input.Keyboard(canvas),
    touch: new pc.input.TouchDevice(canvas)
});

app.context.loader._handlers['texture'].crossOrigin = 'anonymous';
app.context.loader._handlers['model'].crossOrigin = 'anonymous';

app.start();

// Fill the available space at full resolution
app.setCanvasFillMode(pc.fw.FillMode.FILL_WINDOW);
app.setCanvasResolution(pc.fw.ResolutionMode.AUTO);

//Prepare global variables for Entities
var tank,
    base,
    gun,
    gameOver,
    congrats,
    store,
    //    stats,
    health,
    score,
    highscore,
    floor,
    skybox,
    light,
    store_light,
    cam,
    spawner;

var EnemyTypes = {
    Red: RedEnemy,
    Yellow: YellowEnemy
}

// load all textures
var textures = [
//    "assets/skybox/posy.png",
//    "assets/skybox/negy.png",
//    "assets/skybox/negx.png",
//    "assets/skybox/posx.png",
//    "assets/skybox/posz.png",
//    "assets/skybox/negz.png",
    "assets/Hex_Plating.png",
    "assets/clouds.jpg",
    "assets/red.png",
    "assets/green.png",
    "assets/yellow.png",
    "assets/pink.png",
    "assets/fonts/boombox_72.png",
    "assets/tank/tank_icon.png",
    "assets/menu/shoot-icon.png",
    "assets/menu/move-icon.png"
//    "assets/fonts/boombox_144.png"
];

var materials = [
    "assets/yellow.png",
];

var assets_json = [
    "assets/fonts/boombox.json",
//    "assets/fonts/boombox_144.json"
];

var models = [
    "assets/tank/Tank_base.json",
    "assets/tank/Tank_gun_turret.json"
];

var promises = [];

for (var i = 0; i < textures.length; i++)
    promises.push(app.context.assets.loadFromUrl(textures[i], "texture"));

for (var i = 0; i < assets_json.length; i++)
    promises.push(app.context.assets.loadFromUrl(assets_json[i], "json"));

for (var i = 0; i < models.length; i++)
    promises.push(app.context.assets.loadFromUrl(models[i], "model"));

//for (var i = 0; i < materials.length; i++)
//    promises.push(app.context.assets.loadFromUrl(materials[i], "material"));


// check for all assets to load then create skybox
pc.promise.all(promises).then(function (results) {

    app.context.systems.rigidbody.setGravity(0, -10, 0);
    app.scene.ambientLight = new pc.Color(0.35, 0.35, 0.35);

    // Create camera entity
    cam = new pc.fw.Entity();
    cam.setName('cam');
    cam.addComponent('camera', {
        clearColor: [0.3, 0.3, 0.3]
    });

    cam.setLocalPosition(0, 1.5, -3.5);
    cam.rotateLocal(-20, 180, 0);

    // Create light entities
    light = new pc.fw.Entity();
    light.setName('light');
    light.translate(0, 2, 0);
    light.addComponent('light', {
        type: 'point',
        color: new pc.Color(0.5, 0.5, 1),
        range: 30,
        intensity: 2,
        castShadows: true
    });

    store_light = new pc.Entity();
    store_light.setName('store_light');
    store_light.setPosition(0, 1, 0);
    store_light.addComponent('light', {
        type: 'directional',
        color: light.light.color,
        intensity: 1,
        castShadows: true
    });
    store_light.enabled = false;


    //    //Create a skybox entity
    //    skybox = new pc.fw.Entity();
    //    skybox.setName('skybox');
    //
    //    skybox.addComponent('skybox', {
    //        enabled: true,
    //        posy: results[0].asset.id,
    //        negy: results[0].asset.id,
    //        negx: results[0].asset.id,
    //        posx: results[0].asset.id,
    //        posz: results[0].asset.id,
    //        negz: results[0].asset.id
    //    });

    // Create tank entity
    tank = new pc.fw.Entity();
    tank.setName('tank');
    tank.rotate(0, 180, 0);

    tank.addComponent('rigidbody', {
        type: 'static'
    });

    tank.addComponent('collision', {
        type: 'box',
        halfExtents: tank.getLocalScale().clone().scale(0.5)
    });

    var tankScript = {
        name: 'tank',
        url: 'scripts/tank.js'
    };

    base = new pc.fw.Entity();
    base.setName('base');

    gun = new pc.fw.Entity();
    gun.setName('gun');
    gun.translateLocal(0, 0.55, 0);

    base.addComponent('model', {
        type: "asset",
        asset: app.assets.find('Tank_base'),
        castShadows: true,
        receiveShadows: true,
        enabled: false
    });

    gun.addComponent('model', {
        type: "asset",
        asset: app.assets.find('Tank_gun_turret'),
        castShadows: true,
        receiveShadows: true,
        enabled: false
    });

    var lookScript = {
        name: 'look',
        url: 'scripts/look.js'
    }

    var shootScript = {
        name: 'shoot',
        url: 'scripts/shoot.js'
    }

    var burnScript = {
        name: 'burn',
        url: 'scripts/burn.js',
        attributes: [{
            name: 'maps',
            type: 'string',
            value: 'clouds.jpg'
        }]
    };

    gun.addComponent('script', {
        enabled: true,
        scripts: [lookScript, shootScript, burnScript]
    });

    var moveScript = {
        name: 'move',
        url: 'scripts/move.js'
    }

    tank.addComponent('script', {
        enabled: true,
        scripts: [tankScript]
            //        scripts: [moveScript, tankScript]
    });

    base.addComponent('script', {
        enabled: true,
        scripts: [burnScript]
    });

    //    gun.dead = true;
    //    base.dead = true;

    tank.addChild(base);
    tank.addChild(gun);
    gun.addChild(cam);

    //    tank.script.tank.die();

    //Create a floor
    floor = new pc.fw.Entity();
    floor.setName('floor');

    floor.setLocalScale(100, 1, 100);

    floor.addComponent('model', {
        type: "box",
        castShadows: true,
        receiveShadows: true
    });
    var floorMaterial = new pc.scene.PhongMaterial();
    floorMaterial.diffuseMap = results[0].resource[0];
    floorMaterial.diffuseMapTiling = pc.Vec2.ONE.clone().scale(10); //(1, 10);
    floorMaterial.update();
    floor.model.model.meshInstances[0].material = floorMaterial;

    floor.addComponent('rigidbody', {
        type: 'static'
    });

    floor.addComponent('collision', {
        type: 'box',
        halfExtents: floor.getLocalScale().clone().scale(0.5)
    });

    floor.translate(0, -0.5, 0);
    floor.rigidbody.syncEntityToBody();

    var wall = floor.clone();
    wall.removeComponent('rigidbody');
    wall.removeComponent('collision');
    wall.setName('wall');
    //    wall.rotate(0, 0, 90);

    wall.setLocalScale(1, 60, 60);
    wall.setLocalPosition(-30, 30, 0);

    //    wall.addComponent('model', {
    //        type: "box",
    //        castShadows: true,
    //        receiveShadows: true
    //    });
    //    var wallMaterial = new pc.scene.PhongMaterial();
    //    wallMaterial.diffuseMap = results[0].resource[0];
    //    wallMaterial.diffuseMapTiling = new pc.Vec2(10, 10);
    //    wallMaterial.update();
    //    wall.model.model.meshInstances[0].material = wallMaterial;

    var wall2 = wall.clone();
    wall2.translate(60, 0, 0);

    var wall3 = wall.clone();
    wall3.translate(30, 0, 30);
    wall3.rotate(0, 90, 0);

    var wall4 = wall3.clone();
    wall4.translate(0, 0, -60);

    //Create an enemy spawner
    spawner = new pc.fw.Entity();
    spawner.setName('spawner');

    var spawnScript = {
        name: 'spawn',
        url: 'scripts/spawn.js'
    }

    spawner.addComponent('script', {
        enabled: true,
        scripts: [spawnScript]
    });

    //Create a HUD
    //    stats = new pc.fw.Entity();
    //    stats.setName('stats');
    score = new pc.fw.Entity();
    score.setName('score');
    highscore = new pc.fw.Entity();
    highscore.setName('highscore');
    congrats = new pc.fw.Entity();
    congrats.setName('congrats');
    congrats.enabled = false;
    store = new pc.Entity();
    store.setName('store');
    gameOver = new pc.fw.Entity();
    gameOver.setName('gameOver');

    var gameOverText = {
        name: 'gameOverText',
        url: 'scripts/font_renderer.js',
        attributes: [{
            name: 'fontAtlas',
            value: 'boombox_72.png'
    }, {
            name: 'fontJson',
            value: 'boombox'
    }, {
            name: 'text',
            value: 'Start Game'
    }, {
            name: 'maxTextLength',
            value: '64'
    }, {
            name: 'x',
            value: 0
    }, {
            name: 'y',
            value: 30
    }, {
            name: 'anchor',
            value: 4
    }, {
            name: 'pivot',
            value: 4
    }, {
            name: 'tint',
            type: 'rgba',
            //            value: [0.2, 0.5, 1, 1]
            value: [0.8, 0.8, 0, 1]
    }, {
            name: 'maxResHeight',
            value: 300
    }, {
            name: 'depth',
            value: 1
    }]

    };

    var scoreText = {
        name: 'scoreText',
        url: 'scripts/font_renderer.js',
        attributes: [{
            name: 'fontAtlas',
            value: 'boombox_72.png'
    }, {
            name: 'fontJson',
            value: 'boombox'
    }, {
            name: 'text',
            value: ''
    }, {
            name: 'maxTextLength',
            value: '14'
    }, {
            name: 'x',
            value: 5
    }, {
            name: 'y',
            value: -5
    }, {
            name: 'anchor',
            value: 0
    }, {
            name: 'pivot',
            value: 0
    }, {
            name: 'tint',
            type: 'rgba',
            value: [1, 1, 1, 1]
                //            value: [0, 0, 0, 1]
    }, {
            name: 'maxResHeight',
            value: 720
    }, {
            name: 'depth',
            value: 1
    }]

    };

    var highScoreText = {
        name: 'scoreText',
        url: 'scripts/font_renderer.js',
        attributes: [{
            name: 'fontAtlas',
            value: 'boombox_72.png'
    }, {
            name: 'fontJson',
            value: 'boombox'
    }, {
            name: 'text',
            value: 'High Score: '
    }, {
            name: 'maxTextLength',
            value: '20'
    }, {
            name: 'x',
            value: -5
    }, {
            name: 'y',
            value: -5
    }, {
            name: 'anchor',
            value: 2
    }, {
            name: 'pivot',
            value: 2
    }, {
            name: 'tint',
            type: 'rgba',
            value: [1, 1, 1, 1]
                //            value: [0, 0, 0, 1]
    }, {
            name: 'maxResHeight',
            value: 720
    }, {
            name: 'depth',
            value: 1
    }]

    };

    var congratsText = {
        name: 'scoreText',
        url: 'scripts/font_renderer.js',
        attributes: [{
            name: 'fontAtlas',
            value: 'boombox_72.png'
    }, {
            name: 'fontJson',
            value: 'boombox'
    }, {
            name: 'text',
            value: 'You beat your high score!'
    }, {
            name: 'maxTextLength',
            value: '32'
    }, {
            name: 'x',
            value: 0
    }, {
            name: 'y',
            value: -30
    }, {
            name: 'anchor',
            value: 4
    }, {
            name: 'pivot',
            value: 4
    }, {
            name: 'tint',
            type: 'rgba',
            value: [1, 1, 1, 1]
                //            value: [0, 0, 0, 1]
    }, {
            name: 'maxResHeight',
            value: 720
    }, {
            name: 'depth',
            value: 1
    }]

    };

    //    var storeSprite = {
    //        name: 'storeSprite',
    //        url: 'scripts/sprite.js',
    //        attributes: [{
    //            name: 'textureAsset',
    //            value: 'tank_icon.png'
    //                    }, {
    //            name: 'x',
    //            value: 0
    //                    }, {
    //            name: 'y',
    //            value: -10
    //                    }, {
    //            name: 'width',
    //            value: 128
    //                    }, {
    //            name: 'height',
    //            value: 128
    //                    }, {
    //            name: 'anchor',
    //            value: 1
    //                    }, {
    //            name: 'pivot',
    //            value: 1
    //                    }, {
    //            name: 'tint',
    //            type: 'rgba',
    //            value: [1, 1, 1, 1]
    //                    }, {
    //            name: 'maxResHeight',
    //            value: 720
    //                    }, {
    //            name: 'depth',
    //            value: 1
    //                    }, {
    //            name: 'uPercentage',
    //            value: 1
    //                    }, {
    //            name: 'vPercentage',
    //            value: 1
    //                    }]
    //    }

    var storeText = {
        name: 'scoreText',
        url: 'scripts/font_renderer.js',
        attributes: [{
            name: 'fontAtlas',
            value: 'boombox_72.png'
    }, {
            name: 'fontJson',
            value: 'boombox'
    }, {
            name: 'text',
            value: '$'
    }, {
            name: 'maxTextLength',
            value: '3'
    }, {
            name: 'x',
            value: 0
    }, {
            name: 'y',
            value: -5
    }, {
            name: 'anchor',
            value: 1
    }, {
            name: 'pivot',
            value: 1
    }, {
            name: 'tint',
            type: 'rgba',
            value: [0.8, 0.8, 0, 1]
                //            value: [0, 0, 0, 1]
    }, {
            name: 'maxResHeight',
            value: 360
    }, {
            name: 'depth',
            value: 1
    }]

    };


    var gameOverScript = {
        name: 'gameOver',
        url: 'scripts/gameOver.js'
    }

    gameOver.addComponent('script', {
        enabled: true,
        scripts: [gameOverText, gameOverScript]
    });

    //    gameOver.enabled = true;

    var scoreScript = {
        name: 'score',
        url: 'scripts/score.js'
    }

    score.addComponent('script', {
        enabled: true,
        scripts: [scoreText, scoreScript]
    });

    var highScoreScript = {
        name: 'highscore',
        url: 'scripts/highscore.js'
    }

    highscore.addComponent('script', {
        enabled: true,
        scripts: [highScoreText, highScoreScript]
    });

    //    var highScoreScript = {
    //        name: 'highscore',
    //        url: 'scripts/highscore.js'
    //    }

    congrats.addComponent('script', {
        enabled: true,
        scripts: [congratsText]
            //        scripts: [highScoreText, highScoreScript]
    });

    var storeScript = {
        name: 'store',
        url: 'scripts/store.js'
    }

    store.addComponent('script', {
        enabled: true,
        scripts: [storeText, storeScript]
            //        scripts: [storeSprite]
    });

    health = new pc.fw.Entity();
    health.setName('health');
    var healthScript = {
        name: 'health',
        url: 'scripts/health.js'
    }

    health.addComponent('script', {
        enabled: true,
        scripts: [healthScript]
    });

    var info_shoot = new pc.fw.Entity();
    info_shoot.setName('info_shoot');

    var info_shoot_sprite = {
        name: 'sprite',
        url: 'scripts/sprite.js',
        attributes: [{
            name: 'textureAsset',
            value: 'shoot-icon.png'
                    }, {
            name: 'x',
            value: 100
                    }, {
            name: 'y',
            value: 50
                    }, {
            name: 'width',
            value: 64
                    }, {
            name: 'height',
            value: 64
                    }, {
            name: 'anchor',
            value: 6
                    }, {
            name: 'pivot',
            value: 6
                    }, {
            name: 'tint',
            type: 'rgba',
            value: [1, 1, 1, 1]
                    }, {
            name: 'maxResHeight',
            value: 300
                    }, {
            name: 'depth',
            value: 10
                    }, {
            name: 'uPercentage',
            value: 1
                    }, {
            name: 'vPercentage',
            value: 1
                    }]
    }

    info_shoot.addComponent('script', {
        enabled: true,
        scripts: [info_shoot_sprite]
    });

    var info_move = new pc.fw.Entity;
    info_move.setName('info_move');
    var info_move_sprite = {
        name: 'sprite',
        url: 'scripts/sprite.js',
        attributes: [{
            name: 'textureAsset',
            value: 'move-icon.png'
                    }, {
            name: 'x',
            value: -100
                    }, {
            name: 'y',
            value: 50
                    }, {
            name: 'width',
            value: 64
                    }, {
            name: 'height',
            value: 64
                    }, {
            name: 'anchor',
            value: 8
                    }, {
            name: 'pivot',
            value: 8
                    }, {
            name: 'tint',
            type: 'rgba',
            value: [1, 1, 1, 1]
                    }, {
            name: 'maxResHeight',
            value: 300
                    }, {
            name: 'depth',
            value: 10
                    }, {
            name: 'uPercentage',
            value: 1
                    }, {
            name: 'vPercentage',
            value: 1
                    }]
    }

    info_move.addComponent('script', {
        enabled: true,
        scripts: [info_move_sprite]
    });

    gameOver.addChild(info_shoot);
    gameOver.addChild(info_move);

    app.root.addChild(gameOver);
    app.root.addChild(score);
    app.root.addChild(health);
    app.root.addChild(highscore);
    app.root.addChild(congrats);
    app.root.addChild(store);

    app.root.addChild(tank);
    app.root.addChild(floor);
    app.root.addChild(light);
    app.root.addChild(store_light);
    app.root.addChild(wall);
    app.root.addChild(wall2);
    app.root.addChild(wall3);
    app.root.addChild(wall4);


});
