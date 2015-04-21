var GreenBullet = function (rotation, position) {
    this.onTriggerEnter = function (other) {
        if (other.name == 'enemy') {
            var material = new pc.scene.PhongMaterial();
            var texture = app.assets.find('green.png');
            material.diffuseMap = texture.resource;
            //            material.diffuse = new pc.Color(1.0, 0.0, 0.0, 1.0);
            material.update();

            other.model.material = material;
            this.burn(this.entity, other);
            score.script.score.increase(10);
        }
    }

    Bullet.call(this, rotation, position);

    var material = new pc.scene.PhongMaterial();
    var texture = app.assets.find('green.png');
    material.diffuseMap = texture.resource;
    //            material.diffuse = new pc.Color(0.0, 0.5, 0.0, 1.0);
    material.update();

    this.model.material = material;
};
inherit(GreenBullet, Bullet);
