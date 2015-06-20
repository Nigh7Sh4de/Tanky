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
var tank, //Tank
    base, //Tank -> Base
    gun, //Tank -> Gun
    gameOver, //Gameover text
    congrats, //Gameover -> (potential) congrats on high score text
    store, //Store text (contains script)
    store_listing, //All options purchasable in store
    info, //Overlay
    infoButton, //Info Text
    health, //Health controller
    score, //Score controller
    highscore, //highscore text
    floor, //floor
    skybox, //not used?
    light, //main light
    store_light, //store light (def disabled)
    cam, //main cam
    spawner, //enemy spawning controller
    activeBullet, //activebullet display (instanceof Bullet)
    store_bullet_green, //store_listing -> green
    store_bullet_pink; //store_listing -> green

var EnemyTypes = {
    Red: RedEnemy,
    Yellow: YellowEnemy
}

var BulletTypes = [
    GreenBullet,
    PinkBullet
]

BulletTypes.DefaultBullet = GreenBullet;
BulletTypes.DefaultBullet.prototype.ammo = 999;

// load all textures
var textures = [
    "assets/Hex_Plating.png",
    "assets/clouds.jpg",
    "assets/red.png",
    "assets/green.png",
    "assets/yellow.png",
    "assets/pink.png",
    "assets/fonts/boombox_72.png",
    "assets/tank/tank_icon.png",
    "assets/menu/shoot-icon.png",
    "assets/menu/move-icon.png",
    "screenshots/in_game.png"
];

var assets_json = [
    "assets/fonts/boombox.json",
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

pc.promise.all(promises).then(function (results) {

    app.context.systems.rigidbody.setGravity(0, -10, 0);
    app.scene.ambientLight = new pc.Color(0.35, 0.35, 0.35);

    // Create camera entity
    cam = new pc.Entity();
    cam.setName('cam');
    cam.addComponent('camera', {
        clearColor: [0.3, 0.3, 0.3]
    });

    cam.setLocalPosition(0, 1.5, -3.5);
    cam.rotateLocal(-20, 180, 0);

    // Create light entities
    light = new pc.Entity();
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

    //Create a representation of the active bullet
    activeBullet = new GreenBullet(pc.Vec3.ZERO, new pc.Vec3(-0.45, 0.95, -3));
    activeBullet.model.castShadows = false;
    activeBullet.model.receiveShadows = false;
    activeBullet.setName('activeBullet');
    activeBullet.removeComponent('collision');
    activeBullet.displayOnly = true;
    activeBullet.addChild(buildTextEntity('activeBulletText', activeBullet.ammo.toString(), -132, 300, 4));
    activeBullet.enabled = false;

    store_bullet_green = new GreenBullet(pc.Vec3.ZERO, new pc.Vec3(0, 1, -0.8));
    store_bullet_green.setName('store_bullet_green');
    store_bullet_green.removeComponent('collision');
    store_bullet_green.displayOnly = true;
    store_bullet_green.addChild(buildTextEntity('storeBulletGreen', '$', 0, 75, 4, 720, 1, 0, 0, 0));
    store_bullet_green.enabled = false;

    store_bullet_pink = new PinkBullet(pc.Vec3.ZERO, new pc.Vec3(0, 1, 0.7));
    store_bullet_pink.setName('store_bullet_pink');
    store_bullet_pink.removeComponent('collision');
    store_bullet_pink.displayOnly = true;
    store_bullet_pink.addChild(buildTextEntity('storeBulletPink', '$', 0, -210, 4, 720, 1, 0, 0, 0));
    store_bullet_pink.enabled = false;

    store_listing = new pc.Entity();
    store_listing.setName('store_listing');
    store_listing.enabled = false;

    // Create tank
    tank = new pc.Entity();
    tank.setName('tank');
    tank.rotate(0, 180, 0);

    tank.addComponent('rigidbody', {
        type: 'static'
    });

    tank.addComponent('collision', {
        type: 'box',
        halfExtents: tank.getLocalScale().clone().scale(0.5)
    });

    var tankScript = buildScript('tank');

    base = new pc.Entity();
    base.setName('base');

    gun = new pc.Entity();
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

    var lookScript = buildScript('look');

    var shootScript = buildScript('shoot');

    var burnScript = buildScript('burn');
    burnScript.attributes = [{
        name: 'maps',
        type: 'string',
        value: 'clouds.jpg'
    }];

    gun.addComponent('script', {
        enabled: true,
        scripts: [lookScript, shootScript, burnScript]
    });

    var moveScript = buildScript('move');

    tank.addComponent('script', {
        enabled: true,
        scripts: [tankScript]
    });

    base.addComponent('script', {
        enabled: true,
        scripts: [burnScript]
    });

    //Create environment
    floor = new pc.Entity();
    floor.setName('floor');

    floor.setLocalScale(100, 1, 100);

    floor.addComponent('model', {
        type: "box",
        castShadows: true,
        receiveShadows: true
    });
    var floorMaterial = new pc.scene.PhongMaterial();
    floorMaterial.diffuseMap = results[0].resource[0];
    floorMaterial.diffuseMapTiling = pc.Vec2.ONE.clone().scale(10);
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

    wall.setLocalScale(1, 60, 60);
    wall.setLocalPosition(-30, 30, 0);

    var wall2 = wall.clone();
    wall2.translate(60, 0, 0);

    var wall3 = wall.clone();
    wall3.translate(30, 0, 30);
    wall3.rotate(0, 90, 0);

    var wall4 = wall3.clone();
    wall4.translate(0, 0, -60);

    //Create an enemy spawner
    spawner = new pc.Entity();
    spawner.setName('spawner');

    var spawnScript = buildScript('spawn');

    spawner.addComponent('script', {
        enabled: true,
        scripts: [spawnScript]
    });

    //Create a HUD
    score = new pc.Entity();
    score.setName('score');
    highscore = new pc.Entity();
    highscore.setName('highscore');
    congrats = new pc.Entity();
    congrats.setName('congrats');
    congrats.enabled = false;
    store = new pc.Entity();
    store.setName('store');
    store.enabled = false;
    gameOver = new pc.Entity();
    gameOver.setName('gameOver');
    info = new pc.Entity();
    info.setName('info');
    info.enabled = false;
    infoButton = new pc.Entity();
    infoButton.setName('infoButton');

    var gameOverText = buildText('gameOverText', 'Start Game', 0, 30, 4, 300, 1, 0.8, 0.8, 0);
    var scoreText = buildText('scoreText', '', 5, -5, 0, 720, 1, 1, 1, 1);
    var highScoreText = buildText('scoreText', 'High Score: ', -5, -5, 2, 720, 1, 1, 1, 1);
    var congratsText = buildText('scoreText', 'You beat your high score!', 0, -30, 4, 720, 1, 1, 1, 1);
    var storeText = buildText('storeText', '||', 0, -5, 1, 360, 1, 0.8, 0.8, 0);
    var infoButtonText = buildText('infoButtonText', '?', 0, 10, 7, 360, 1, 0.8, 0.8, 0);

    var infoSprite = buildSprite('infoSprite', 'in_game.png', 0, 0, 640, 360, 4, 360, 0.5, 1, 1, 1);

    var gameOverScript = buildScript('gameOver');
    var scoreScript = buildScript('score');
    var highScoreScript = buildScript('highscore');
    var storeScript = buildScript('store');
    var infoButtonScript = buildScript('info');


    gameOver.addComponent('script', {
        enabled: true,
        scripts: [gameOverText, gameOverScript]
    });

    score.addComponent('script', {
        enabled: true,
        scripts: [scoreText, scoreScript]
    });

    highscore.addComponent('script', {
        enabled: true,
        scripts: [highScoreText, highScoreScript]
    });

    congrats.addComponent('script', {
        enabled: true,
        scripts: [congratsText]
    });

    store.addComponent('script', {
        enabled: true,
        scripts: [storeText, storeScript]
    });

    info.addComponent('script', {
        enabled: true,
        scripts: [infoSprite]
    });

    infoButton.addComponent('script', {
        enabled: true,
        scripts: [infoButtonScript, infoButtonText]
    });

    health = new pc.Entity();
    health.setName('health');
    var healthScript = buildScript('health');

    health.addComponent('script', {
        enabled: true,
        scripts: [healthScript]
    });

    //Add to scene
    store_listing.addChild(store_bullet_green);
    store_listing.addChild(store_bullet_pink);
    store.addChild(store_listing);

    cam.addChild(activeBullet);
    tank.addChild(base);
    tank.addChild(gun);
    gun.addChild(cam);

    gameOver.addChild(congrats);
    app.root.addChild(gameOver);

    app.root.addChild(score);
    app.root.addChild(health);
    app.root.addChild(highscore);
    app.root.addChild(store);
    infoButton.addChild(info);
    app.root.addChild(infoButton);

    app.root.addChild(tank);
    app.root.addChild(floor);
    app.root.addChild(light);
    app.root.addChild(store_light);
    app.root.addChild(wall);
    app.root.addChild(wall2);
    app.root.addChild(wall3);
    app.root.addChild(wall4);


});
