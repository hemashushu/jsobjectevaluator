const { compileExpression } = require("../src/filtrex");

const { describe, it } = require("mocha");

const chai = require("chai");
const assertArrays = require('chai-arrays');

chai.use(assertArrays);
const { expect } = chai;


const eval = (str, obj) => compileExpression(str)(obj);




describe('Various other things', () => {



    it('in / not in', () => {
        expect( eval('5 in (1, 2, 3, 4)') ).equals(0);
        expect( eval('3 in (1, 2, 3, 4)') ).equals(1);
        expect( eval('5 not in (1, 2, 3, 4)') ).equals(1);
        expect( eval('3 not in (1, 2, 3, 4)') ).equals(0);
    });

    it('string support', () => {
        expect( eval('foo == "hello"', {foo:'hello'}) ).equals(1);
        expect( eval('foo == "hello"', {foo:'bye'  }) ).equals(0);
        expect( eval('foo != "hello"', {foo:'hello'}) ).equals(0);
        expect( eval('foo != "hello"', {foo:'bye'  }) ).equals(1);
        expect( eval('foo in ("aa", "bb")', {foo:'aa'}) ).equals(1);
        expect( eval('foo in ("aa", "bb")', {foo:'cc'}) ).equals(0);
        expect( eval('foo not in ("aa", "bb")', {foo:'aa'}) ).equals(0);
        expect( eval('foo not in ("aa", "bb")', {foo:'cc'}) ).equals(1);
    });

    it('regexp support', () => {
        expect( eval('foo ~= "^[hH]ello"', {foo:'hello'}) ).equals(1);
        expect( eval('foo ~= "^[hH]ello"', {foo:'bye'  }) ).equals(0);
    });

    it('array support', () => {
        const arr = eval('(42, "fifty", pi)', {pi: Math.PI});

        expect(arr).is.array();
        expect(arr).to.be.equalTo([42, "fifty", Math.PI]);
    });

    it('ternary operator', () => {
        expect( eval('1 > 2 ? 3 : 4') ).equals(4);
        expect( eval('1 < 2 ? 3 : 4') ).equals(3);
    });

    it('kitchensink', () => {
        var kitchenSink = compileExpression('4 > lowNumber * 2 and (max(a, b) < 20 or foo) ? 1.1 : 9.4');
        expect( kitchenSink({lowNumber: 1.5, a: 10, b: 12, foo: false}) ).equals(1.1);
        expect( kitchenSink({lowNumber: 3.5, a: 10, b: 12, foo: false}) ).equals(9.4);
    });

    it('custom functions', () => {
        let triple = x => x * 3;
        expect( compileExpression('triple(v)', {triple})({v:7}) ).equals(21);
    });

    it('custom property function basics', () => {
        expect(
            compileExpression('a', {}, name => name === 'a')()
        ).equals(1);

        expect(
            compileExpression('a + bb + ccc', {}, name => name.length)()
        ).equals(6);

        expect(
            compileExpression('a + b * c', {}, (name, get) => get(name))
            ({ a:1, b:2, c:3 })
        ).equals(7);

        expect(
            compileExpression('a', {}, (name, get) => get(name))({ a:true })
        ).equals(1);

        let object = {a:1};
        expect(
            compileExpression('a', {}, (_,__,obj) => obj === object)(object)
        ).equals(1);
    });

    it('custom property function text search', () => {
        let textToSearch = "able was i ere I saw elba\nthe Rain in spain falls MAINLY on the plain";
        let doesTextMatch = name =>  textToSearch.indexOf(name) !== -1;
        let evalProp = exp => compileExpression(exp, undefined, doesTextMatch)();
        

        expect( evalProp('able and was and i') ).equals(1);
        expect( evalProp('able and was and dog') ).equals(0);
        expect( evalProp('able or dog') ).equals(1);
        expect( evalProp('able') ).equals(1);
        expect( evalProp('Rain and (missing or MAINLY)') ).equals(1);
        expect( evalProp('NotThere or missing or falls and plain') ).equals(1);
    });

    it('custom property function proxy', () => {
        let prefixedName = (str, sub) => str.substr(0, sub.length) === sub && str.substr(sub.length);
        let tripleName = str => prefixedName(str, 'triple_');

        let proxy = (name, get) => tripleName(name) ? 3 * get(tripleName(name)) : get(name);
        let evalProp = exp => compileExpression(exp, {}, proxy)({ a:1, b:2, c:3 });

        expect( evalProp('a') ).equals(1);
        expect( evalProp('triple_a') ).equals(3);
        expect( evalProp('a + triple_b * c') ).equals(19);
    });

});
