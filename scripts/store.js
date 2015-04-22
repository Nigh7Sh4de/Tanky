pc.script.create("store", function (app) {

    //    const MULT = 25;
    //    const MAX_TIME = 2;

    var storeScript = function (entity) {
        this.entity = entity;
        this.active = false;
        this.angles = new pc.Vec3(-90, 0, 0);
        this.pos = new pc.Vec3(0, 5, 0);
        this.delay = 0;
        //        this.thing;
        //        this.points = 0;
    };

    storeScript.prototype = {
        initialize: function () {
            //            this.entity.script.font_renderer.text = 'fuck you too';
            this.entity.script.font_renderer.on('click', this.onTouch, this);
            //            this.reset();
        },

        update: function (dt) {
            if (this.delay >= 0)
                this.delay += dt;
            if (this.delay > 0.1)
                this.delay = -1;
        },

        toggleState: function (state) {
            this.entity.getChildren().forEach(function (x) {
                x.enabled = state;
            });
            this.active = state;
            this.entity.script.font_renderer.text = state ? '<<' : '$';
            tank.script.tank.toggleState(!state);
            spawner.script.enabled = !state;
            var enemies = app.root.findByLabel('enemy');
            enemies.forEach(function (e) {
                //                e.charmed = state;
                e.model.enabled = !state;
                e.script.enabled = !state;
                if (e.rigidbody) {
                    if (state) {
                        e.rigidbody._linearVelocity = e.rigidbody.linearVelocity;
                        e.rigidbody.linearVelocity = pc.Vec3.ZERO;
                    } else {
                        e.rigidbody.linearVelocity = e.rigidbody._linearVelocity;
                    }
                }
            });
            light.enabled = !state;
            store_light.enabled = state;
            //                app.root.removeChild(this.thing);

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
                //                console.log("TOUCH");
                this.toggleState(false);
            } else {
                //                console.log("TOUCH");
                this.toggleState(true);
            }
        }


    }

    return storeScript;

});
