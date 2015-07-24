//Subclass for entity
var Bullet = function (rotation, position) {

    pc.Entity.call(this);

    this.setName('bullet');

    this.isBullet = true;

    this.addComponent('model', {
        type: "box",
        castShadows: true,
        receiveShadows: true
    });

    if (rotation != null)
        this.setEulerAngles(rotation);
    this.setLocalScale(0.08, 0.08, 0.4);
    if (position != null)
        this.setLocalPosition(position);
    this.translateLocal(0, 0.1523, 0);
    this.addComponent('collision', {
        type: "box",
        halfExtents: this.getLocalScale().clone().scale(0.5)
    });

    var bulletScript = {
        url: 'scripts/bullet.js',
        name: 'bullet'
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
        scripts: [bulletScript, burnScript]
    });
}

inherit(Bullet, pc.Entity);

Bullet.prototype.ammo = 0;
Bullet.prototype.cost = 0;
