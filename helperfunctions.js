//Dis how it should be and hopefully will be if PlayCanvas gets their shit together
inherit = function (Self, Super) {
    Self.prototype = Object.create(Super.prototype);
    //    Self.prototype = Super.prototype;
    //    Self.prototye = new Super;
    Self.prototype.constructor = Self;
}
