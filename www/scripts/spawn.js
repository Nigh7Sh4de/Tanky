pc.script.create("spawn", function (app) {

    const INTERVAL_MIN = 1;
    const INTERVAL_MAX = 4;

    var interval = pc.math.random(INTERVAL_MIN, INTERVAL_MAX);

    var spawnScript = function (entity) {
        this.entity = entity;
        this.time = 0;
        this.enemies = [];

    };

    spawnScript.prototype = {
        initialize: function () {
            this.time = 0;
        },
        update: function (dt) {
            this.time += dt;
            if (this.time > interval) {
                interval = pc.math.random(INTERVAL_MIN, INTERVAL_MAX);
                this.time = 0;

                var r = pc.math.random(0, 1);
                var type = null;
                if (0 <= r && r < 0.34)
                    type = EnemyTypes.Yellow;
                else if (0.34 <= r && r < 1.0)
                    type = EnemyTypes.Red;


                this.spawnEnemy(type);
            }


        },

        toggleState: function (state) {
            this.entity.enabled = state = state != null ? state : this.entity.enabled = !this.entity.enabled;
            var enemies = app.root.findByLabel('enemy');
            enemies.forEach(function (e, i) {
                e.model.enabled = state;
                e.script.enabled = state;
                if (e.rigidbody) {
                    e.rigidbody.enabled = state;
                    if (state) {
                        e.rigidbody.linearVelocity = e.rigidbody._linearVelocity;
                    } else {
                        e.rigidbody._linearVelocity = e.rigidbody.linearVelocity;
                        e.rigidbody.linearVelocity = pc.Vec3.ZERO;
                    }
                }
            });
        },

        //        freeze: function () {
        //            console.error('Not implemented: spawn.freeze');
        //        },
        //
        //        resume: function () {
        //            console.error('Not implemented: spawn.resume');
        //        },


        spawnEnemy: function (enemyType) {

            if (enemyType == null)
                console.error("Enemy type cannot be null");
            var enemy = new enemyType();

            app.root.addChild(enemy);
            this.enemies.push(enemy);

        }
    };

    return spawnScript;

});
