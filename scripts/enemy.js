pc.script.create("enemy", function (app) {

    const MULT = 5;
    const MAX_TIME = 2;

    var enemyScript = function (entity) {
        this.entity = entity;
        this.dir = new pc.Vec3;
        this.entity.collision.on('collisionstart', this.onCollisionStart, this);
        this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
        //        this.stats = app.root.findByName('stats');
        //        this.score = this.stats.findByName('score');
        //        this.health = this.stats.findByName('health');
    };

    enemyScript.prototype = {
        initialize: function () {
            this.entity.script.burn.die = this.die;
            var player = tank.getPosition().clone();
            var pos = this.entity.getPosition().clone();
            this.dir = new pc.Vec3(
                player.x - pos.x,
                player.y - pos.y,
                player.z - pos.z
            ).scale(0.001 * MULT);
        },

        die: function () {
            //            if (this.entity.dead) {
            //                this.entity.enabled = false;
            this.entity.destroy();
            //                return;
            //            }
        },

        onCollisionStart: function (result) {
            //            console.log(result.other.isBullet === true);
            if (result.other.isBullet) {
                this.burn(this.entity, result.other);
                score.script.score.increase(10);
            } else if (result.other.name == 'tank') {
                //                this.burn(this.entity, result.other);
                if (health.script.health.decrease(1))
                    this.burn(this.entity);
                else {
                    this.burn(this.entity, base, gun);
                }
                //                this.burn(this.entity);
            }

        },

        onTriggerEnter: function (result) {},

        burn: function () {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i].rigidbody)
                    arguments[i].rigidbody.enabled = false;
                arguments[i].script.burn.activate();
                //                arguments[i].rigidbody.
                arguments[i].model.castShadows = false;
            }
        },

        update: function (dt) {

            if (!this.entity.script.burn.active)
                this.entity.rigidbody.applyImpulse(this.dir);

            if (this.entity.getPosition().y < -1) {
                //                this.entity.enabled = false;
                this.entity.destroy();
            }

        }
    }

    return enemyScript;

});
