pc.script.create("tank", function (app) {

    const MULT = 25;
    const MAX_TIME = 2;

    var tankScript = function (entity) {
        entity.time = 0;
        this.entity = entity;
        this.force = new pc.Vec3;
    };

    tankScript.prototype = {
        initialize: function () {
            base.script.burn.die = this.die_child;
            gun.script.burn.die = this.die_child;
        },

        die_child: function () {
            this.entity.getParent().script.tank.die();
        },

        die: function () {
            this.toggleState(false);

            gameOver.enabled = true;
            if (highscore.script.highscore)
                highscore.script.highscore.checkHighScore();
            store.enabled = false;

            BulletTypes.forEach(function (type) {
                if (type != BulletTypes.DefaultBullet)
                    type.prototype.ammo = 0;
            });

            var enemy;
            while ((enemy = app.root.findByName('charmed_enemy')) != null)
                enemy.destroy();

        },

        reset: function () {
            this.toggleState(true);
        },

        toggleState: function (state) {
            //            console.error('Method not implemented: tank.toggleState');


            //            activeBullet.enabled = state;

            gun.script.enabled = state;
            gun.model.enabled = state;
            base.script.enabled = state;
            base.model.enabled = state;
            this.entity.script.enabled = state;
            this.entity.collision.enabled = state;

            if (!state) {
                var children = this.entity.getChildren();
                for (var i = 0; i < children.length; i++) {
                    if (children[i].name == 'glow') {
                        children[i].enemy.glow = null;
                        children[i--].destroy();
                    }
                };
            }
        },

        //        hide: function () {
        //            console.error('Method not implemented: tank.hide');
        //        }

        update: function (dt) {}
    }

    return tankScript;

});
