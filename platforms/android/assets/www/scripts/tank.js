pc.script.create("tank", function (app) {

    const MULT = 25;
    const MAX_TIME = 2;

    var tankScript = function (entity) {
        entity.time = 0;
        this.entity = entity;
        this.force = new pc.Vec3;

        //        this.base = this.entity.findByName('base');
        //        this.gun = this.entity.findByName('gun');
        //        this.gameOver = app.root.findByName('gameOver');
    };

    tankScript.prototype = {
        initialize: function () {
            base.script.burn.die = this.die_child;
            gun.script.burn.die = this.die_child;
            //            this.die();
        },

        die_child: function () {
            //            this.entity.script.enabled = false;
            //                if (state)
            //                    x.script.burn.reset();
            //            this.entity.model.enabled = false;
            //            this.entity.script.burn.reset();
            this.entity.getParent().script.tank.die();
            //            gameOver.enabled = true;
            //            if (highscore.script.highscore)
            //                highscore.script.highscore.checkHighScore();
        },

        //        killttttttttttrertrerfewrdsfderrfgreftgy

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
            //            store.enabled = false;
            //            gameOver.enabled = true;
            //            if (highscore.script.highscore)
            //                highscore.script.highscore.checkHighScore();

        },

        reset: function () {
            this.toggleState(true);
        },

        toggleState: function (state) {
            //            this.entity.getChildren().forEach(function (x) {
            //                //x.enabled = true;
            //                x.script.enabled = state;
            //                //                if (state)
            //                //                    x.script.burn.reset();
            //                x.model.enabled = state;
            //            });
            //            //                this.entity.enabled = true;
            activeBullet.enabled = state;
            gun.script.enabled = state;
            gun.model.enabled = state;
            base.script.enabled = state;
            base.model.enabled = state;
            //            glow.enabled = state;
            this.entity.script.enabled = state;
            this.entity.collision.enabled = state;
//            if (store.script.store)
//store.script.store.updateListings();

            if (!state) {
                var children = this.entity.getChildren(); // forEach(function (x) {
                for (var i = 0; i < children.length; i++) {
                    if (children[i].name == 'glow') {
                        children[i].enemy.glow = null;
                        children[i--].destroy();
                    }
                };
            }
        },

        update: function (dt) {
                //            if (this.gun.dead || this.base.dead) {
                //                var children = this.entity.getChildren();
                //                app.root.findByName('gameOver').enabled = true;
                //                children.forEach(function (x) {
                //                    //x.enabled = false;
                //                    x.model.enabled = false;
                //                    x.script.enabled = false;
                //
                //                });
                //                //this.entity.enabled = false;
                //                //this.entity.model.enabled = false;
                //                this.entity.script.enabled = false;
                //                this.entity.collision.enabled = false;

                //            }
            } //,

        //        reset: function () {
        //            if (this.gun.dead || this.base.dead) {
        //                app.root.findByName('health').script.health.reset();
        //                app.root.findByName('score').script.score.reset();
        //                var gameOver = app.root.findByName('gameOver');
        //                gameOver.enabled = false;
        //                gameOver.script.font_renderer.text = 'Play Again';
        //                var children = this.entity.getChildren();
        //                children.forEach(function (x) {
        //                    //x.enabled = true;
        //                    x.script.enabled = true
        //                    x.script.burn.reset();
        //                    x.model.enabled = true;
        //                    x.dead = false;
        //                });
        //                //                this.entity.enabled = true;
        //                this.entity.script.enabled = true;
        //                this.entity.collision.enabled = true;
        //
        //                var x;
        //                while (x = app.root.findByName('enemy'))
        //                    x.destroy();
        //
        //            }
        //        }
    }

    return tankScript;

});
