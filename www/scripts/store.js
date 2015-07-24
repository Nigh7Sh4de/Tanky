pc.script.create("store", function (app) {

    const DELAY_THRESHOLD = 0.1;

    var storeScript = function (entity) {
        this.entity = entity;
        this.active = false;
        this.angles = new pc.Vec3(-90, 0, 0);
        this.pos = new pc.Vec3(0, 5, 0);
        this.delay = 0;
    };

    storeScript.prototype = {
        initialize: function () {
            var self = this;
            this.entity.script.font_renderer.on('click', this.onTouch, this);
            if (app.touch)
                app.touch.on('touchstart', this.onTouchStore, this);
            this.listings = store_listing.getChildren();
        },

        onTouchStore: function (e) {
            var self = this;
            if (this.delay >= 0)
                return;


            var t = e.changedTouches[0];
            this.listings.forEach(function (l) {
                var r = Math.max.apply(null, l.getLocalScale().data) / 2;

                var tlx = l.getPosition().x - r;
                var tlz = l.getPosition().z - r;

                var brx = l.getPosition().x + r;
                var brz = l.getPosition().z + r;

                var tl = cam.camera.worldToScreen(new pc.Vec3(tlx, 1, tlz));
                var br = cam.camera.worldToScreen(new pc.Vec3(brx, 1, brz));

                if (t.x >= tl.x && t.x <= br.x &&
                    t.y >= tl.y && t.y <= br.y) {
                    if (l.constructor != BulletTypes.DefaultBullet)
                        self.buy(l);
                    return;
                }
            });


            this.delay = 0;

        },

        buy: function (listing) {
            var cost = listing.cost;
            var points = score.script.score.points;
            if (points >= cost) {
                score.script.score.decrease(cost);
                listing.constructor.prototype.ammo++;
                this.updateListings(true);
            }
        },

        update: function (dt) {
            if (this.delay >= 0)
                this.delay += dt;
            if (this.delay > DELAY_THRESHOLD)
                this.delay = -1;
        },

        updateListings: function (state) {
            store_listing.enabled = state;
            this.listings.forEach(function (l) {
                l.getChildren()[1].script.font_renderer.text =
                    "$" + l.cost.toString() +
                    " / " + l.ammo.toString();
                l.enabled = state;
            });
            var text = activeBullet.getChildren()[1];
            text.script.font_renderer.text = gun.script.shoot.bullet.prototype.ammo.toString();
        },

        toggleState: function (state) {
            this.updateListings(state);
            infoButton.enabled = state;
            this.active = state;
            this.entity.script.font_renderer.text = state ? '<<' : '||';

            infoButton.script.info.pause(state);
            tank.script.tank.toggleState(!state);


            light.enabled = !state;
            store_light.enabled = state;

            var _angles = cam.getEulerAngles().clone();
            var _pos = cam.getLocalPosition().clone();

            cam.setEulerAngles(this.angles);
            cam.setLocalPosition(this.pos);

            this.angles = _angles;
            this.pos = _pos;
        },

        onTouch: function () {
            if (this.delay >= 0)
                return;
            else
                this.delay = 0;
            if (this.active) {
                this.toggleState(false);
            } else {
                this.toggleState(true);
            }
        }


    }

    return storeScript;

});
