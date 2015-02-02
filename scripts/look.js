pc.script.create("look", function (context) {

    const MULT = 0.00001;

    var lookScript = function (entity) {
        this.entity = entity;

        var angles = entity.getLocalEulerAngles();

        this.ex = angles.x;
        this.ey = angles.y;
        this.firstTouch = {};
        this.curTouch = {};
        this.isPressed = false;

        //        context.mouse.on(pc.input.EVENT_MOUSEMOVE, this.onMouseMove, this);
        //        context.mouse.on(pc.input.EVENT_MOUSEDOWN, this.onMouseDown, this);
        context.touch.on('touchstart', this.onTouchStart, this);
        context.touch.on('touchmove', this.onTouchMove, this);
        context.touch.on('touchend', this.onTouchEnd, this);
        context.touch.on('touchleave', this.onTouchEnd, this);
        context.touch.on('touchcancel', this.onTouchEnd, this);


    };

    lookScript.prototype = {
        initialize: function () {

        },

        update: function (dt) {
            this.entity.setEulerAngles(this.ex, this.ey, 0);
            if (this.isPressed) {
                this.ex += Math.pow(this.curTouch.y - this.firstTouch.y, 3) * MULT;
                this.ey += -Math.pow(this.curTouch.x - this.firstTouch.x, 3) * MULT;
                this.entity.setEulerAngles(this.ex, this.ey, 0);
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
            console.log('touch end');
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
            //                context.mouse.enablePointerLock();
        }

    };

    return lookScript;

});
