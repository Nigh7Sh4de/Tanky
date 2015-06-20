pc.script.create("bullet", function (app) {

    const MULT = 25;
    const DISPLAY_ROTATE_MULT = 135;
    const MAX_TIME = 5;

    var bulletScript = function (entity) {
        entity.time = 0;
        this.entity = entity;
        this.force = new pc.Vec3;
    };

    bulletScript.prototype = {
        initialize: function () {
            if (this.entity.onTriggerEnter == null)
                console.error("Bullet requires onTriggerEnter");
            this.onTriggerEnter = this.entity.onTriggerEnter;

            this.force = this.entity.forward.clone().scale(-50);
            //            this.entity.rigidbody.applyImpulse(this.force);
            this.entity.script.burn.die = this.die;

            if (this.entity.collision)
                this.entity.collision.on('triggerenter', this.onTrigger, this);

            //            this.entity.collision.on
        },

        onTrigger: function (other) {
            if (other.charmed != true)
                this.onTriggerEnter(other);
        },

        onTriggerEnter: function (other) {},

        update: function (dt) {
            //            if (this.entity.dead) {
            //                //                this.entity.enabled = false;
            //                //                this.entity.model.
            //                this.entity.destroy();
            //                return;
            //
            //            }
            if (this.entity.displayOnly == true) {
                this.entity.rotateLocal(0, dt * DISPLAY_ROTATE_MULT, 0);
            } else if (!this.entity.script.burn.active) {
                //                this.entity.rigidbody.applyForce(0, 9.8, 0);
                this.entity.translateLocal(0, 0, dt * MULT);

                this.entity.time += dt;
                if (this.entity.time > MAX_TIME)
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
