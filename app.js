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

app.context.systems.rigidbody.setGravity(0, -10, 0);

// Create camera entity
var cam = new pc.fw.Entity();
cam.setName('cam');
app.context.systems.camera.addComponent(cam, {
    clearColor: [0.3, 0.3, 0.3]
});

cam.setLocalPosition(0, 3, -10);
cam.rotateLocal(-2, 180, 0);

// Create directional light entity
var light = new pc.fw.Entity();
light.setName('light');
light.translate(0, 2, 0);
app.context.systems.light.addComponent(light, {
    type: 'point',
    color: new pc.Color(0.5, 0.5, 1),
    range: 1000,
    intensity: 2,
    castShadows: true
        //    shadowBias: -0.0005
});

app.context.systems.light.addComponent(light, {
    color: new pc.Color(1, 1, 1),
    intensity: 0.5
});


//light.setEulerAngles(-45, 0, 0);

//Create a skybox entity
var skybox = new pc.fw.Entity();
skybox.setName('skybox');

//Container for all gameobjects
var gameObjects = new pc.fw.Entity();
gameObjects.name = 'gameObjects';

// Create tank entity
var tank = new pc.fw.Entity();
tank.setName('tank');
tank.rotate(0, 180, 0);

app.context.systems.rigidbody.addComponent(tank, {
    type: 'static'
});

app.context.systems.collision.addComponent(tank, {
    type: 'box',
    //    halfExtents: new pc.Vec3(1, 1, 1)
    halfExtents: tank.getLocalScale().clone().scale(0.5)

});

var tankScript = {
    name: 'tank',
    url: 'scripts/tank.js'
};


app.context.systems.script.addComponent(tank, {
    enabled: true,
    scripts: [tankScript]
});



var base = new pc.fw.Entity();
base.setName('base');

var gun = new pc.fw.Entity();
gun.setName('gun');
gun.translateLocal(0, 0.55, 0);

var url = "assets/tank/Tank_base.json";

app.context.assets.loadFromUrl(url, "model").then(function (results) {
    var model = results.resource;
    var asset = results.asset;

    app.context.systems.model.addComponent(base, {
        type: "asset",
        asset: asset,
        castShadows: true,
        receiveShadows: true
    });
});

url = "assets/tank/Tank_gun_turret.json";

app.context.assets.loadFromUrl(url, "model").then(function (results) {
    var model = results.resource;
    var asset = results.asset;

    app.context.systems.model.addComponent(gun, {
        type: "asset",
        asset: asset,
        castShadows: true,
        receiveShadows: true
    });
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

app.context.systems.script.addComponent(gun, {
    enabled: true,
    scripts: [lookScript, shootScript, burnScript]
});

var moveScript = {
    name: 'move',
    url: 'scripts/move.js'
}

app.context.systems.script.addComponent(tank, {
    enable: true,
    scripts: [moveScript]
});

app.context.systems.script.addComponent(base, {
    enable: true,
    scripts: [burnScript]
});

tank.addChild(base);
tank.addChild(gun);
gun.addChild(cam);



//Create a floor
var floor = new pc.fw.Entity();
floor.setName('floor');

//floor.setLocalScale(100, 1, 100);
floor.setLocalScale(100, 1, 100);

app.context.systems.model.addComponent(floor, {
    type: "box",
    castShadows: true,
    receiveShadows: true
});

app.context.systems.rigidbody.addComponent(floor, {
    type: 'static'
});

//var scale = floor.getLocalScale().clone();
//console.log(scale);
//scale = scale.scale(0.5);
//console.log(scale);

app.context.systems.collision.addComponent(floor, {
    type: 'box',
    halfExtents: floor.getLocalScale().clone().scale(0.5)
});

floor.translate(0, -0.5, 0);
floor.rigidbody.syncEntityToBody();

//Create an enemy spawner
var spawner = new pc.fw.Entity();
spawner.setName('spawner');

var spawnScript = {
    name: 'spawn',
    url: 'scripts/spawn.js'
}

app.context.systems.script.addComponent(spawner, {
    enabled: true,
    scripts: [spawnScript]
});

//Create a HUD
var stats = new pc.fw.Entity();
stats.setName('stats');
var score = new pc.fw.Entity();
score.setName('score');
var gameOver = new pc.fw.Entity();
gameOver.setName('gameOver');

var gameOverText = {
    name: 'gameOverText',
    url: 'scripts/font_renderer.js',
    attributes: [{
        name: 'fontAtlas',
        value: 'boombox_144.png'
    }, {
        name: 'fontJson',
        value: 'boombox_144'
    }, {
        name: 'text',
        value: 'Play Again'
    }, {
        name: 'maxTextLength',
        value: '64'
    }, {
        name: 'x',
        value: 5
    }, {
        name: 'y',
        value: -5
    }, {
        name: 'anchor',
        value: 4
    }, {
        name: 'pivot',
        value: 4
    }, {
        name: 'tint',
        type: 'rgba',
        value: [0, 0, 0, 1]
    }, {
        name: 'maxResHeight',
        value: 720
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
        value: [0, 0, 0, 1]
    }, {
        name: 'maxResHeight',
        value: 720
    }, {
        name: 'depth',
        value: 1
    }]

};

var gameOverScript = {
    name: 'gameOver',
    url: 'scripts/gameOver.js'
}

app.context.systems.script.addComponent(gameOver, {
    enabled: true,
    scripts: [gameOverText, gameOverScript]
});

gameOver.enabled = false;

var scoreScript = {
    name: 'score',
    url: 'scripts/score.js'
}

app.context.systems.script.addComponent(score, {
    enabled: true,
    scripts: [scoreText, scoreScript]
});

var health = new pc.fw.Entity();
health.setName('health');
var healthScript = {
    name: 'health',
    url: 'scripts/health.js'
}

app.context.systems.script.addComponent(health, {
    enabled: true,
    scripts: [healthScript]
});

stats.addChild(gameOver);
stats.addChild(score);
stats.addChild(health);
//score.script.scoreText

// load all textures
var textures = [
    "assets/skybox/posy.png",
    "assets/skybox/negy.png",
    "assets/skybox/negx.png",
    "assets/skybox/posx.png",
    "assets/skybox/posz.png",
    "assets/skybox/negz.png",
    "assets/Hex_Plating.png",
    "assets/clouds.jpg",
    "assets/red.png",
    "assets/green.png",
    "assets/fonts/boombox_72.png",
    "assets/tank/tank_icon.png",
    "assets/fonts/boombox_144.png"
];

var assets_json = [
    "assets/fonts/boombox.json",
    "assets/fonts/boombox_144.json"
];

var promises = [];

for (var i = 0; i < textures.length; i++) {
    promises.push(app.context.assets.loadFromUrl(textures[i], "texture"));
}

for (var i = 0; i < assets_json.length; i++)
    promises.push(app.context.assets.loadFromUrl(assets_json[i], "json"));

// check for all assets to load then create skybox
pc.promise.all(promises).then(function (results) {

    app.context.systems.skybox.addComponent(skybox, {
        enabled: true,
        posy: results[0].asset.id,
        negy: results[1].asset.id,
        negx: results[2].asset.id,
        posx: results[3].asset.id,
        posz: results[4].asset.id,
        negz: results[5].asset.id
    });

    var floorMaterial = new pc.scene.PhongMaterial();
    floorMaterial.diffuseMap = results[6].resource[0];
    floorMaterial.update();
    floor.model.model.meshInstances[0].material = floorMaterial;

    //    results[7].asset.name = 'heightMap ';
    //    results[8].asset.name = 'red';
    //    results[9].asset.name = 'green';

});


// Add to hierarchy
//app.context.root.addChild(tank);
//app.context.root.addChild(floor);
gameObjects.addChild(tank);
gameObjects.addChild(floor);
app.context.root.addChild(gameObjects);
app.context.root.addChild(light);
app.context.root.addChild(stats);
