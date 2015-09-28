pc.script.attribute('maps', 'string');

pc.script.create('burn', function (app) {
    // Creates a new burnScript instance
    const MULT = 2;

    var burnScript = function (entity) {
        this.entity = entity;


        this.time = 0;
        this.heightMap = null;
        this.shader = null;

        this.active = false;
        //        this.originalMaterial;
    };


    burnScript.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            var gd = app.graphicsDevice;
            var vs = burn_vshader(gd.precision);
            var fs = burn_fshader(gd.precision);
            var shaderDefinition = {
                attributes: {
                    aPosition: pc.SEMANTIC_POSITION,
                    aUv0: pc.SEMANTIC_TEXCOORD0
                },
                vshader: vs,
                fshader: fs
            };
            this.shader = new pc.Shader(gd, shaderDefinition);
            this.heightMap = app.assets.find(this.maps).resource;
        },

        activate: function () {
            var model = this.entity.model.model;
            this.entity.model.castShadows = false;

            model.meshInstances.forEach(function (mesh) {
                var diffuseMap = mesh.material.diffuseMap;
                mesh.material = new pc.Material();
                mesh.material.setShader(this.shader);
                mesh.material.setParameter('uHeightMap', this.heightMap);
                mesh.material.setParameter('uTime', 0);
                mesh.material.setParameter('uDiffuseMap', diffuseMap);
                mesh.time = 0;
                mesh.burnActive = true;
            }.bind(this));
            this.active = true;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if (this.active) {
                this.active = false;
                this.entity.model.model.meshInstances.forEach(function (mesh) {
                    if (!mesh.burnActive)
                        return;
                    this.active = true;
                    mesh.time += dt * MULT;

                    var t = (mesh.time % 2);
                    if (t < 1) {
                        // Update the time value in the material
                        mesh.material.setParameter('uTime', t);
                        return;
                    }
                    mesh.burnActive = false;

                }.bind(this));
                if (!this.active) {
                    this.reset();
                    this.die();
                }
            }
        },

        reset: function () {

            this.entity.model.model.meshInstances.forEach(function (mesh) {
                mesh.material = mesh.originalMaterial;
            });
            this.entity.model.castShadows = true;
        },

        die: function () {}
    };

    return burnScript;
});
