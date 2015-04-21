var PinkBullet = function (rotation, position) {

    this.onTriggerEnter = function (other) {
        if (other.name == 'enemy' && !other.charmed) {

            var material = new pc.scene.PhongMaterial();
            var texture = app.assets.find('pink.png');
            material.diffuseMap = texture.resource;
            material.update();

            other.model.material = material;
            //            other.model.material.update();
            other.rigidbody.linearVelocity = pc.Vec3.ZERO;

            other.charmed = true;
            this.burn(this.entity);

            score.script.score.increase(10);
        }
    }

    Bullet.call(this, rotation, position);

    var material = new pc.scene.PhongMaterial();
    var texture = app.assets.find('pink.png');
    material.diffuseMap = texture.resource;
    //            material.diffuse = new pc.Color(0.0, 0.5, 0.0, 1.0);
    material.update();

    this.model.material = material;

};
inherit(PinkBullet, Bullet);
