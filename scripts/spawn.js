pc.script.create("spawn", function (app) {

    const INTERVAL = 3;

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
            if (this.time > INTERVAL) {
                this.time = 0;
                this.spawnEnemy();
            }


        },

        spawnEnemy: function () {

//            tmp_enemy_red
//            var enemy = tmp_enemy_red.clone();
            var enemy = tmp_enemy_red();
//            enemy.setPosition(tank.getPosition());

            app.root.addChild(enemy);

        }
    };

    return spawnScript;

});
