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

    this.setRotation(rotation);
    this.setLocalScale(0.08, 0.08, 0.4);
    this.setPosition(position);
    this.translateLocal(0, 0.1523, 0);
    //
    //            this.addComponent('rigidbody', {
    //                type: 'dynamic',
    //                mass: 1,
    //                restitution: 0.5
    //            });
    this.addComponent('collision', {
        type: "box",
        halfExtents: this.getLocalScale().clone().scale(0.5)
    });


//    var material = new pc.scene.PhongMaterial();
//    var texture = app.assets.find('green.png');
//    material.diffuseMap = texture.resource;
//    //            material.diffuse = new pc.Color(0.0, 0.5, 0.0, 1.0);
//    material.update();
//
//    this.model.material = material;

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
