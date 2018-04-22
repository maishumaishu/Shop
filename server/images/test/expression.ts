import * as assert from 'assert';
import { Parser, ConstantExpression, ExpressionTypes, MemberExpression } from '../expression';

describe('Array', function () {
    it('constance expression test', function () {
        let expr = Parser.parse(`5`) as ConstantExpression<number>;
        assert(expr.type == ExpressionTypes.Constant)
        assert(expr.value == 5);

        let expr1 = Parser.parse(`"5"`) as ConstantExpression<string>;
        assert(expr1.type == ExpressionTypes.Constant);
        assert(expr1.value == "5");
    })

    it('unary expression test', function () {
        let expr = Parser.parse(`t1`);
        assert(expr.type == ExpressionTypes.Member);

        let expr1 = Parser.parse(`t1.name`) as MemberExpression;
        assert(expr1.type == ExpressionTypes.Member);
        assert(expr1.name == `t1.name`)

        let expr3 = Parser.parse(`db.t1.name`) as MemberExpression;
        assert(expr3.type == ExpressionTypes.Member);
        assert(expr3.name == `db.t1.name`)

        let expr2Error: Error = null;

        try {
            let expr2 = Parser.parse(`select t1`);
        }
        catch (err) {
            expr2Error = err;
            console.log(`err: ${err.name}`)
        }

        assert(expr2Error != null);
        console.log(expr2Error.name);
    })


});