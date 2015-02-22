pc.script.create("spawn", function (context) {

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
            context.root.findByName('tank').script.tank.reset();

            var enemy = new pc.fw.Entity();
            enemy.setName('enemy');

            enemy.setPosition(0, 0, 0);
            enemy.setEulerAngles(0, pc.math.random(0, 360), 0);
            enemy.translateLocal(0, 0, -40);
            enemy.setLocalScale(1, 1, 1);

            context.systems.model.addComponent(enemy, {
                type: "box",
                castShadows: true,
                receiveShadows: true
            });

            //            enemy.setLocalScale(0.5, 0.5, 0.1);

            context.systems.rigidbody.addComponent(enemy, {
                type: 'dynamic',
                mass: 1
            });

            app.context.systems.collision.addComponent(enemy, {
                type: "box",
                halfExtents: enemy.getLocalScale().clone().scale(0.5)
            });

            enemy.rigidbody.syncEntityToBody();

            var material = new pc.scene.PhongMaterial();
            var texture = context.assets.find('red.png');
            material.diffuseMap = texture.resource;
            //            material.diffuse = new pc.Color(1.0, 0.0, 0.0, 1.0);
            material.update();

            enemy.model.material = material;

            var enemyScript = {
                url: 'scripts/enemy.js',
                name: 'enemy'
            };

            var burnScript = {
                name: 'burn',
                url: 'scripts/burn.js',
                attributes: [{
                    name: 'maps',
                    type: 'string',
                    value: 'clouds.jpg'
                }]
            };

            context.systems.script.addComponent(enemy, {
                enabled: true,
                scripts: [enemyScript, burnScript]
            });


            context.root.addChild(enemy);

        }
    };

    return spawnScript;

});
