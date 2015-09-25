function RedEnemy() {
    var self = this;
    this.move = function (dt, MULT) {
        //        MULT *= 2;
        var pos = this.entity.getPosition().clone();
        var tpos = tank.getPosition().clone();
        var player = tank.getPosition().clone();
        var pos = this.entity.getPosition().clone();
        var dir = new pc.Vec3(
            player.x - pos.x,
            player.y - pos.y,
            player.z - pos.z
        );
        var up = this.entity.rigidbody.linearVelocity.y;
        this.entity.rigidbody.applyImpulse(dir.normalize().scale(dt * MULT));
        this.entity.setRotation(dir.normalize()); //(tank.getPosition().add(new pc.Vec3(0, 0.5, 0)));
        //        console.log(this.entity.getEulerAngles().toString());
    };

    this.collider = {
        type: "box",
        halfExtents: new pc.Vec3(0.5, 0.75, 0.5)
    };

    Enemy.call(this);

    this.addComponent('model', {
        //                enabled: true,
        type: 'asset',
        asset: app.assets.find('redenemy.json'),
        castShadows: true,
        receiveShadows: true
    });

    this.addComponent('animation', {
        assets: [app.assets.find('redenemy.anim.json')],
        speed: 1
    });

    //    this.addComponent('model');
    //    this.model.model = app.assets.find('redenemy.json').resource.clone();
    this.setLocalScale(0.3, 0.3, 0.3);
    this.lookAt(tank.getPosition());

    //    this.model.material = new pc.scene.PhongMaterial();
    //    this.model.material.diffuseMap = app.assets.find('red.png').resource;
    //    this.model.material.update();



}
inherit(RedEnemy, Enemy);
