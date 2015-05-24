pc.script.create("look", function (app) {

    //    const MULT = 0.00001 * 2;
    const MULT = 0.01 * 5;
    const POW = 1;
    //    const POW = 2;

    //    const THRESHOLD = 2;
    //    const LITTLEMULT = 1;
    //    const LITTLEMULT = 0.75;

    var lookScript = function (entity) {
        this.entity = entity;

        var angles = entity.getLocalEulerAngles();

        this.ex = angles.x;
        this.ey = angles.y;
        this.firstTouch = {};
        this.curTouch = {};
        this.isPressed = false;

        //        app.mouse.on(pc.input.EVENT_MOUSEMOVE, this.onMouseMove, this);
        //        app.mouse.on(pc.input.EVENT_MOUSEDOWN, this.onMouseDown, this);
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
                var y = -Math.pow(this.curTouch.x - this.firstTouch.x, POW) * MULT; // * 0.1;
                //                if (Math.abs(y) < THRESHOLD)
                //                    y *= LITTLEMULT;
                //                console.log(x + ' ' + y);
                this.ey += y;
                this.entity.setEulerAngles(this.ex, this.ey, 0);
                //                console.log(this.ex + ' '  + this.ey);
            }
        },

        onTouchStart: function (event) {
            var touches = event.changedTouches;
            for (var i = 0; i < touches.length; i++) {
                //                console.log(touches[i].x > event.element.width / 2);
                if (touches[i].x > event.element.width / 2) {
                    //                    console.log('prev is set');
                    this.firstTouch = touches[i];
                    this.curTouch = this.firstTouch;
                    this.isPressed = true;
                }
            }
        },

        onTouchMove: function (event) {
            //            console.log('you moved');
            var touches = event.changedTouches;
            //            var this.curTouch = this.firstTouch;
            for (var i = 0; i < touches.length; i++) {
                //                console.log(touches[i].x > event.element.width / 2);
                if (touches[i].x > event.element.width / 2) {
                    //                    console.log(event.element.width);
                    this.curTouch = touches[i]
                        //                    console.log(this.curTouch.x);
                }
            }

        },

        onTouchEnd: function (event) {
            //            console.log('touch end');
            for (var i = 0; i < event.changedTouches.length; i++)
                if (event.changedTouches[i].x > event.element.width / 2)
                //Then it must be a look command ending
                    this.isPressed = false;
        },

        onMouseMove: function (event) {
            this.ex += event.dy * MULT;
            this.ex = pc.math.clamp(this.ex, -90, 90);
            this.ey -= event.dx * MULT;
        },

        onMouseDown: function (event) {
            // When the mouse button is clicked try and capture the pointer
            //            if (!pc.Mouse.isPointerLocked())
            //                app.mouse.enablePointerLock();
        }

    };

    return lookScript;

});
