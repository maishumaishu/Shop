import * as assert from 'assert';
import { Parser, ConstantExpression, ExpressionTypes, MemberExpression, BinaryExpression, OrderExpression } from '../expression';

describe('Expression', function () {
    it('constance expression test', function () {
        let expr = Parser.parseExpression(`5`) as ConstantExpression<number>;
        assert(expr.type == ExpressionTypes.Constant)
        assert(expr.value == 5);

        let expr1 = Parser.parseExpression(`"5"`) as ConstantExpression<string>;
        assert(expr1.type == ExpressionTypes.Constant);
        assert(expr1.value == "5");
    })

    it('unary expression test', function () {
        let expr = Parser.parseExpression(`t1`);
        assert(expr.type == ExpressionTypes.Member);

        let expr1 = Parser.parseExpression(`t1.name`) as MemberExpression;
        assert(expr1.type == ExpressionTypes.Member);
        assert(expr1.name == `t1.name`)

        let expr3 = Parser.parseExpression(`db.t1.name`) as MemberExpression;
        assert(expr3.type == ExpressionTypes.Member);
        assert(expr3.name == `db.t1.name`)

        let expr2Error: Error = null;

        try {
            let expr2 = Parser.parseExpression(`select t1`);
        }
        catch (err) {
            expr2Error = err;
        }

        assert(expr2Error != null);
        console.log(expr2Error.name);
    })

    it('Binary expression test', function () {

        let expr = Parser.parseExpression('name > 0') as BinaryExpression;
        assert(expr.type == ExpressionTypes.Binary);

        let expr1 = Parser.parseExpression(`name > 0 and a < 20`) as BinaryExpression;
        assert(expr1.type == ExpressionTypes.Binary);

        let expr2 = Parser.parseExpression(`namke like 'maishu'`) as BinaryExpression;
        assert(expr2.type == ExpressionTypes.Binary);
        console.log(expr2.toString())

    })

    it('Order expression test', function () {

        let expr = Parser.parseOrderExpression('name') as OrderExpression;
        assert.equal(expr.type, ExpressionTypes.Order);
        assert.equal(expr.sortType, 'asc');

        let expr1 = Parser.parseOrderExpression('name desc') as OrderExpression;
        assert.equal(expr1.sortType, 'desc');

        let expr2 = Parser.parseOrderExpression('name asc') as OrderExpression;
        assert.equal(expr2.sortType, 'asc');
    })

});