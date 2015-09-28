//Custom inherit function
inherit = function (Self, Super) {
    Self.prototype = Object.create(Super.prototype);
    Self.prototype.constructor = Self;
}

setupForBurn = function (entity) {
    var model = entity.model.model;
    model.meshInstances.forEach(function (mesh) {
        mesh.originalMaterial = mesh.material.clone();
    });
}

buildSpriteEntity = function (name, texture, x, y, w, h, anchor, maxResHeight, depth, r, g, b) {
    var thing = new pc.Entity();
    thing.setName(name);
    var thingText = buildSprite(name, texture, x, y, w, h, anchor, maxResHeight, depth, r, g, b);
    thing.addComponent('script', {
        enabled: true,
        scripts: [thingText]
    });

    return thing;
}

buildSprite = function (name, texture, x, y, w, h, anchor, maxResHeight, depth, r, g, b) {
    var thingText = {
        name: name + 'Text',
        url: 'scripts/sprite-20150925-edited.js',
        attributes: [{
            name: 'textureAsset',
            value: texture
        }, {
            name: 'x',
            value: x
        }, {
            name: 'y',
            value: y
        }, {
            name: 'width',
            value: w
        }, {
            name: 'height',
            value: h
        }, {
            name: 'anchor',
            value: anchor
        }, {
            name: 'pivot',
            value: anchor
        }, {
            name: 'tint',
            type: 'rgba',
            value: [r, g, b, 1]
        }, {
            name: 'maxResHeight',
            value: maxResHeight != null && maxResHeight != 0 ? maxResHeight : 720
        }, {
            name: 'uPercentage',
            value: 1
        }, {
            name: 'vPercentage',
            value: 1
        }, {
            name: 'depth',
            value: depth != null && depth > 1 ? depth : 1
        }]

    };
    return thingText;
}

buildTextEntity = function (name, text, x, y, anchor, maxResHeight, depth, r, g, b, a) {
    var thing = new pc.Entity();
    thing.setName(name);
    var thingText = buildText(name, text, x, y, anchor, maxResHeight, depth, r, g, b);
    thing.addComponent('script', {
        enabled: true,
        scripts: [thingText]
    });
    return thing;
}

buildText = function (name, text, x, y, anchor, maxResHeight, depth, r, g, b) {
    var color = new pc.Color(1, 1, 1, 1);
    if (r != null)
        color = new pc.Color(r, r, r, 1);
    if (g != null)
        color.g = g;
    if (b != null)
        color.b = b;
    var thingText = {
        name: name + 'Text',
        url: 'scripts/font_renderer-20150925-edited.js',
        attributes: [{
            name: 'fontAtlas',
            value: 'boombox_72.png'
        }, {
            name: 'fontJson',
            value: 'boombox.json'
        }, {
            name: 'text',
            value: text
        }, {
            name: 'maxTextLength',
            value: '128'
        }, {
            name: 'x',
            value: x
        }, {
            name: 'y',
            value: y
        }, {
            name: 'anchor',
            value: anchor == null ? 0 : anchor
        }, {
            name: 'pivot',
            value: anchor == null ? 0 : anchor
        }, {
            name: 'tint',
            type: 'rgba',
            value: color
        }, {
            name: 'maxResHeight',
            value: (maxResHeight != 0 && maxResHeight != null) ? maxResHeight : 720
        }, {
            name: 'depth',
            value: depth > 1 ? depth : 1
        }]

    };

    return thingText;
}

var buildScript = function (name) {
    return {
        name: name,
        url: 'scripts/' + name + '.js'
    };
}
