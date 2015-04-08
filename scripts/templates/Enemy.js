//Subclass for entity
var Enemy = function (move) {

    pc.Entity.call(this);

    this.setName('enemy');
    this.setPosition(tank.getPosition());
    this.setEulerAngles(0, pc.math.random(0, 360), 0);
    // this.setEulerAngles(0, 0, 0);
    this.translateLocal(0, 0, -30);
    this.setLocalScale(1, 1, 1);

    this.addComponent('model', {
        //        enabled: true,
        type: "box",
        castShadows: true,
        receiveShadows: true
    });
    // this.setLocalScale(0.5, 0.5, 0.1);

    this.addComponent('rigidbody', {
        type: 'dynamic',
        mass: 1
    });

    this.addComponent('collision', {
        type: "box",
        halfExtents: this.getLocalScale().clone().scale(0.5)
    });

    this.rigidbody.syncEntityToBody();
    var material = new pc.scene.PhongMaterial();
    var texture = app.assets.find('red.png');
    material.diffuseMap = texture.resource;
    // material.diffuse = new pc.Color(1.0, 0.0, 0.0, 1.0);
    material.update();
    this.model.material = material;

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

    this.move = move;

    this.addComponent('script', {
        enabled: true,
        scripts: [enemyScript, burnScript]
    });

    this.rigidbody.syncEntityToBody();
    //    this.model.enabled = true;
}

pc.inherits(Enemy, pc.Entity);
