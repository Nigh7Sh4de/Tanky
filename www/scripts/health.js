pc.script.create("health", function (app) {

    const defaultValue = 3;

    var healthScript = function (entity) {
        this.entity = entity;
        this.value = defaultValue;

    };

    healthScript.prototype = {
        initialize: function () {
            for (var i = 0; i < this.value; i++) {
                /*
               var healthSprite = new pc.Entity();
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
*/
                var healthSprite = buildSpriteEntity('healthSprite' + i, 'tank_icon.png', 5 + (64 + 5) * i, -50, 64, 64, 0, 720, 1, 1, 1, 1);

                this.entity.addChild(healthSprite);

            }
        },

        update: function (dt) {},

        decrease: function (amount) {
            if (this.value - amount < 0) {
                return false;
            }
            if (amount < 1)
                amount = 1;
            for (var i = 0; i < amount; i++) {
                var name = 'healthSprite' + (this.value - i - 1);
                var e = this.entity.findByName(name);

                e.enabled = false;
                e.destroy();

                this.value--;

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

        }
    }

    return healthScript;

});
