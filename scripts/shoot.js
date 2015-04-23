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
                    if (t.x < width / 2.1 && t.x > width / 3 &&
                        t.y < height / 10 && t.y > 0) {

                        var index = BulletTypes.indexOf(this.bullet) + 1;
                        index = index >= BulletTypes.length ? 0 : index;
                        this.bullet = BulletTypes[index];
                        activeBullet.model.material = this.bullet.getMaterial();
                        var text = activeBullet.getChildren()[1];
                        text.script.font_renderer.text = this.bullet.prototype.ammo.toString();
                        //                        text.enabled = false;
                        //                        text.destroy();
                        //                        activeBullet.removeChild();
                        //                        activeBullet.addChild(buildText(this.bullet.prototype.ammo.toString(), -100, 250));
                        //                        console.log(activeBullet._children.length);
                    } else if (t.x < width / 2 && t.y > height * 0.2) {
                        this.createBullet();
                    }
                }
            }
        },

        createBullet: function () {

            if (this.bullet.prototype.ammo > 0) {
                if (this.bullet != BulletTypes.DefaultBullet) {
                    this.bullet.prototype.ammo--;
                    if (store.script.store)
                        store.script.store.updateListings();
                }
                var newBullet = new this.bullet(this.entity.getEulerAngles(),
                    this.entity.getPosition());
                app.root.addChild(newBullet);
            }
        }
    };

    return shootScript;

});
