pc.script.create("spawn", function (app) {

    const INTERVAL_MIN = 2;
    const INTERVAL_MAX = 5;

    var interval = pc.math.random(INTERVAL_MIN,INTERVAL_MAX);

    var spawnScript = function (entity) {
        this.entity = entity;
        this.time = 0;


    };

    spawnScript.prototype = {
        initialize: function () {
            this.time = 0;

            //            this.spawnEnemy();

        },

        update: function (dt) {
            this.time += dt;
            if (this.time > interval) {
                interval = pc.math.random(INTERVAL_MIN,INTERVAL_MAX);
                this.time = 0;

                var r = pc.math.random(0,1);
                var type = null;
                if (0 <= r && r < 0.34)
                    type = EnemyTypes.Yellow;
                else if (0.34 <= r && r < 1.0)
                    type = EnemyTypes.Red;


                this.spawnEnemy(type);
            }


        },

        spawnEnemy: function (enemyType) {

            if (enemyType == null)
                console.error("Enemy type cannot be null");
//            Enemy
//            var enemy = Enemy.clone();
//            var enemy = Enemy();
            var enemy = new enemyType();
//            enemy.setPosition(tank.getPosition());

            app.root.addChild(enemy);

        }
    };

    return spawnScript;

});
