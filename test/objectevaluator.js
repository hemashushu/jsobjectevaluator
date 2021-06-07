const assert = require('assert/strict');

const {ObjectEvaluator} = require('../index');

describe('ObjectEvaluator Test', () => {
    it('Test evaluate()', () => {
        // 基本数值计算
        let ra1 = new ObjectEvaluator('1 + 2 * 3').evaluate();
        assert.equal(ra1, 7);

        let ra2 = new ObjectEvaluator('2 ^ 3 % 3').evaluate();
        assert.equal(ra2, 2);

        // 基本数学函数
        let rb1 = new ObjectEvaluator('round(4.5)').evaluate();
        assert.equal(rb1, 5);

        let rb2 = new ObjectEvaluator('log10(100)').evaluate();
        assert.equal(rb2, 2);

        // 基本比较
        let rc1 = new ObjectEvaluator('0 > 1').evaluate();
        assert.equal(rc1, 0);

        let rc2 = new ObjectEvaluator('2>=1').evaluate();
        assert.equal(rc2, 1);

        // 基本逻辑
        let rd1 = new ObjectEvaluator('0 and 1').evaluate();
        assert.equal(rd1, 0);

        let rd2 = new ObjectEvaluator('1 and 1').evaluate();
        assert.equal(rd2, 1);

        let rd3 = new ObjectEvaluator('1 ? 2 : 3').evaluate();
        assert.equal(rd3, 2);

        // 集合
        let re1 = new ObjectEvaluator('3 in (2,3,4)').evaluate();
        assert.equal(re1, 1);

        let re2 = new ObjectEvaluator('3 not in (2,3,4)').evaluate();
        assert.equal(re2, 0);

        let re3 = new ObjectEvaluator('not (3 in (2,3,4))').evaluate();
        assert.equal(re3, 0);

        let re4 = new ObjectEvaluator('(2,3,4) has 4').evaluate();
        assert.equal(re4, 1);

        let re5 = new ObjectEvaluator('max(2,3,4)').evaluate();
        assert.equal(re5, 4);

        let re6 = new ObjectEvaluator('min(2,3,4)').evaluate();
        assert.equal(re6, 2);

        // 属性值为集合
        let rf1 = new ObjectEvaluator('count(numbers)').evaluate({numbers:[2,3,4]});
        assert.equal(rf1, 3);

        let rf2 = new ObjectEvaluator('maxof(numbers)').evaluate({numbers:[2,3,4]});
        assert.equal(rf2, 4);

        let rf3 = new ObjectEvaluator('minof(numbers)').evaluate({numbers:[2,3,4]});
        assert.equal(rf3, 2);

        // 对象
        let o1 = {
            number: 123,
            user:{
                name: 'foo',
                addr: {
                    city: 'sz'
                }
            }
        };

        let rg1 = new ObjectEvaluator('number').evaluate(o1);
        assert.equal(rg1, 123);

        let rg2 = new ObjectEvaluator('user.name').evaluate(o1);
        assert.equal(rg2, 'foo');

        let rg3 = new ObjectEvaluator('user.addr.city').evaluate(o1);
        assert.equal(rg3, 'sz');
    });

});
