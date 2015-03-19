pc.script.create("shoot", function (app) {

    var shootScript = function (entity) {
        this.entity = entity;

        app.mouse.on(pc.input.EVENT_MOUSEDOWN, this.onMouseDown, this);
        app.touch.on('touchstart', this.onTouchStart, this);
    };

    shootScript.prototype = {
        initialize: function () {},

        update: function (dt) {
            if (app.keyboard.wasPressed(pc.input.KEY_SPACE)) {
                this.createBullet();
            }
        },

        onMouseDown: function (event) {
            //            this.createBullet();

        },

        onTouchStart: function (event) {
            if (this.entity.script.enabled) {
                //            event.preventDefault();
                //            console.log('You touched me!? o.O');
                var touches = event.changedTouches;
                var width = event.element.width;

                for (var i = 0; i < touches.length; i++) {
                    var t = touches[0];
                    //                console.log(t.x < width / 2);
                    if (t.x < width / 2) {
                        this.createBullet();
                    }
                }
            }
        },

        createBullet: function () {

            var newBullet = new pc.fw.Entity();
            newBullet.setName('bullet');

            newBullet.isBullet = true;

            newBullet.addComponent('model', {
                type: "box",
                castShadows: true,
                receiveShadows: true
            });

            newBullet.setRotation(this.entity.getRotation());
            newBullet.setLocalScale(0.08, 0.08, 0.4);
            newBullet.setPosition(this.entity.getPosition());
            newBullet.translateLocal(0, 0.1523, 0);
            //
            //            newBullet.addComponent('rigidbody', {
            //                type: 'dynamic',
            //                mass: 1,
            //                restitution: 0.5
            //            });
            newBullet.addComponent('collision', {
                type: "box",
                halfExtents: newBullet.getLocalScale().clone().scale(0.5)
            });


            var material = new pc.scene.PhongMaterial();
            var texture = app.assets.find('green.png');
            material.diffuseMap = texture.resource;
            //            material.diffuse = new pc.Color(0.0, 0.5, 0.0, 1.0);
            material.update();

            newBullet.model.material = material;

            var bulletScript = {
                url: 'scripts/bullet.js',
                name: 'bullet'
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

            newBullet.addComponent('script', {
                enabled: true,
                scripts: [bulletScript, burnScript]
            });



            app.root.addChild(newBullet);

        }
    };

    return shootScript;

});
