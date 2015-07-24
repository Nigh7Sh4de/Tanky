pc.script.create("enemy", function (app) {

    const MULT = 3;
    const INTENSITY_MULT = 5;
    const INTENSITY_MIN = 25;
    const INTENSITY_MAX = 125;
    const MAX_TIME = 2;

    var enemyScript = function (entity) {
        this.entity = entity;
        this.dir = new pc.Vec3;
        this.entity.collision.on('collisionstart', this.onCollisionStart, this);
    };

    enemyScript.prototype = {
        initialize: function () {
            if (this.entity.move == null)
                console.error("Creating script 'enemy' for entity '" + this.entity.getName() + "' failed. move(dt, MULT) function must be defined");
            this.entity.script.burn.die = this.die;
            var player = tank.getPosition().clone();
            var pos = this.entity.getPosition().clone();
            this.dir = new pc.Vec3(
                player.x - pos.x,
                player.y - pos.y,
                player.z - pos.z
            );
            this.move = this.entity.move;
        },

        die: function () {
            this.entity.destroy();
            if (this.entity.glow)
                this.entity.glow.destroy();
        },

        onCollisionStart: function (result) {
            if (result.other.name == 'tank' && !this.entity.charmed) {
                if (health.script.health.decrease(1))
                    this.burn(this.entity);
                else {
                    this.burn(this.entity, base, gun);
                }
            } else if (result.other.name == 'enemy' && !result.other.charmed && this.entity.charmed) {
                var material = new pc.scene.PhongMaterial();
                var texture = app.assets.find('green.png');
                material.diffuseMap = texture.resource;
                material.update();

                result.other.model.material = material;
                this.burn(this.entity, result.other);
            }

        },

        burn: function () {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i].rigidbody)
                    arguments[i].rigidbody.enabled = false;
                arguments[i].script.burn.activate();
            }
        },

        move: function (dt, MULT) {},

        update: function (dt) {
            if (!this.entity.script.burn.active) {
                if (!this.entity.charmed)
                    this.move(dt, MULT * ((score.script.score.points / 100) + 1));
                if (gun.script.enabled) {
                    if (!this.entity.charmed && !this.entity.glow && !cam.camera.frustum.containsPoint(this.entity.getPosition())) {

                        var glow = new pc.Entity();
                        glow.addComponent('light', {
                            type: 'spot',
                            color: new pc.Color(1, 0, 0),
                            range: 20,
                            intensity: 0,
                            outerConeAngle: 15,
                            innerConeAngle: 15
                        });
                        glow.translate(0, 0.05, 0);
                        glow.lookAt(this.entity.getPosition());
                        glow.rotateLocal(-90, 0, 0);
                        glow.setName("glow");

                        tank.addChild(glow);
                        this.entity.glow = glow;
                        glow.enemy = this.entity;

                    } else if (this.entity.glow && this.entity.glow.light) {
                        if (this.entity.charmed || cam.camera.frustum.containsPoint(this.entity.getPosition())) {
                            this.entity.glow.destroy();
                            this.entity.glow = null;
                        } else
                            this.entity.glow.light.intensity = pc.math.clamp(INTENSITY_MULT * (30 - this.entity.getPosition().length()), INTENSITY_MIN, INTENSITY_MAX);

                    }
                }
            }

            if (this.entity.getPosition().y < -1) {
                this.die();
            }
        }
    }

    return enemyScript;

});
