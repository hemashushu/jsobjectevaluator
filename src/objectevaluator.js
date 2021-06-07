const filtrex = require('../libs/filtrex-mod');
const { compileExpression } = filtrex;

/**
 * 根据条件表达式筛选对象
 *
 */
class ObjectEvaluator {

    /**
     *
     * @param {*} queryExpression 字符串，查询表达式，比如：
     *     - 1+2+3 // 返回 1 + 2 + 3
     *     - "hello" // 返回 "hello"
     *     - city // 返回对象的 city 属性值
     *     - city == "shenzhen" // 返回比较结果
     *     - score in (60, 100)
     *     - addr.posecode == "518000" and checked == true
     */
    constructor(queryExpression) {
        this.evaluator = compileExpression(queryExpression);
    }

    /**
     * 计算表达式的运算结果
     *
     * @param {*} sourceObject 参与计算的对象
     * @returns 运算的结果一般是数字 0 和 1,但也可能为任意数据类型
     */
    evaluate(sourceObject = {}) {
        // filtrex 的条件比较结果只有 1 和 0 两种结果，分别表示 true 和 false，
        // 但表达式运算也可能直接返回数字、字符串、或者源对象的某个属性
        return this.evaluator(sourceObject);
    }

    /**
     * 计算表达式的运算结果是否为逻辑上的 true
     *
     * @param {*} sourceObject
     * @returns 当表达式运算的结果为 true, 或者非 0 数字，
     *     或者非空字符串时，返回 true，否则返回 false。
     */
    match(sourceObject = {}) {
        let result = this.evaluate(sourceObject);
        return (result === true ||
            (typeof result === 'number' && result !== 0) ||
            (typeof result === 'string' && result !== ''));
    }

}

module.exports = ObjectEvaluator;