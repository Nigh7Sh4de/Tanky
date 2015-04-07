pc.script.create("score", function (app) {

    const MULT = 25;
    const MAX_TIME = 2;

    var scoreScript = function (entity) {
        this.entity = entity;
        this.points = 0;
    };

    scoreScript.prototype = {
        initialize: function () {
            //            this.entity.script.font_renderer.text = 'fuck you too';
            this.entity.script.font_renderer.on('click', this.onTouch, this);
            this.reset();
        },

        update: function (dt) {},

        onTouch: function () {
            tank.script.tank.die();
            var angles = cam.getLocalEulerAngles();
            var pos = cam.getLocalPosition();
            cam.setEulerAngles(-90, 0, 0);
            cam.setLocalPosition(0, 5, 0);

            var thing = new pc.fw.Entity();
            thing.addComponent('model', {
                type: 'box',
                receiveShadows: false,
                castShadows: true
            });
            //            var thing_light = new pc.Entity();
            //            thing_light.addComponent('light', {
            //                type: 'directional',
            //                intensity: 0.5,
            //                color: light.light.color,
            //                castShadows: true
            //            });
            //            var thing_light = light.clone();
            //            thing_light.light.intensity = 1;
            //            thing_light.light.type = 'directional';
            thing.setPosition(0, 1, -1);
            //            thing_light.setPosition(0, 1, 0);
            //            light.light.intensity = 1;
            light.enabled = false;
            store_light.enabled = true;

            app.root.addChild(thing);
            //            app.root.addChild(thing_light);
            this.buildText('$0');

        },

        buildText: function (text) {
            var thing = new pc.fw.Entity();
            thing.setName('text_' + text);
            var thingText = {
                name: 'gameOverText',
                url: 'scripts/font_renderer.js',
                attributes: [{
                    name: 'fontAtlas',
                    value: 'boombox_72.png'
        }, {
                    name: 'fontJson',
                    value: 'boombox'
        }, {
                    name: 'text',
                    value: text
        }, {
                    name: 'maxTextLength',
                    value: '64'
        }, {
                    name: 'x',
                    value: 0
        }, {
                    name: 'y',
                    value: 0
        }, {
                    name: 'anchor',
                    value: 4
        }, {
                    name: 'pivot',
                    value: 4
        }, {
                    name: 'tint',
                    type: 'rgba',
                    value: [0.5, 0.5, 0.5, 1]
        }, {
                    name: 'maxResHeight',
                    value: 360
        }, {
                    name: 'depth',
                    value: 1
        }]

            };

            thing.addComponent('script', {
                enabled: true,
                scripts: [thingText]
            });

            app.root.addChild(thing);
        },

        increase: function (amount) {
            this.points += amount;
            this.updateText();
        },

        reset: function () {
            this.points = 0;
            this.updateText();
        },

        updateText: function () {
            this.entity.script.font_renderer.text = 'Points: ' + this.points;
        }
    }

    return scoreScript;

});
