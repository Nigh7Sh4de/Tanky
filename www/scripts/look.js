pc.script.create("look", function (app) {

    const MULT = 0.01 * 5;
    const POW = 1;

    var lookScript = function (entity) {
        this.entity = entity;

        var angles = entity.getLocalEulerAngles();

        this.ex = angles.x;
        this.ey = angles.y;
        this.firstTouch = {};
        this.curTouch = {};
        this.isPressed = false;

        app.touch.on('touchstart', this.onTouchStart, this);
        app.touch.on('touchmove', this.onTouchMove, this);
        app.touch.on('touchend', this.onTouchEnd, this);
        app.touch.on('touchleave', this.onTouchEnd, this);
        app.touch.on('touchcancel', this.onTouchEnd, this);


    };

    lookScript.prototype = {
        initialize: function () {

        },

        update: function (dt) {
            var shift = 1;
            if (app.keyboard.isPressed(pc.input.KEY_SHIFT)) {
                shift = 3;
            }

            if (app.keyboard.isPressed(pc.input.KEY_UP)) {
                this.ex -= 1 * 100 * MULT * dt * shift;
            }
            if (app.keyboard.isPressed(pc.input.KEY_DOWN)) {
                this.ex += 1 * 100 * MULT * dt * shift;
            }
            if (app.keyboard.isPressed(pc.input.KEY_LEFT)) {
                this.ey += 20 * 100 * MULT * dt * shift;
            }
            if (app.keyboard.isPressed(pc.input.KEY_RIGHT)) {
                this.ey -= 20 * 100 * MULT * dt * shift;
            }

            this.ex = pc.math.clamp(this.ex, -17, 1);

            this.entity.setEulerAngles(this.ex, this.ey, 0);
            if (this.isPressed) {
                var x = Math.pow(this.curTouch.y - this.firstTouch.y, POW) * MULT * 0.5;
                if (this.ex + x > -17 && this.ex + x < 1)
                    this.ex += x;
                var y = -Math.pow(this.curTouch.x - this.firstTouch.x, POW) * MULT;
                this.ey += y;
                this.entity.setEulerAngles(this.ex, this.ey, 0);
            }
        },

        onTouchStart: function (event) {
            var touches = event.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                if (touches[i].x > event.element.width / 2) {
                    this.firstTouch = touches[i];
                    this.curTouch = this.firstTouch;
                    this.isPressed = true;
                }
            }
        },

        onTouchMove: function (event) {
            var touches = event.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                if (touches[i].x > event.element.width / 2) {
                    this.curTouch = touches[i]
                }
            }

        },

        onTouchEnd: function (event) {
            for (var i = 0; i < event.changedTouches.length; i++)
                if (event.changedTouches[i].x > event.element.width / 2)
                    this.isPressed = false;
        },

        onMouseMove: function (event) {
            this.ex += event.dy * MULT;
            this.ex = pc.math.clamp(this.ex, -90, 90);
            this.ey -= event.dx * MULT;
        },

        onMouseDown: function (event) {}

    };

    return lookScript;

});
