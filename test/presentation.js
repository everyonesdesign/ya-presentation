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

function clearHTML() {
    document.getElementById("fixture").innerHTML = "";
}


describe("General methods", function () {

    it("should have working extend internal method", function () {
        expect(yaPresentation._extend({}, {a: 1})).toEqual({a: 1});
    });

    it("should be able to execute nested extend", function () {
        expect(yaPresentation._extend({}, {a: {b: 1}})).toEqual({a: {b: 1}});
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
        var div = document.getElementsByClassName("presentation")[0];
        yaPresentation._DOMManager.setInitialStyles(div, div.children);
        expect(div.style.overflow).toEqual("hidden");
        expect(div.clientHeight).toEqual(400);

        expect(div.children[0].style.position).toEqual("absolute");
        expect(div.children[0].clientWidth).toEqual(800);
    });

    it("should leave first element visible and hide others", function() {
        var div = document.getElementsByClassName("presentation")[0];
        yaPresentation._DOMManager.setInitialStyles(div, div.children);

        expect(div.children[0].style.visibility).toEqual("");
        expect(div.children[1].style.visibility).toEqual("hidden");
    });

    it("should be able to add CSS classes (begin moves)", function() {
        var div = document.getElementsByClassName("presentation")[0];
        yaPresentation._DOMManager.setInitialStyles(div, div.children);
        yaPresentation._DOMManager.makeMove(div.children[0], div.children[1]);

        expect(div.children[0].className).toMatch(/yap--toOut/);
        expect(div.children[0].className).toMatch(/yap--out/);
        expect(div.children[1].className).toMatch(/yap--toIn/);
        expect(div.children[1].className).toMatch(/yap--in/);
    });

    it("should be able to remove CSS classes (finish moves)", function(done) {
        var div = document.getElementsByClassName("presentation")[0];
        yaPresentation._DOMManager.setInitialStyles(div, div.children);
        yaPresentation._DOMManager.makeMove(div.children[0], div.children[1]);

        setTimeout(function() {
            expect(div.children[0].className).not.toMatch(/yap--toOut/);
            expect(div.children[0].className).not.toMatch(/yap--out/);
            expect(div.children[1].className).not.toMatch(/yap--toIn/);
            expect(div.children[1].className).not.toMatch(/yap--in/);
            done();
        }, 600);
    });


});

