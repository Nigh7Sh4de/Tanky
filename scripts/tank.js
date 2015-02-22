pc.script.create("tank", function (context) {

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
                context.root.findByName('gameOver').enabled = true;
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
                context.root.findByName('health').script.health.reset();
                context.root.findByName('score').script.score.reset();
                context.root.findByName('gameOver').enabled = false;
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
                while (x = context.root.findByName('enemy'))
                    x.destroy();

            }
        }
    }

    return tankScript;

});
