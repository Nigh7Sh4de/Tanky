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
            //            info.enabled = !info.enabled;
            if (this.touchDelay >= 0)
                return;
            this.touchDelay = 0;
            this.toggleState();
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
            //            if (activeBullet.enabled)
            this.entity.script.font_renderer.text = this.active ?
                '<<' : '?';



            if (this.active) {
                store.enabled = true;
                store.script.enabled = false;
                store.script.store.updateListings(false);
                store.script.font_renderer.text = '$';
                activeBullet.enabled = true;
                gameOver.enabled = false;
                spawner.script.enabled = false;
                //
            } else {
                store.script.enabled = true;
                store.script.font_renderer.text = '<<';
                store.script.store.updateListings(true);
                if (this.parent == gameOver) {
                    store.script.font_renderer.text = '||';
                    gameOver.enabled = !this.active;
                    spawner.script.enabled = !this.active;
                    store.enabled = false;
                    activeBullet.enabled = false;
                }

            }
        },

        enable: function (parent) {
            this.parent = parent;
            this.entity.enabled = false;
        }


    }

    return infoScript;

});
