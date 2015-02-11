pc.script.create("bullet", function (context) {

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
            this.entity.rigidbody.applyImpulse(this.force);
        },

        update: function (dt) {
            if (!this.entity.script.burn.active)
                this.entity.rigidbody.applyForce(0, 9.8, 0);

            this.entity.time += dt;
            if (this.entity.time > MAX_TIME) {
                this.entity.destroy();
            }
        }
    }

    return bulletScript;

});
