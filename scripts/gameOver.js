pc.script.create("gameOver", function (app) {

    const MULT = 25;
    const MAX_TIME = 2;

    var gameOverScript = function (entity) {
        this.entity = entity;
        //        this.tank = app.root.findByName('tank');

    };

    gameOverScript.prototype = {
        initialize: function () {
            this.entity.script.font_renderer.on('click', this.onTouch, this);
            tank.script.tank.die();
        },

        onTouch: function () {
            //            app.root.findByName('tank').script.tank.reset();
            //            if (this.gun.dead || this.base.dead) {
            store.enabled = true;
            health.script.health.reset();
            score.script.score.reset();
            //            var gameOver = app.root.findByName('gameOver');
            gameOver.script.font_renderer.text = 'Play Again';
            gameOver.enabled = false;
            congrats.enabled = false;
            tank.script.tank.reset();

            var x;
            while (x = app.root.findByName('enemy'))
                x.script.enemy.die();

            //            }
        },

        update: function (dt) {
            if (this.entity.enabled)
                if (app.keyboard.isPressed(pc.input.KEY_SPACE)) {
                    this.onTouch();
                }
        }
    }

    return gameOverScript;

});
