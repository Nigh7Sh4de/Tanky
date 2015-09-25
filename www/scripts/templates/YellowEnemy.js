function YellowEnemy() {
    var self = this;
    this.move = function (dt, MULT) {
        MULT /= 4;
        //        MULT /= 2;
        var pos = this.entity.getPosition().clone();
        var tpos = tank.getPosition().clone();
        var dir = this.dir;
        var up = this.entity.rigidbody.linearVelocity.y;
        var amp = 0.2;
        this.entity.lookAt(dir);
        this.entity.rotateLocal(-90, 0, 0);
        this.entity.rigidbody.applyForce(0, 4.9, 0);
        this.entity.rigidbody.applyImpulse(dir.normalize().scale(dt * MULT));
        if (pos.y < pos.length() * 0.2) {
            this.entity.rigidbody.applyImpulse(0, amp * MULT, 0);
        } else {
            this.entity.rigidbody.applyImpulse(0, -amp * MULT, 0);
        }

    };

    this.collider = {
        type: 'sphere',
        radius: 0.5
    };

    Enemy.call(this);

    this.addComponent('model', {
        type: 'cone',
        castShadows: true,
        receiveShadows: true
    });

    this.model.material = new pc.scene.PhongMaterial();
    this.model.material.diffuseMap = app.assets.find('yellow.png').resource;
    this.model.material.update();
}

inherit(YellowEnemy, Enemy);
