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

//            Enemy
//            var enemy = Enemy.clone();
//            var enemy = Enemy();
            var enemy = new RedEnemy();
//            enemy.setPosition(tank.getPosition());

            app.root.addChild(enemy);

        }
    };

    return spawnScript;

});
