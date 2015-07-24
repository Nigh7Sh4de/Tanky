pc.script.create("info", function (app) {

    var infoScript = function (entity) {
        this.entity = entity;
        this.active = false;
        this.parent;
        this.touchDelay = -1;
    };

    infoScript.prototype = {
        initialize: function () {
            this.entity.script.font_renderer.on('click', this.onTouch, this);
        },

        update: function (dt) {
            if (this.touchDelay >= 0)
                this.touchDelay += dt;
            if (this.touchDelay > 0.2)
                this.touchDelay = -1;
        },

        onTouch: function () {
            if (this.touchDelay >= 0)
                return;
            this.touchDelay = 0;
            this.toggleState();
        },

        pause: function (state) {
            spawner.script.enabled = !state;
            var enemies = app.root.findByLabel('enemy');
            enemies.forEach(function (e) {
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
        },

        toggleState: function () {
            this.active = !this.active;
            if (this.active) {
                if (store.enabled)
                    this.parent = store;
                else if (gameOver.enabled)
                    this.parent = gameOver;
            }
            info.enabled = this.active;
            this.entity.script.font_renderer.text = this.active ?
                '<<' : '?';



            if (this.active) {
                this.pause(true);
                store.enabled = true;
                store.script.enabled = false;
                store.script.store.updateListings(false);
                store.script.font_renderer.text = '$';
                activeBullet.enabled = true;
                gameOver.enabled = false;
                spawner.script.enabled = false;
            } else {
                store.script.enabled = true;
                store.script.font_renderer.text = '<<';
                if (this.parent == gameOver) {
                    this.pause(false);
                    store.script.font_renderer.text = '||';
                    gameOver.enabled = !this.active;
                    spawner.script.enabled = !this.active;
                    store.enabled = false;
                    activeBullet.enabled = false;
                } else
                    store.script.store.updateListings(true);

            }
        },

        enable: function (parent) {
            this.parent = parent;
            this.entity.enabled = false;
        }


    }

    return infoScript;

});
