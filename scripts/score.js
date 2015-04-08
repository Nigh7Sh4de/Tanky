pc.script.create("score", function (app) {
    const MULT = 25;
    const MAX_TIME = 2;

    var scoreScript = function (entity) {
        this.entity = entity;
        this.points = 0;
    };

    scoreScript.prototype = {

        initialize: function () {
            // this.entity.script.font_renderer.text = 'fuck you too';
            this.reset();
        },

        update: function (dt) {},

        increase: function (amount) {
            this.points += amount;
            this.updateText();
        },

        reset: function () {
            this.points = 0;
            this.updateText();
        },

        updateText: function () {
            this.entity.script.font_renderer.text = 'Points: ' + this.points;
        }
    }

    return scoreScript;
});
