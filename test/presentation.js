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

    it("should bring first element to front", function() {
        var div = document.getElementsByClassName("presentation")[0];
        yaPresentation._DOMManager.setInitialStyles(div, div.children);

        expect(div.children[0].style.zIndex).toEqual("10");
        expect(div.children[1].style.zIndex).toEqual("");
    });


});

