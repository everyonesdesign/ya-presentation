function prepareFixtureElement() {
    var div = document.createElement('div');
    div.id = "fixture";
    div.className = "container";
    document.body.appendChild(div);
}
prepareFixtureElement();

function prepareHTML() {
    var div = document.createElement('div'),
        child;
    div.className = "presentation";
    document.getElementById("fixture").appendChild(div);
    for (var i=0; i<3; i++) {
        child = document.createElement('div');
        child.className = "presentation-item";
        child.innerHTML = "<h1>Test</h1><p>Even more test</p>"
        div.appendChild(child);
    }
}

function bootstrapPresentation() {
    var div = document.getElementsByClassName("presentation")[0];
    yaPresentation._DOMManager.setInitialStyles(div, div.children);
    return div;
}

function clearHTML() {
    document.getElementById("fixture").innerHTML = "";
}


describe("General methods", function () {

    beforeEach(function() {
        prepareHTML();
    });
    afterEach(function() {
        clearHTML();
    });

    it("should have working extend internal method", function () {
        expect(yaPresentation._extend({}, {a: 1})).toEqual({a: 1});
    });

    it("should be able to execute nested extend", function () {
        expect(yaPresentation._extend({}, {a: {b: 1}})).toEqual({a: {b: 1}});
    });

    it("should be able to check is object a nodelist", function () {
        var div = bootstrapPresentation();
        expect(yaPresentation._isNodeList(div.children)).toBe(true);
        expect(yaPresentation._isNodeList(div)).toBe(false);
        expect(yaPresentation._isNodeList({})).toBe(false);
        expect(yaPresentation._isNodeList([])).toBe(false);
        expect(yaPresentation._isNodeList(123)).toBe(false);
        expect(yaPresentation._isNodeList("")).toBe(false);
    });

});

describe("Navigation", function () {

    it("should get next index with next method", function () {
        expect(yaPresentation._next(0, 2)).toEqual(1);
    });

    it("should get zero index with next method if last item here", function () {
        expect(yaPresentation._next(1, 2)).toEqual(0);
    });

    it("should get prev index with prev method", function () {
        expect(yaPresentation._prev(1, 2)).toEqual(0);
    });

    it("should get the last index with prev method if first item here", function () {
        expect(yaPresentation._prev(0, 2)).toEqual(1);
    });

});

describe("DOM Manager", function () {

    beforeEach(function() {
        prepareHTML();
    });
    afterEach(function() {
        clearHTML();
    });

    it("should be an object", function () {
        expect(typeof yaPresentation._DOMManager).toEqual("object");
    });

    it("should be able to set initial styles", function () {
        var div = bootstrapPresentation();
        expect(div.style.overflow).toEqual("hidden");
        expect(div.clientHeight).toEqual(400);

        expect(div.children[0].style.position).toEqual("absolute");
        expect(div.children[0].clientWidth).toEqual(800);
    });

    it("should leave first element visible and hide others", function() {
        var div = bootstrapPresentation();

        expect(div.children[0].style.visibility).toEqual("");
        expect(div.children[1].style.visibility).toEqual("hidden");
    });

    it("should be able to add CSS classes (begin moves)", function(done) {
        var div = document.getElementsByClassName("presentation")[0];
        yaPresentation._DOMManager.setInitialStyles(div, div.children);
        yaPresentation._DOMManager.makeMove(div.children[0], div.children[1], 500);
        expect(div.children[0].className).toMatch(/yap--toOut/);
        expect(div.children[1].className).toMatch(/yap--toIn/);
        setTimeout(function() {
            expect(div.children[0].className).toMatch(/yap--out/);
            expect(div.children[1].className).toMatch(/yap--in/);
            done();
        }, 100);
    });

    it("should be able to remove CSS classes (finish moves)", function(done) {
        var div = bootstrapPresentation();
        yaPresentation._DOMManager.makeMove(div.children[0], div.children[1], 500);

        setTimeout(function() {
            expect(div.children[0].className).not.toMatch(/yap--toOut/);
            expect(div.children[0].className).not.toMatch(/yap--out/);
            expect(div.children[1].className).not.toMatch(/yap--toIn/);
            expect(div.children[1].className).not.toMatch(/yap--in/);
            done();
        }, 600);
    });

    it("adds controls by default", function() {
        var $div = $(".presentation");
        $div.yaPresentation();
        expect($(".ya--control").length).toEqual(2);
    });

});

describe("Go to slide", function() {

    beforeEach(function() {
        prepareHTML();
    });
    afterEach(function() {
        clearHTML();
    });

    it("should be able to get active slide", function() {
        var div = bootstrapPresentation();
        var active = yaPresentation._getActive(div.children);
        expect(active).toEqual(0);
    });

    it("should be able to go prev", function(done) {
        var div = bootstrapPresentation();
        yaPresentation._moveManager.goToPrevSlide(div.children, 500);
        setTimeout(function() {
            expect(div.children[2].style.visibility).toEqual("");
            expect(div.children[0].style.visibility).toEqual("hidden");
            done();
        }, 600);
    });

    it("should be able to go next", function(done) {
        var div = bootstrapPresentation();
        yaPresentation._moveManager.goToNextSlide(div.children, 500);
        setTimeout(function() {
            expect(div.children[1].style.visibility).toEqual("");
            expect(div.children[0].style.visibility).toEqual("hidden");
            done();
        }, 600);
    });

    it("should be able to go to slide by index", function(done) {
        var div = bootstrapPresentation();
        yaPresentation._moveManager.goToSlide(div.children, 2, 500);
        setTimeout(function() {
            expect(div.children[2].style.visibility).toEqual("");
            expect(div.children[0].style.visibility).toEqual("hidden");
            done();
        }, 600);
    });

    it("should add prev class", function() {
        var div = bootstrapPresentation();
        yaPresentation._moveManager.goToPrevSlide(div.children, 500);
        expect(div.children[0].className).toMatch(/yap--prev/);
        expect(div.children[2].className).toMatch(/yap--prev/);
    });

    it("should not add prev class on next and goToSlide", function() {
        var div = bootstrapPresentation();
        yaPresentation._moveManager.goToNextSlide(div.children, 500);
        expect(div.children[0].className).not.toMatch(/yap--prev/);
        expect(div.children[1].className).not.toMatch(/yap--prev/);
        yaPresentation._moveManager.goToSlide(div.children, 0, 500);
        expect(div.children[0].className).not.toMatch(/yap--prev/);
        expect(div.children[1].className).not.toMatch(/yap--prev/);
    });

    it("should remove prev class", function(done) {
        var div = bootstrapPresentation();
        yaPresentation._moveManager.goToPrevSlide(div.children, 500);
        setTimeout(function() {
            expect(div.children[0].className).not.toMatch(/yap--prev/);
            expect(div.children[2].className).not.toMatch(/yap--prev/);
            done();
        }, 600);
    });

});

describe("Animation", function () {

    beforeEach(function () {
        prepareHTML();
    });
    afterEach(function () {
        clearHTML();
    });

    it("adds transition to object", function () {
        var div = bootstrapPresentation();
        yaPresentation._DOMManager.setTransition(div.children, 200);
        expect(div.children[0].style.transition).toEqual("200ms");
    });

    it("can reset animation", function () {
        var div = bootstrapPresentation();
        yaPresentation._DOMManager.setTransition(div.children, 200);
        yaPresentation._DOMManager.resetTransition(div.children);
        expect(div.children[0].style.transition).toEqual("");
    });

    it("toggles animation class", function () {
        var div = bootstrapPresentation();
        yaPresentation._DOMManager.setAnimationClass(div, "slide");
        expect(/\byap--ef-slide\b/.test(div.className)).toBe(true);
    });

    it("overrides animation class", function () {
        var div = bootstrapPresentation();
        yaPresentation._DOMManager.setAnimationClass(div, "slide");
        yaPresentation._DOMManager.setAnimationClass(div, "fade");
        expect(/\byap--ef-slide\b/.test(div.className)).toBe(false);
        expect(/\byap--ef-fade\b/.test(div.className)).toBe(true);
    });

});

describe("Outer API wrap", function() {

    beforeEach(function () {
        prepareHTML();
    });
    afterEach(function () {
        clearHTML();
    });

    it("return if there's no element", function() {
        var div = bootstrapPresentation();
        expect(yaPresentation()).toEqual(null);
    });

    it("should return an object", function() {
        var div = bootstrapPresentation();
        expect(typeof yaPresentation(div)).toEqual("object");
    });

    it("should be able to set options", function(done) {
        var div = document.getElementsByClassName("presentation")[0];
        var presentation = yaPresentation(div);
        presentation.setOptions({
           duration: 700
        });
        presentation.goToNextSlide();
        setTimeout(function() {
            expect(div.children[0].style.transition).toEqual("700ms");
            presentation.setOptions({
                animation: "slide"
            });
            expect(/\byap--ef-fade\b/.test(div.className)).toBe(false);
            expect(/\byap--ef-slide\b/.test(div.className)).toBe(true);
            done();
        }, 50);
    });

    it("should be able to set initial styles", function () {
        var div = document.getElementsByClassName("presentation")[0];
        yaPresentation(div);

        expect(div.style.overflow).toEqual("hidden");
        expect(div.clientHeight).toEqual(400);

        expect(div.children[0].style.position).toEqual("absolute");
        expect(div.children[0].clientWidth).toEqual(800);
    });

    it("sets animation class", function () {
        var div = document.getElementsByClassName("presentation")[0];
        yaPresentation(div, {
            animation: "slide"
        });
        expect(/\byap--ef-fade\b/.test(div.className)).toBe(false);
        expect(/\byap--ef-slide\b/.test(div.className)).toBe(true);
    });

    it("should be able to go prev", function(done) {
        var div = document.getElementsByClassName("presentation")[0];
        var presentation = yaPresentation(div);
        presentation.goToPrevSlide();
        setTimeout(function() {
            expect(div.children[2].style.visibility).toEqual("");
            expect(div.children[0].style.visibility).toEqual("hidden");
            done();
        }, 600);
    });

    it("should be able to go next", function(done) {
        var div = document.getElementsByClassName("presentation")[0];
        var presentation = yaPresentation(div);
        presentation.goToNextSlide();
        setTimeout(function() {
            expect(div.children[1].style.visibility).toEqual("");
            expect(div.children[0].style.visibility).toEqual("hidden");
            done();
        }, 600);
    });

    it("should be able to set presentation several times on one page", function() {
        //one more
        prepareHTML();

        var divs = document.getElementsByClassName("presentation");
        yaPresentation(divs);
        expect(divs[0].style.overflow).toEqual("hidden");
        expect(divs[1].style.overflow).toEqual("hidden");
        expect(divs[0].clientHeight).toEqual(400);
        expect(divs[1].clientHeight).toEqual(400);
    });

    it("wraps with jquery container", function() {
        var $div = $(".presentation");
        $div.yaPresentation();
        var div = $div[0];
        expect(div.style.overflow).toEqual("hidden");
        expect(div.clientHeight).toEqual(400);
        expect(div.children[0].style.position).toEqual("absolute");
        expect(div.children[0].clientWidth).toEqual(800);
    });

    it("can remove controls with options", function() {
        var $div = $(".presentation");
        $div.yaPresentation({
            controls: false
        });
        expect($(".ya--control").length).toEqual(0);
    });

});

