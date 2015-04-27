var PinkBullet = function (rotation, position) {

    this.onTriggerEnter = function (other) {
        if (other.name == 'enemy' && !other.charmed) {

            other.model.material = PinkBullet.getMaterial();
            //            other.model.material.update();
            other.rigidbody.linearVelocity = pc.Vec3.ZERO;

            other.charmed = true;
            other.setName('charmed_enemy');
            this.burn(this.entity);

            score.script.score.increase(10);
        }
    }

    Bullet.call(this, rotation, position);

    this.model.material = PinkBullet.getMaterial();

};

PinkBullet.getMaterial = function () {
    var material = new pc.scene.PhongMaterial();
    var texture = app.assets.find('pink.png');
    material.diffuseMap = texture.resource;
    //            material.diffuse = new pc.Color(1.0, 0.0, 0.0, 1.0);
    material.update();
    return material;
}

inherit(PinkBullet, Bullet);

PinkBullet.prototype.cost = 5;
