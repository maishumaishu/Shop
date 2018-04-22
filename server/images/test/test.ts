import { Parser, OrderExpression } from "../expression";

let expr1 = Parser.parseOrderExpression('name desc') as OrderExpression;
// assert.equal(expr1.sortType, 'desc');



