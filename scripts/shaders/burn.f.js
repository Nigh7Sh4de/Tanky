var burn_fshader = function (precision) {
    return [
                    "precision " + precision + " float;",
                    "",
                    "varying vec2 vUv0;",
                    "",
                    "uniform sampler2D uDiffuseMap;",
                    "uniform sampler2D uHeightMap;",
                    "uniform float uTime;",
                    "",
                    "void main(void)",
                    "{",
                    "    float height = texture2D(uHeightMap, vUv0).r;",
                    "    vec4 color = texture2D(uDiffuseMap, vUv0);",
                    "    if (height < uTime) {",
                    "      discard;",
                    "    }",
                    "    if (height < (uTime+0.04)) {",
                    "      color = vec4(1.0, 0.0, 0.0, 1.0);",
                    "    }",
                    "    gl_FragColor = color;",
                    "}"
                    ].join("\n");
}
