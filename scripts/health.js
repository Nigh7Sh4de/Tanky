pc.script.create("health", function (app) {

    const defaultValue = 3;

    var healthScript = function (entity) {
        this.entity = entity;
        //        this.health = app.root.findByName('health');
        this.value = defaultValue;
        this.tank = app.root.findByName('tank');
        this.gameOver = app.root.findByName('gameOver');

    };

    healthScript.prototype = {
        initialize: function () {
            for (var i = 0; i < this.value; i++) {
                var healthSprite = new pc.fw.Entity();
                healthSprite.setName('healthSprite' + i);

                var healthSpriteScript = {
                    name: 'healthSpriteScript',
                    url: 'scripts/sprite.js',
                    attributes: [{
                        name: 'textureAsset',
                        value: 'tank_icon.png'
                    }, {
                        name: 'x',
                        value: 5 + (64 + 5) * i
                    }, {
                        name: 'y',
                        value: -50
                    }, {
                        name: 'width',
                        value: 64
                    }, {
                        name: 'height',
                        value: 64
                    }, {
                        name: 'anchor',
                        value: 0
                    }, {
                        name: 'pivot',
                        value: 0
                    }, {
                        name: 'tint',
                        type: 'rgba',
                        value: [1, 1, 1, 1]
                    }, {
                        name: 'maxResHeight',
                        value: 720
                    }, {
                        name: 'depth',
                        value: 1
                    }, {
                        name: 'uPercentage',
                        value: 1
                    }, {
                        name: 'vPercentage',
                        value: 1
                    }]
                }

                healthSprite.addComponent('script', {
                    enabled: true,
                    scripts: [healthSpriteScript]
                });

                this.entity.addChild(healthSprite);
                //                app.root.addChild(healthSprite);

            }
        },

        update: function (dt) {},

        //        canDecrease: function(amount) {
        //            if (this.value - amount < 0) {
        //                return false;
        //            }
        //            return true;
        //        },

        decrease: function (amount) {
            if (this.value - amount < 0) {
                //                this.die();
                return false;
            }
            if (amount < 1)
                amount = 1;
            for (var i = 0; i < amount; i++) {
                var name = 'healthSprite' + (this.value - i - 1);
                //                console.log(app.root.findByName(name));
                var e = this.entity.findByName(name);

                e.enabled = false;
                e.destroy();

                //                console.log(app.root.findByName(name));
                this.value--;
                //                console.log();

            }
            return true;
        },

        reset: function () {
            var sprites = this.entity.getChildren();

            while (sprites.length) {
                sprites[0].enabled = false;
                sprites[0].destroy();
            }

            this.value = defaultValue;
            this.initialize();

        },

        //        die: function () {
        //            console.log("lol you're dead");
        //            this.gameOver.enabled = true;
        //            this.tank.getChildren().forEach(function (x) {
        //                //x.enabled = false;
        //                x.model.enabled = false;
        //                x.script.enabled = false;
        //
        //            });
        //            //this.entity.enabled = false;
        //            //this.entity.model.enabled = false;
        //            this.tank.script.enabled = false;
        //            this.tank.collision.enabled = false;
        //            //            var gameObjects = app.root.findByName('gameObjects');
        //            //            gameObjects.enabled = false;
        //            //            gameObjects.off();
        //            //            gameObjects.getChildren().forEach(function (x) {
        //            //                x.enabled = false;
        //            //            });
        //
        //
        //        }
    }

    return healthScript;

});
