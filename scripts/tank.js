pc.script.create("tank", function (app) {

    const MULT = 25;
    const MAX_TIME = 2;

    var tankScript = function (entity) {
        entity.time = 0;
        this.entity = entity;
        this.force = new pc.Vec3;

        this.base = this.entity.findByName('base');
        this.gun = this.entity.findByName('gun');
    };

    tankScript.prototype = {
        initialize: function () {},

        update: function (dt) {
            if (this.gun.dead || this.base.dead) {
                var children = this.entity.getChildren();
                app.root.findByName('gameOver').enabled = true;
                children.forEach(function (x) {
                    //x.enabled = false;
                    x.model.enabled = false;
                    x.script.enabled = false;

                });
                //this.entity.enabled = false;
                //this.entity.model.enabled = false;
                this.entity.script.enabled = false;
                this.entity.collision.enabled = false;

            }
        },

        reset: function () {
            if (this.gun.dead || this.base.dead) {
                app.root.findByName('health').script.health.reset();
                app.root.findByName('score').script.score.reset();
                var gameOver = app.root.findByName('gameOver');
                gameOver.enabled = false;
                gameOver.script.font_renderer.text = 'Play Again';
                var children = this.entity.getChildren();
                children.forEach(function (x) {
                    //x.enabled = true;
                    x.script.enabled = true
                    x.script.burn.reset();
                    x.model.enabled = true;
                    x.dead = false;
                });
                //                this.entity.enabled = true;
                this.entity.script.enabled = true;
                this.entity.collision.enabled = true;

                var x;
                while (x = app.root.findByName('enemy'))
                    x.destroy();

            }
        }
    }

    return tankScript;

});
