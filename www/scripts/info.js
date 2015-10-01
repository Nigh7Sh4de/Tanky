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

        toggleState: function (state) {
            this.active = state != null ? state : !this.active;
            if (this.active) {
                if (store.enabled) {
                    this.parent = store;
                    store.script.store.toggleState(false, false);
                    pause.enabled = true;
                    pause.script.enabled = false;
                    pause.script.font_renderer.text = '||';
                } else {
                    this.parent = gameOver;
                    gameOver.enabled = false;
                }
            } else {
                if (this.parent == store) {
                    store.script.store.toggleState(true, false);
                    pause.script.enabled = true;
                    pause.script.font_renderer.text = '<<';
                } else
                    gameOver.enabled = !this.active;

            }

            this.entity.script.font_renderer.text = this.active ? '<<' : '?';
            info.enabled = this.active;
            activeBullet.enabled = this.active;
            spawner.script.spawn.toggleState(!this.active);


        },

        //        toggleState: function () {
        //            this.active = !this.active;
        //            if (this.active) {
        //                if (store.enabled)
        //                    this.parent = store;
        //                else if (gameOver.enabled)
        //                    this.parent = gameOver;
        //            }
        //            info.enabled = this.active;
        //            this.entity.script.font_renderer.text = this.active ?
        //                '<<' : '?';
        //
        //
        //
        //            if (this.active) {
        //                this.pause(true);
        //                store.enabled = true;
        //                store.script.enabled = false;
        //                store.script.store.updateListings(false);
        //                store.script.font_renderer.text = '$';
        //                activeBullet.enabled = true;
        //                gameOver.enabled = false;
        //                spawner.script.enabled = false;
        //            } else {
        //                store.script.enabled = true;
        //                store.script.font_renderer.text = '<<';
        //                if (this.parent == gameOver) {
        //                    this.pause(false);
        //                    store.script.font_renderer.text = '||';
        //                    gameOver.enabled = !this.active;
        //                    spawner.script.enabled = !this.active;
        //                    store.enabled = false;
        //                    activeBullet.enabled = false;
        //                } else
        //                    store.script.store.updateListings(true);
        //
        //            }
        //        },

        enable: function (parent) {
            this.parent = parent;
            this.entity.enabled = false;
        }


    }

    return infoScript;

});
