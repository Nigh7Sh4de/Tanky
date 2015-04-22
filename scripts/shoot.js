pc.script.create("shoot", function (app) {

    var shootScript = function (entity) {
        this.entity = entity;
        this.bullet = GreenBullet;

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
                var height = event.element.height;

                for (var i = 0; i < touches.length; i++) {
                    var t = touches[0];
                    //                console.log(t.x < width / 2);
                    if (t.x < width / 2 && t.x > width / 3 &&
                        t.y < height / 10 && t.y > 0) {

                        var index = BulletTypes.indexOf(this.bullet) + 1;
                        index = index >= BulletTypes.length ? 0 : index;
                        this.bullet = BulletTypes[index];
                        activeBullet.model.material = this.bullet.getMaterial();
                    } else if (t.x < width / 2) {
                        this.createBullet();
                    }
                }
            }
        },

        createBullet: function () {

            var newBullet = new this.bullet(this.entity.getEulerAngles(),
                this.entity.getPosition());




            app.root.addChild(newBullet);

        }
    };

    return shootScript;

});
