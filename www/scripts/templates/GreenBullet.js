var GreenBullet = function (rotation, position) {
    this.onTriggerEnter = function (other) {
        if (other.name == 'enemy') {


            other.model.material = GreenBullet.getMaterial();
            this.burn(this.entity, other);
            score.script.score.increase(10);
        }
    }

    Bullet.call(this, rotation, position);

    this.model.material = GreenBullet.getMaterial();
};

GreenBullet.getMaterial = function () {
    var material = new pc.scene.PhongMaterial();
    var texture = app.assets.find('green.png');
    material.diffuseMap = texture.resource;
    material.update();

    return material;
}

inherit(GreenBullet, Bullet);
