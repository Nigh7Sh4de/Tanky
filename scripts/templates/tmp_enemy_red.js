function tmp_enemy_red() {
    var enemy = new pc.fw.Entity();
//    enemy.enabled = false;
    enemy.setName('enemy');
    enemy.setPosition(tank.getPosition());
    enemy.setEulerAngles(0, pc.math.random(0, 360), 0);
    // enemy.setEulerAngles(0, 0, 0);
    enemy.translateLocal(0, 0, -30);
    enemy.setLocalScale(1, 1, 1);

    enemy.addComponent('model', {
//        enabled: true,
        type: "box",
        castShadows: true,
        receiveShadows: true
    });
    // enemy.setLocalScale(0.5, 0.5, 0.1);

    enemy.addComponent('rigidbody', {
        type: 'dynamic',
        mass: 1
    });

    enemy.addComponent('collision', {
        type: "box",
        halfExtents: enemy.getLocalScale().clone().scale(0.5)
    });

    enemy.rigidbody.syncEntityToBody();
    var material = new pc.scene.PhongMaterial();
    var texture = app.assets.find('red.png');
    material.diffuseMap = texture.resource;
    // material.diffuse = new pc.Color(1.0, 0.0, 0.0, 1.0);
    material.update();
    enemy.model.material = material;

    var enemyScript = {
        url: 'scripts/enemy.js',
        name: 'enemy'
    };

    var burnScript = {
        name: 'burn',
        url: 'scripts/burn.js',
        attributes: [{
            name: 'maps',
            type: 'string',
            value: 'clouds.jpg'
        }]

    };

    enemy.addComponent('script', {
        enabled: true,
        scripts: [enemyScript, burnScript]
        });
    enemy.rigidbody.syncEntityToBody();
//    enemy.model.enabled = true;

    return enemy;
}
