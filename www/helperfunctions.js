//Dis how it should be and hopefully will be if PlayCanvas gets their shit together
inherit = function (Self, Super) {
    Self.prototype = Object.create(Super.prototype);
    //    Self.prototype = Super.prototype;
    //    Self.prototye = new Super;
    Self.prototype.constructor = Self;
}

buildText = function (text, x, y) {
    var thing = new pc.fw.Entity();
    thing.setName('text_' + text);
    var thingText = {
        name: 'thingText',
        url: 'scripts/font_renderer.js',
        attributes: [{
            name: 'fontAtlas',
            value: 'boombox_72.png'
        }, {
            name: 'fontJson',
            value: 'boombox'
        }, {
            name: 'text',
            value: text
        }, {
            name: 'maxTextLength',
            value: '64'
        }, {
            name: 'x',
            value: x
        }, {
            name: 'y',
            value: y
        }, {
            name: 'anchor',
            value: 4
        }, {
            name: 'pivot',
            value: 4
        }, {
            name: 'tint',
            type: 'rgba',
            value: [0, 0, 0, 1]
        }, {
            name: 'maxResHeight',
            value: 720
        }, {
            name: 'depth',
            value: 1
        }]

    };

    thing.addComponent('script', {
        enabled: true,
        scripts: [thingText]
    });

    return thing;
}
