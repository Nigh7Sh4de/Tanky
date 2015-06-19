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
    store_listing,
    //    stats,
    health,
    score,
    highscore,
    floor,
    skybox,
    light,
    store_light,
    cam,
    spawner,
    activeBullet,
    store_bullet_green,
    store_bullet_pink,
    info,
    infoButton;

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
    "assets/menu/move-icon.png"
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

    // Create tank entity
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

    gun.addComponent('script', {
        enabled: true,
        scripts: [buildScript('look'), buildScript('shoot'), buildScript('burn')]
    });

    tank.addComponent('script', {
        enabled: true,
        scripts: [buildScript('tank')]
    });

    base.addComponent('script', {
        enabled: true,
        scripts: [buildScript('burn')]
    });

    //Create a floor
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
    spawner.addComponent('script', {
        enabled: true,
        scripts: [buildScript('spawn')]
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

    var gameOverText = buildText('gameOverText', 'Start Game', 0, 30, 4, 300, 1, 0.8, 0.8, 0);
    var scoreText = buildText('scoreText', '', 5, -5, 0, 720, 1, 1, 1, 1);
    var highScoreText = buildText('scoreText', 'High Score: ', -5, -5, 2, 720, 1, 1, 1, 1);
    var congratsText = buildText('scoreText', 'You beat your high score!', 0, -30, 4, 720, 1, 1, 1, 1);
    var storeText = buildText('storeText', '||', 0, -5, 1, 360, 1, 0.8, 0.8, 0);

    gameOver.addComponent('script', {
        enabled: true,
        scripts: [gameOverText, buildScript('gameOver')]
    });

    score.addComponent('script', {
        enabled: true,
        scripts: [scoreText, buildScript('score')]
    });

    highscore.addComponent('script', {
        enabled: true,
        scripts: [highScoreText, buildScript('highscore')]
    });

    congrats.addComponent('script', {
        enabled: true,
        scripts: [congratsText]
    });

    store.addComponent('script', {
        enabled: true,
        scripts: [storeText, buildScript('store')]
    });

    health = new pc.Entity();
    health.setName('health');

    health.addComponent('script', {
        enabled: true,
        scripts: [buildScript('health')]
    });

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

    app.root.addChild(tank);
    app.root.addChild(floor);
    app.root.addChild(light);
    app.root.addChild(store_light);
    app.root.addChild(wall);
    app.root.addChild(wall2);
    app.root.addChild(wall3);
    app.root.addChild(wall4);


});
