define([], function() {
    var inherit = function (ctor, ctor2) {
        function f() {};
        f.prototype = ctor2.prototype;
        ctor.prototype = new f;
    };

    return inherit;
});
