function YellowEnemy() {
    var self = this;
    this.move = function (dt, MULT) {
//        this.entity.rigidbody.applyImpulse(this.dir
//                                           .clone()
//                                           .scale(dt * MULT * ((score.script.score.points / 100) + 1)));
        MULT /= 2;
        var pos = this.entity.getPosition().clone();
        var tpos = tank.getPosition().clone();
//        var dir = tpos.sub(pos);
        var dir = this.dir;
        var up = this.entity.rigidbody.linearVelocity.y;
//        console.log(pos.y < pos.length() * 0.12);
//        console.log(pos.length());
//        this.entity.lookAt(0, 0, 5, 0, 1, -1);
        this.entity.lookAt(dir);
//        this.entity.lookAt(tpos, tpos);
//        this.entity.lookAt(0, 0, (pos.y / 2) - up);
        this.entity.rotateLocal(-90, 0, 0);
        this.entity.rigidbody.applyForce(0, 10, 0);
        this.entity.rigidbody.applyImpulse(dir.normalize().scale(dt * MULT));
//        this.entity.rigidbody.applyImpulse(dir.normalize()
//                                           .scale(dt * MULT * ((score.script.score.points / 100) + 1)));

//        if (pos.y < pos.length * 0.05) {
//            this.entity.rigidbody.applyImpulse(0, 0.05 * 200 * MULT, 0);
//        } else if (pos.y < pos.length() * 0.12) {
        if (pos.y < pos.length() * 0.12) {
            this.entity.rigidbody.applyImpulse(0, 0.05 * MULT, 0);
//            this.entity.rigidbody.applyTorqueImpulse(-1 * 0.1, 0, 0);
//            this.entity.rigidbody.applyTorqueImpulse(0, 1 * 0.01, 0);
        } else {
            this.entity.rigidbody.applyImpulse(0, -0.05 * MULT, 0);
//            this.entity.rigidbody.applyTorqueImpulse(+1 * 0.1, 0, 0);
//            this.entity.rigidbody.applyTorqueImpulse(0, -1 * 0.01, 0);

        }

//        this.entity.rigidbody.applyTorqueImpulse(-1 * 0.01, 0, 0);


    };
//    this.collider =

//    this.model.material = material;

    this.collider = {
        type: "capsule",
//        halfExtents: this.getLocalScale().clone().scale(0.5)
        model: self.model

    };

    Enemy.call(this);

//    this.translateLocal(0,5,0);

    this.addComponent('model', {
        type: 'cone',
//        type: 'cone',
        castShadows: true,
        receiveShadows: true
    });

//    this.translate(0, 50, 0);

//    var material = new pc.scene.PhongMaterial();
//    var texture = app.assets.find('red.png');
    this.model.material = new pc.scene.PhongMaterial();
    this.model.material.diffuseMap = app.assets.find('yellow.png').resource;
    // material.diffuse = new pc.Color(1.0, 0.0, 0.0, 1.0);
    this.model.material.update();



}
inherit(YellowEnemy, Enemy);
