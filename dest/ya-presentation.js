//TODO: make a function to avoid names collisions?
var yaPresentation = function (el, options) {

    //incorrect arg
    if (!el) return null;

    //nodelist as art
    if (yaPresentation._isNodeList(el)) {
        for (var i=0; i<el.length; i++) {
            yaPresentation(el[i]);
        }
        return null;
    }

    //setting children and options
    var children = el.children; //TODO: make it more cross-browser
    var defaults = {
        animation: "fade",
        duration: 500
    };
    options = yaPresentation._extend(defaults, options);

    //initializing
    yaPresentation._DOMManager.setInitialStyles(el, children);
    yaPresentation._DOMManager.setAnimationClass(el, options.animation);
    yaPresentation._DOMManager.setTransition(children, options.duration);

    // return an object to control concrete presentation
    return {
        _options: options,
        _el: el,
        _children: children,
        setOptions: function(options) {
            this.options = yaPresentation._extend(this._options, options);
            yaPresentation._DOMManager.setAnimationClass(this._el, this._options.animation);
            yaPresentation._DOMManager.setTransition(this._children, this._options.duration);
        },
        goToPrevSlide: function() {
            yaPresentation._moveManager.goToPrevSlide(children, this._options.duration);
        },
        goToNextSlide: function() {
            yaPresentation._moveManager.goToNextSlide(children, this._options.duration);
        },
        goToSlide: function(index) {
            yaPresentation._moveManager.goToSlide(children, index, this._options.duration);
        }
    }
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

    _vendors: ["webkit", "moz", "ms", "o"],

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

    _isNodeList: function(object) {
        return (typeof object.length == 'number'
            && typeof object.item == 'function');
    },

    _moveManager: {
        goToAdjacentSlide: function(children, next, duration) {
            var active = yaPresentation._getActive(children),
                method = next ? "_next" : "_prev";
            next = yaPresentation[method](active, children.length);
            yaPresentation._DOMManager.makeMove(children[active], children[next], duration);
        },
        goToSlide: function(children, index, duration) {
            var active = yaPresentation._getActive(children);
            yaPresentation._DOMManager.makeMove(children[active], children[index], duration);
        },
        goToPrevSlide: function(children, duration) {
            yaPresentation._moveManager.goToAdjacentSlide(children, false, duration);
        },
        goToNextSlide: function(children, duration) {
            yaPresentation._moveManager.goToAdjacentSlide(children, true, duration);
        }
    },

    _DOMManager: {
        setInitialStyles: function (el, children) {
            el.style.overflow = "hidden";
            el.style.position = "relative";
            el.style.height = children[0].clientHeight + "px";
            for (var i = 0; i < children.length; i++) {
                children[i].style.top = 0;
                children[i].style.left = 0;
                children[i].style.width = "100%";
                children[i].style.height = "100%";
                children[i].style.position = "absolute";
                children[i].style.boxSizing = "border-box";
                children[i].style.mozBoxSizing = "border-box";
                if (i) children[i].style.visibility = "hidden";
            }
        },
        makeMove: function(prev, next, duration) {
            prev.className += " yap--toOut";
            next.className += " yap--toIn";
            next.style.visibility = "";
            setTimeout(function() {
                prev.className += " yap--out";
                next.className += " yap--in";
                yaPresentation._DOMManager.setTransition([prev, next], duration);
            }, 0);
            setTimeout(function() {
                next.className = next.className.replace(/\s?(yap--toIn|yap--in)/g, "");
                prev.className = prev.className.replace(/\s?(yap--toOut|yap--out)/g, "");
                prev.style.visibility = "hidden";
                yaPresentation._DOMManager.resetTransition([prev, next]);
            }, duration);
        },
        setTransition: function(children, duration) {
            var value = duration ? duration+"ms" : "";
            for (var i=0; i<children.length; i++) {
                for (var j=0; j<yaPresentation._vendors.length; j++) {
                    children[i].style[yaPresentation._vendors[j]+"transition"] = value;
                }
                children[i].style["transition"] = value;
            }
        },
        resetTransition: function(children) {
            yaPresentation._DOMManager.setTransition(children, null);
        },
        setAnimationClass: function(div, className) {
            div.className = div.className.replace(/\s*\byap--ef-.*?(\s|$)\b/, "$1") +" yap--ef-"+ className;
        }
    }

});



