function RedEnemy() {
    var self = this;
    this.move = function (dt, MULT) {
        var pos = this.entity.getPosition().clone();
        var tpos = tank.getPosition().clone();
        var dir = this.dir;
        var up = this.entity.rigidbody.linearVelocity.y;
        this.entity.rigidbody.applyImpulse(dir.normalize().scale(dt * MULT));
    };

    this.collider = {
        type: "box",
        halfExtents: new pc.Vec3(0.5, 0.5, 0.5)
    };

    Enemy.call(this);

    this.addComponent('model', {
        type: 'box',
        castShadows: true,
        receiveShadows: true
    });

    this.model.material = new pc.scene.PhongMaterial();
    this.model.material.diffuseMap = app.assets.find('red.png').resource;
    this.model.material.update();



}
inherit(RedEnemy, Enemy);
