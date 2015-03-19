pc.script.create("bullet", function (app) {

    const MULT = 25;
    const MAX_TIME = 2;

    var bulletScript = function (entity) {
        entity.time = 0;
        this.entity = entity;
        this.force = new pc.Vec3;
    };

    bulletScript.prototype = {
        initialize: function () {
            this.force = this.entity.forward.clone().scale(-50);
            //            this.entity.rigidbody.applyImpulse(this.force);
            this.entity.script.burn.die = this.die;
            this.entity.collision.on('triggerenter', this.onTriggerEnter, this);

            //            this.entity.collision.on
        },

        onTriggerEnter: function (other) {
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
        },

        update: function (dt) {
            //            if (this.entity.dead) {
            //                //                this.entity.enabled = false;
            //                //                this.entity.model.
            //                this.entity.destroy();
            //                return;
            //
            //            }
            if (!this.entity.script.burn.active)
            //                this.entity.rigidbody.applyForce(0, 9.8, 0);
                this.entity.translateLocal(0, 0, dt * MULT);

            this.entity.time += dt;
            if (this.entity.time > MAX_TIME) {
                //                this.entity.enabled = false;
                this.entity.destroy();
            }
        },

        burn: function () {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i].rigidbody)
                    arguments[i].rigidbody.enabled = false;
                arguments[i].script.burn.activate();
                //                arguments[i].rigidbody.
//                arguments[i].model.castShadows = false;
            }
        },

        die: function () {
            this.entity.destroy();
        }
    }

    return bulletScript;

});
