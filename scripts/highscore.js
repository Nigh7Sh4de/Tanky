pc.script.create("highscore", function (app) {

    const MULT = 25;
    const MAX_TIME = 2;

    var highScoreScript = function (entity) {
        this.entity = entity;
        this.maxPoints = 0;
    };

    highScoreScript.prototype = {
        initialize: function () {
            //            this.entity.script.font_renderer.text = 'fuck you too';
            //this.reset();
            if (localStorage) {
                var highScore = localStorage.getItem('tanky-high-score');
                if (highScore !== null)
                    this.maxPoints = parseFloat(highScore);
                console.log('High Score: ' + this.maxPoints);
                this.updateText();
            }
        },

        update: function (dt) {},

        increase: function (amount) {
            this.points += amount;
            this.updateText();
        },

        checkHighScore: function() {
            var points = score.script.score.points;
            if (points > this.maxPoints && localStorage) {
                this.maxPoints = points;
                localStorage.setItem('tanky-high-score', this.maxPoints);
                this.updateText();
                congrats.enabled = true;
            }
        },

        updateText: function () {
            this.entity.script.font_renderer.text = 'High Score: ' + this.maxPoints;
        }
    }

    return highScoreScript;

});
