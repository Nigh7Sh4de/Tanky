pc.script.create("gameOver", function (app) {

    const MULT = 25;
    const MAX_TIME = 2;

    var gameOverScript = function (entity) {
        this.entity = entity;
        this.tank = app.root.findByName('tank');

    };

    gameOverScript.prototype = {
        initialize: function () {
            this.entity.script.font_renderer.on('click', this.onTouch, this);
            this.tank.script.tank.die();
        },

        onTouch: function () {
            //            app.root.findByName('tank').script.tank.reset();
            //            if (this.gun.dead || this.base.dead) {
            app.root.findByName('health').script.health.reset();
            app.root.findByName('score').script.score.reset();
            var gameOver = app.root.findByName('gameOver');
            gameOver.enabled = false;
            gameOver.script.font_renderer.text = 'Play Again';
            this.tank.script.tank.reset();

            var x;
            while (x = app.root.findByName('enemy'))
                x.destroy();

            //            }
        },

        update: function (dt) {}
    }

    return gameOverScript;

});
