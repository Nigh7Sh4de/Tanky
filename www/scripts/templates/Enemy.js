//Subclass for entity
var Enemy = function (move) {

    pc.Entity.call(this);

    this.setName('enemy');
    this.addLabel('enemy');
    this.setPosition(tank.getPosition());
    this.setEulerAngles(0, pc.math.random(0, 360), 0);
    this.translateLocal(0, 0, -30);
    this.setLocalScale(1, 1, 1);
    this.rotateLocal(90, 0, 0);

    this.addComponent('rigidbody', {
        type: 'dynamic',
        mass: 1
    });

    this.addComponent('collision', this.collider);

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

    this.addComponent('script', {
        enabled: true,
        scripts: [enemyScript, burnScript]
    });

    this.rigidbody.syncEntityToBody();
}

inherit(Enemy, pc.Entity);
