//TODO: make a function to avoid names collisions?
var yaPresentation = function (el, options) {

    var children = el.children; //TODO: make it more cross-browser
    var defaults = {};
    var options = yaPresentation._extend(defaults, options);
    var presentation = {};

};
//extend method
yaPresentation._extend = function (target, source) {
    target = target || {};
    for (var prop in source) {
        if (typeof source[prop] === 'object') {
            target[prop] = yaPresentation._extend(target[prop], source[prop]);
        } else {
            target[prop] = source[prop];
        }
    }
    return target;
};

yaPresentation._extend(yaPresentation, {

    _next: function (index, count) {
        return index == count - 1 ? 0 : index + 1;
    },

    _prev: function (index, count) {
        return !index ? count - 1 : index - 1;
    },

    _DOMManager: {
        setInitialStyles: function (el, children) {
            el.style.overflow = "hidden";
            el.style.position = "relative";
            el.style.height = children[0].clientHeight + "px";
            for (var i = 0; i < children.length; i++) {
                children[i].style.right = 0;
                children[i].style.top = 0;
                children[i].style.left = 0;
                children[i].style.bottom = 0;
                children[i].style.position = "absolute";
                if (!i) children[i].style.zIndex = 10;
            }
        }
    }

});



