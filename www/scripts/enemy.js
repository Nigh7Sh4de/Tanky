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
        //        this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
        //        this.stats = app.root.findByName('stats');
        //        this.score = this.stats.findByName('score');
        //        this.health = this.stats.findByName('health');
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
            //            if (this.entity.dead) {
            //                this.entity.enabled = false;
            this.entity.destroy();
            if (this.entity.glow)
                this.entity.glow.destroy();
            //                return;
            //            }
        },

        onCollisionStart: function (result) {
            //            console.log(result.other.isBullet === true);
            /*if (result.other.isBullet) {
                var material = new pc.scene.PhongMaterial();
                var texture = app.assets.find('green.png');
                material.diffuseMap = texture.resource;
                //            material.diffuse = new pc.Color(1.0, 0.0, 0.0, 1.0);
                material.update();

                this.entity.model.material = material;
                this.burn(this.entity, result.other);
                score.script.score.increase(10);
            } else*/
            if (result.other.name == 'tank' && !this.entity.charmed) {
                //                this.burn(this.entity, result.other);
                if (health.script.health.decrease(1))
                    this.burn(this.entity);
                else {
                    this.burn(this.entity, base, gun);
                }
                //                this.burn(this.entity);
            } else if (result.other.name == 'enemy' && !result.other.charmed && this.entity.charmed) {
                var material = new pc.scene.PhongMaterial();
                var texture = app.assets.find('green.png');
                material.diffuseMap = texture.resource;
                //            material.diffuse = new pc.Color(1.0, 0.0, 0.0, 1.0);
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
                //                arguments[i].rigidbody.
                //                arguments[i].model.castShadows = false;
            }
        },

        move: function (dt, MULT) {},

        update: function (dt) {
            if (!this.entity.script.burn.active) {
                //                console.log(dt);
                if (!this.entity.charmed)
                    this.move(dt, MULT * ((score.script.score.points / 100) + 1));
                if (gun.script.enabled) {
                    if (!this.entity.charmed && !this.entity.glow && !cam.camera.frustum.containsPoint(this.entity.getPosition())) {

                        var glow = new pc.fw.Entity();
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
                //                this.entity.enabled = false;
                this.die();
            }
        }
    }

    return enemyScript;

});