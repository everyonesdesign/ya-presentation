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

    _getActive: function(children) {
        for (var i=0; i<children.length; i++) {
            if (children[i].style.visibility != "hidden") {
                return i;
            }
        }
    },

    _moveManager: {
        goToAdjacentSlide: function(children, next) {
            var active = yaPresentation._getActive(children),
                method = next ? "_next" : "_prev";
            next = yaPresentation[method](active, children.length);
            yaPresentation._DOMManager.makeMove(children[active], children[next]);
        },
        goToSlide: function(children, index) {
            var active = yaPresentation._getActive(children);
            yaPresentation._DOMManager.makeMove(children[active], children[index]);
        },
        goToPrevSlide: function(children) {
            yaPresentation._moveManager.goToAdjacentSlide(children, false);
        },
        goToNextSlide: function(children) {
            yaPresentation._moveManager.goToAdjacentSlide(children, true);
        }
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
                if (i) children[i].style.visibility = "hidden";
            }
        },
        makeMove: function(prev, next) {
            next.style.visibility = "";
            next.className += " yap--toIn";
            prev.className += " yap--toOut";
            setTimeout(function() {
                next.className += " yap--in";
                prev.className += " yap--out";
            }, 0);
            setTimeout(function() {
                next.className = next.className.replace(/\s?(yap--toIn|yap--in)/g, "");
                prev.className = prev.className.replace(/\s?(yap--toOut|yap--out)/g, "");
                prev.style.visibility = "hidden";
            }, 500); //TODO: remove this hardcode
        }
    }

});



