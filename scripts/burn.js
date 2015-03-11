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
        this.originalMaterial;
    };


    burnScript.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.originalMaterial = this.entity.model.model.meshInstances[0].material;
        },

        activate: function () {
            this.time = 0;

            var model = this.entity.model.model;
            var gd = app.graphicsDevice;
            var vs = burn_vshader(gd.precision);
            var fs = burn_fshader(gd.precision);

            // Save the diffuse map from the original material before we replace it.
            this.diffuseTexture = model.meshInstances[0].material.diffuseMap;

            // A shader definition used to create a new shader.
            var shaderDefinition = {
                attributes: {
                    aPosition: pc.SEMANTIC_POSITION,
                    aUv0: pc.SEMANTIC_TEXCOORD0
                },
                vshader: vs,
                fshader: fs
            };

            // Create the shader from the definition
            this.shader = new pc.Shader(gd, shaderDefinition);

            // Create a new material and set the shader
            this.material = new pc.Material();
            this.material.setShader(this.shader);

            // Set the initial parameters
            this.material.setParameter('uTime', 0);
            this.material.setParameter('uDiffuseMap', this.diffuseTexture);

            // Replace the material on the model with our new material
            model.meshInstances[0].material = this.material;

            // Get the "clouds" height map from the assets and set the material to use it
            this.heightMap = app.assets.find(this.maps).resource;
            //            this.heightMap = this.maps;
            this.material.setParameter('uHeightMap', this.heightMap);

            this.active = true;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if (this.active) {
                this.time += dt * MULT;

                var t = (this.time % 2);
                if (t < 1)
                // Update the time value in the material
                    this.material.setParameter('uTime', t);
                else {
                    this.reset();
                    this.die(); // = true;
                    this.active = false;
                }
            }
        },

        reset: function () {
            this.entity.model.model.meshInstances[0].material = this.originalMaterial;
        },

        die: function () {}
    };

    return burnScript;
});
