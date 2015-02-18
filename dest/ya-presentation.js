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
    var children = el.children;
    if (children.length < 2) return null;

    var defaults = {
        animation: "fade",
        duration: 500,
        texts: ["< Пред","След >", "На весь экран"],
        clickToNext: true,
        controls: false,
        fullscreenControl: false
    };
    options = yaPresentation._extend(defaults, options);

    //initializing
    yaPresentation._DOMManager.setInitialStyles(el, children);
    yaPresentation._DOMManager.setAnimationClass(el, options.animation);

    var presentation = {
        _options: options,
        _el: el,
        _children: children,
        _inProgress: false,
        _setInProgress: function() {
            if (this._inProgress) return false;
            return this._inProgress = true;
        },
        _resetInProgress: function() {
            var obj = this;
            setTimeout(function() {
                obj._inProgress = false;
            }, obj._options.duration);
        },
        setOptions: function(options) {
            this.options = yaPresentation._extend(this._options, options);
            yaPresentation._DOMManager.setAnimationClass(this._el, this._options.animation);
        },
        goToPrevSlide: function() {
            if (!this._setInProgress()) return;
            yaPresentation._moveManager.goToPrevSlide(children, this._options.duration);
            this._resetInProgress();
        },
        goToNextSlide: function() {
            if (this._inProgress) return;
            this._inProgress = true;
            yaPresentation._moveManager.goToNextSlide(children, this._options.duration);
            this._resetInProgress();
        },
        goToSlide: function(index) {
            if (this._inProgress) return;
            this._inProgress = true;
            yaPresentation._moveManager.goToSlide(children, index, this._options.duration);
            this._resetInProgress();
        },
        goFullscreen: function() {
            yaPresentation._addKeyboardListener(presentation);
            yaPresentation._DOMManager.goFullscreen(el);
        },
        exitFullscreen: function() {
            yaPresentation._removeKeyboardListener();
            yaPresentation._DOMManager.exitFullscreen(el);
        },
        toggleFullscreen: function() {
            if (yaPresentation._DOMManager.toggleFullscreen(el)) {
                yaPresentation._addKeyboardListener(presentation);
            } else {
                yaPresentation._removeKeyboardListener();
            }
        }
    };

    if (options.controls) {
        var controlButtons = yaPresentation._DOMManager.addControls(el, options.texts);
        controlButtons[0].addEventListener("click", function() {
            presentation.goToPrevSlide();
        });
        controlButtons[1].addEventListener("click", function() {
            presentation.goToNextSlide();
        });
    }

    if (options.clickToNext) {
        el.style.cursor = "pointer";
        el.addEventListener("click", function() {
            presentation.goToNextSlide();
        });
    }

    if (options.fullscreenControl) {
        var fullscreenControl = yaPresentation._DOMManager.addFullscreenControl(el, options.texts);
        fullscreenControl.addEventListener("click", function() {
            presentation.toggleFullscreen();
        });
    }

    // return an object to control concrete presentation
    return presentation;
};
if (typeof jQuery !== "undefined") {
    jQuery.fn.yaPresentation = function(options) {
        if (this.length == 1) {
            return yaPresentation(this[0], options);
        } else {
            this.each(function() {
                yaPresentation(this, options);
            });
            return this;
        }
    }
}
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
        return 0;
    },

    _isNodeList: function(object) {
        return (typeof object.length == 'number'
            && typeof object.item == 'function');
    },

    _insertAfter: function(newElement,targetElement) {
        var parent = targetElement.parentNode;
        if(parent.lastchild == targetElement) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    },

    _addKeyboardListener: function(presentation) {
        document.addEventListener("keydown", yaPresentation._keyBoardNav);
        document.yaPresentation = presentation;
    },

    _removeKeyboardListener: function() {
        document.removeEventListener("keydown", yaPresentation._keyBoardNav);
        document.yaPresentation = null;
    },

    _keyBoardNav: function(e) {
        if (!document.yaPresentation) return;
        if (e.keyCode == 37) document.yaPresentation.goToPrevSlide();
        else if (e.keyCode == 39) document.yaPresentation.goToNextSlide();
        else if (e.keyCode == 27) document.yaPresentation.exitFullscreen();
    },

    _requestFullscreenAPI: function(element) {
        if (document.body.requestFullscreen) {
            document.body.requestFullscreen();
        } else if (document.body.mozRequestFullScreen) {
            document.body.mozRequestFullScreen();
        } else if (document.body.webkitRequestFullscreen) {
            document.body.webkitRequestFullscreen();
        }
    },

    _cancelFullscreenAPI: function() {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    },

    _moveManager: {
        goToAdjacentSlide: function(children, isPrev, duration) {
            var active = yaPresentation._getActive(children),
                method = isPrev ? "_prev" : "_next";
            next = yaPresentation[method](active, children.length);
            yaPresentation._DOMManager.makeMove(children[active], children[next], duration, isPrev);
        },
        goToSlide: function(children, index, duration) {
            var active = yaPresentation._getActive(children);
            yaPresentation._DOMManager.makeMove(children[active], children[index], duration);
        },
        goToPrevSlide: function(children, duration) {
            yaPresentation._moveManager.goToAdjacentSlide(children, true, duration);
        },
        goToNextSlide: function(children, duration) {
            yaPresentation._moveManager.goToAdjacentSlide(children, false, duration);
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
        makeMove: function(prev, next, duration, isPrev) {
            isPrev = !!isPrev;
            prev.className += " yap--toOut";
            next.className += " yap--toIn";
            if (isPrev) {
                prev.className += " yap--prev";
                next.className += " yap--prev";
            }
            next.style.visibility = "";
            setTimeout(function() {
                prev.className += " yap--out";
                next.className += " yap--in";
                yaPresentation._DOMManager.setTransition([prev, next], duration);
            }, 0);
            setTimeout(function() {
                next.className = next.className.replace(/\s?(yap--toIn|yap--in|yap--prev)/g, "");
                prev.className = prev.className.replace(/\s?(yap--toOut|yap--out|yap--prev)/g, "");
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
        setAnimationClass: function(el, className) {
            el.className = el.className.replace(/\s*\byap--ef-\w+\b/g, "") +" yap--ef-"+ className;
        },
        addControls: function(el, texts) {
            var prev = document.createElement('div');
            prev.className += "yap--control yap--control-prev";
            if (texts&&texts[0]) prev.innerText = texts[0];
            var next = document.createElement('div');
            next.className += "yap--control yap--control-next";
            if (texts&&texts[1]) next.innerText = texts[1];
            yaPresentation._insertAfter(prev, el);
            yaPresentation._insertAfter(next, el);
            return [prev, next];
        },
        goFullscreen: function(el) {
            el.className += " yap--fullscreen";
            yaPresentation._requestFullscreenAPI(el);
        },
        exitFullscreen: function(el) {
            el.className = el.className.replace(/yap--fullscreen/g, "");
            yaPresentation._cancelFullscreenAPI();
        },
        toggleFullscreen: function(el) {
            if (!/\byap--fullscreen\b/.test(el.className)) {
                yaPresentation._DOMManager.goFullscreen(el);
                return true;
            } else {
                yaPresentation._DOMManager.exitFullscreen(el);
                return false;
            }
        },
        addFullscreenControl: function(el, texts) {
            var control = document.createElement('div');
            control.className += "yap--fullscreenControl";
            if (texts&&texts[2]) control.innerText = texts[2];
            yaPresentation._insertAfter(control, el);
            return control;
        }
    }
});



