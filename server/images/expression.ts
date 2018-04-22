enum TokenId {
    Amphersand,
    Asterisk,
    Bar,
    CloseParen,
    CloseBracket,
    Colon,
    Comma,
    Dot,
    DoubleBar,
    DoubleAmphersand,
    DoubleEqual,
    End,
    Equal,
    Exclamation,
    ExclamationEqual,
    GreaterThan,
    GreaterThanEqual,
    Identifier,
    IntegerLiteral,
    LessGreater,
    LessThan,
    LessThanEqual,
    Minus,
    RealLiteral,
    OpenBracket,
    OpenParen,
    Percent,
    Plus,
    Question,
    Semicolon,
    StringLiteral,
    Slash
}

export enum ExpressionTypes {
    Binary,
    Constant,
    Member,
    Method,
    Table,
    Unary,
    Order,
}

const KeyWords = {
    like: 'like',
    desc: 'desc',
    asc: 'asc',
}

interface Token {
    id: TokenId,
    text: string,
    pos: number
}

class Errors {
    static names = {
        UnterminatedStringLiteral: 'UnterminatedStringLiteral',
        ArgumentNull: 'ArgumentNull',
        ParseError: 'ParseError',
        NotImplemented: 'NotImplemented',
        UnknownToken: 'UnknownToken',
        UnexpectedToken: 'UnexpectedToken'
    }
    static argumentNull(name: string): any {
        return this.create(this.names.ArgumentNull, `Argument ${name} can not be null or empty.`);
    }
    static create(name: string, msg: string) {
        let err = new Error(msg);
        err.name = name;
        return err;
    }
    static unterminatedStringLiteral(literal: number) {
        return Errors.create(this.names.UnterminatedStringLiteral, `unterminated string literal at ${literal}`);
    };
    static parseError() {
        return Errors.create(this.names.ParseError, 'parse error');
    };
    static notImplemented() {
        return Errors.create(this.names.NotImplemented, 'notImplemented');
    }
    static unknownToken(token: Token) {
        let msg = `Unknowed token id "${token.text}"`;

    }
    static unexpectedToken(expected: TokenId, actual: TokenId): any {
        let msg = `Expect token "${expected}", Actual is "${actual}".`;
        return Errors.create(this.names.UnexpectedToken, msg);
    }
}

abstract class Expression {
    private _type: ExpressionTypes;
    constructor(type: ExpressionTypes) {
        this._type = type;
    }
    get type(): ExpressionTypes {
        return this._type;
    }
    abstract toString(): string;
}

export class ConstantExpression<T> extends Expression {
    _value: T;
    text: string;

    constructor(value: T) {
        super(ExpressionTypes.Constant);

        if (value === undefined)
            throw Errors.argumentNull('value'); //Errors.create('value is undefined');

        this.value = value;
        this.text = typeof (value) == 'string' ? `'${value}'` : `${value}`;
    }

    get value(): T {
        return this._value;
    }
    set value(value: T) {
        this._value = value;
    }

    toString() {
        return this.text;
    }
}

export class MemberExpression extends Expression {
    private _name: string;
    private _expression: Expression;
    private text;

    constructor(name: string, source?: Expression) {
        super(ExpressionTypes.Member);

        this._name = name;
        this._expression = source;
        this.text = `${name}`;
    }

    get expression(): Expression {
        return this._expression;
    }

    get name(): string {
        return this._name;
    }

    toString() {
        return this.text;
    }
}

export class BinaryExpression extends Expression {

    private _operator: string;
    private _rightExpression: Expression;
    private _leftExpression: Expression;

    private text;

    constructor(op: string, left: Expression, right: Expression) {
        super(ExpressionTypes.Binary)

        this._operator = op;
        this._leftExpression = left;
        this._rightExpression = right;

        this.text = `${left.toString()} ${op} ${right.toString()}`;
    }

    get leftExpression() {
        return this._leftExpression;
    }

    get rightExpression() {
        return this._rightExpression;
    }

    get operator() {
        return this._operator;
    }

    toString() {
        return this.text;
    }
}

// export class TableExpression extends Expression {
//     constructor(name: string) {
//         super(ExpressionTypes.Table);
//     }
// }

export class MethodCallExpression extends Expression {

    private args: Expression[];
    private method: string;
    // private instance: any;

    private text: string;

    constructor(method: string, args: Expression[]) {

        super(ExpressionTypes.Method);

        if (method == null)
            throw Errors.argumentNull('method');

        if (args == null)
            throw Errors.argumentNull('arugments');

        this.method = method;

        this.args = [];
        for (var i = 0; i < args.length; i++) {
            this.args[i] = args[i];
        }

        this.text = `${method}(${args.map(o => o.toString()).join(",")})`
    }

    // eval() {
    //     let func: Function = this.instance[this.method];
    //     return func.apply(this, this.args);
    // }
    toString() {
        return this.text;
    }
}

class UnaryExpression extends Expression {
    private text: string;
    constructor(op: string, expr: Expression) {
        super(ExpressionTypes.Unary);

        this.text = `${op}${expr.toString()}`;
    }

    toString() {
        return this.text;
    }
}

type SortType = 'desc' | 'asc';
export class OrderExpression extends Expression {
    private member: MemberExpression;
    private text: string;
    private _sortType: SortType;

    constructor(member: MemberExpression, sortType: SortType) {
        super(ExpressionTypes.Order);

        this._sortType = sortType;
        this.member = member;
        this.text = `${member.toString()} ${sortType}`
    }

    get sortType() {
        return this._sortType;
    }

    toString() {
        return this.text;
    }
}

// class NegateExpression extends UnaryExpression {
//     constructor(expr: Expression) {
//         super('-', expr);
//     }
// }

export class Parser {
    private textPos: number;
    private ch: string;
    private textLen: number;
    private text: string;
    private token: Token;
    private tokenText: string;

    private functions = {
        iif(arg1, arg2, arg3) {
            if (arg1 == true)
                return arg2;

            return arg3;
        }
    }

    private constants = {
        'null': new ConstantExpression(null),
        'true': new ConstantExpression(true),
        'false': new ConstantExpression(false)
    }

    private constructor(text: string) {
        this.text = text;
        this.textLen = text.length;
        this.setTextPos(0);
    }

    static parseExpression(text: string): Expression {
        let parser = new Parser(text);
        return parser.parse();
    }

    static parseOrderExpression(text: string): OrderExpression {

        let parser = new Parser(text);

        parser.nextToken();
        let expr = parser.parsePrimary();
        if (expr.type != ExpressionTypes.Member)
            throw Errors.parseError();

        let tokenText = parser.token.text;
        if (tokenText == 'asc' || tokenText == 'desc') {
            expr = new OrderExpression(expr as MemberExpression, tokenText);
            parser.nextToken();
        }
        else {
            expr = new OrderExpression(expr as MemberExpression, 'asc');
        }

        parser.validateToken(TokenId.End);
        return expr as OrderExpression;
    }

    private setTextPos(pos: number) {
        this.textPos = pos;
        this.ch = this.textPos < this.textLen ? this.text[this.textPos] : '\0';
    }
    private isLetter(s) {
        var patrn = /[A-Za-z]/;

        if (!patrn.exec(s))
            return false;
        return true;
    }
    private isDigit(s) {
        var patrn = /[0-9]/;

        if (!patrn.exec(s))
            return false;
        return true;
    }
    private nextChar() {
        if (this.textPos < this.textLen)
            this.textPos = this.textPos + 1;

        this.ch = this.textPos < this.textLen ? this.text[this.textPos] : '\0';
    }
    private nextToken() {
        while (this.ch == ' ') {
            this.nextChar();
        }

        var t: TokenId = null;
        var tokenPos = this.textPos;
        let ch = this.ch;
        switch (ch) {
            case '!':
                this.nextChar();
                if (this.ch == '=') {
                    this.nextChar();
                    t = TokenId.ExclamationEqual;
                }
                else {
                    t = TokenId.Exclamation;
                }
                break;
            case '%':
                this.nextChar;
                t = TokenId.Percent;
                break;
            case '&':
                this.nextChar();
                if (this.ch == '&') {
                    this.nextChar();
                    t = TokenId.DoubleAmphersand;
                }
                else {
                    t = TokenId.Amphersand;
                }
                break;
            case '(':
                this.nextChar();
                t = TokenId.OpenParen;
                break;
            case ')':
                this.nextChar();
                t = TokenId.CloseParen;
                break;
            case '*':
                this.nextChar();
                t = TokenId.Asterisk;
                break;
            case '+':
                this.nextChar();
                t = TokenId.Plus;
                break;
            case ',':
                this.nextChar();
                t = TokenId.Comma;
                break;
            case ';':
                this.nextChar();
                t = TokenId.Semicolon;
                break;
            case '-':
                this.nextChar();
                t = TokenId.Minus;
                break;
            case '.':
                this.nextChar();
                t = TokenId.Dot;
                break;
            case '/':
                this.nextChar();
                t = TokenId.Slash;
                break;
            case ':':
                this.nextChar();
                t = TokenId.Colon;
                break;
            case '<':
                this.nextChar();
                if (this.ch == '=') {
                    this.nextChar();
                    t = TokenId.LessThanEqual;
                }
                else if (this.ch == '>') {
                    this.nextChar();
                    t = TokenId.LessGreater;
                }
                else {
                    t = TokenId.LessThan;
                }
                break;
            case '=':
                this.nextChar();
                if (this.ch == '=') {
                    this.nextChar();
                    t = TokenId.DoubleEqual;
                }
                else {
                    t = TokenId.Equal;
                }
                break;
            case '>':
                this.nextChar();
                if (this.ch == '=') {
                    this.nextChar();
                    t = TokenId.GreaterThanEqual;
                }
                else {
                    t = TokenId.GreaterThan;
                }
                break;
            case '?':
                this.nextChar();
                t = TokenId.Question;
                break;
            case '[':
                this.nextChar();
                t = TokenId.OpenBracket;
                break;
            case ']':
                this.nextChar();
                t = TokenId.CloseBracket;
                break;
            case '|':
                this.nextChar();
                if (ch == '|') {
                    this.nextChar();
                    t = TokenId.DoubleBar;
                }
                else {
                    t = TokenId.Bar;
                }
                break;
            case '"':
            case '\'':
                var quote = this.ch;
                do {
                    this.nextChar();
                    while (this.textPos < this.textLen && this.ch != quote) this.nextChar();
                    if (this.textPos == this.textLen)
                        throw Errors.unterminatedStringLiteral(this.textPos);
                    //throw ParseError(textPos, Res.UnterminatedStringLiteral);
                    this.nextChar();
                } while (this.ch == quote);
                t = TokenId.StringLiteral;
                break;
            default:
                if (this.isLetter(this.ch)) {
                    do {
                        this.nextChar();
                    } while (this.isLetter(this.ch) || this.isDigit(this.ch));
                    t = TokenId.Identifier;
                    break;
                }
                if (this.isDigit(this.ch)) {
                    t = TokenId.IntegerLiteral;
                    do {
                        this.nextChar();
                    } while (this.isDigit(this.ch));
                    break;
                }
                if (this.ch == '.') {
                    t = TokenId.RealLiteral;
                    this.nextChar();
                    do {
                        this.nextChar();
                    } while (this.isDigit(this.ch));
                    break;
                }
                if (this.textPos == this.textLen) {
                    t = TokenId.End;
                    break;
                }
                throw Errors.parseError();
        }
        this.tokenText = this.text.substr(tokenPos, this.textPos - tokenPos);

        let id = t;
        let text = this.text.substr(tokenPos, this.textPos - tokenPos);
        let pos = tokenPos;
        this.token = { id, text, pos };
    }
    private parsePrimaryStart() {
        switch (this.token.id) {
            case TokenId.Identifier:
                return this.parseIdentifier();
            case TokenId.StringLiteral:
                return this.parseStringLiteral();
            case TokenId.IntegerLiteral:
                return this.parseIntegerLiteral();
            case TokenId.RealLiteral:
                return this._parseRealLiteral();
            case TokenId.OpenParen:
                return this.parseParenExpression();
            default:
                throw Errors.unknownToken(this.token); //Errors.create(`Unknowed token id "${this.token.id}"`); //ParseError(Res.ExpressionExpected);
        }
    }
    private validateToken(expectedTokenId: TokenId) {
        if (this.token.id != expectedTokenId) {
            throw Errors.unexpectedToken(expectedTokenId, this.token.id);
            // throw Errors.create(`Expect token "${expectedTokenId}", Actual is "${this.token.id}".`);
        }
    }
    private parseIntegerLiteral() {
        var expr = new ConstantExpression(new Number(this.token.text));
        this.nextToken();
        return expr;
    }
    private parseParenExpression() {
        this.validateToken(TokenId.OpenParen);
        this.nextToken();
        var expr = this.parseExpression();
        this.validateToken(TokenId.CloseParen);
        this.nextToken();
        return expr;
    }
    private parseStringLiteral() {
        var text = this.token.text;
        var expr = new ConstantExpression(text.substr(1, text.length - 2));
        this.nextToken();
        return expr;
    }
    private parseFunction(): Expression {
        let func = this.functions[this.tokenText];
        console.assert(func != null);
        this.nextToken();

        this.validateToken(TokenId.OpenParen);
        this.nextToken();

        let args = [];
        while (true) {
            let expr = this.parseExpression();
            args[args.length] = expr;
            if (this.token.id == TokenId.CloseParen)
                break;

            this.validateToken(TokenId.Comma);
            this.nextToken();
        }

        this.validateToken(TokenId.CloseParen);
        this.nextToken();

        let expr = new MethodCallExpression(func, args);
        return expr;
    }
    private parseIdentifier(): Expression {
        var self = this;
        var constant = this.constants[this.tokenText.toLowerCase()];
        if (constant != null) {
            this.nextToken();
            return constant;
        }
        var func = this.functions[this.tokenText];
        if (func != null) {
            return this.parseFunction();
        };

        let name = this.tokenText;
        this.nextToken();
        while (this.token.id == TokenId.Dot) {
            this.nextToken();
            name = name + '.' + this.token.text;
            this.nextToken();
        }

        let expr = new MemberExpression(name);
        return expr;

        // throw Errors.create(`Parse expression "${this.tokenText}" fail."`);
    }
    private parsePrimary() {
        switch (this.token.id) {
            case TokenId.Identifier:
                return this.parseIdentifier();
            case TokenId.StringLiteral:
                return this.parseStringLiteral();
            case TokenId.IntegerLiteral:
                return this.parseIntegerLiteral();
            case TokenId.RealLiteral:
                return this._parseRealLiteral();
            case TokenId.OpenParen:
                return this.parseParenExpression();
            default:
                throw Errors.unknownToken(this.token); //Errors.create(`Unknowed token id "${this.token.id}"`); //ParseError(Res.ExpressionExpected);
        }
    }
    // -, !, not unary operators
    private parseUnary() {
        let tokenId = this.token.id;
        if (tokenId == TokenId.Minus) {
            var op = this.token;
            this.nextToken();

            if (op.id == TokenId.Minus && (this.token.id == TokenId.IntegerLiteral || this.token.id == TokenId.RealLiteral)) {
                this.token.text = '-' + this.token.text;
                this.token.pos = op.pos;
                return this.parsePrimary();
            }
            var expr = this.parseUnary();
            if (op.id == TokenId.Minus) {
                expr = new UnaryExpression('-', expr);
            }
        }
        return this.parsePrimary();
    }
    private parseMultiplicative(): Expression {
        var left = this.parseUnary();
        while (this.token.id == TokenId.Asterisk || this.token.id == TokenId.Slash ||
            this.token.id == TokenId.Percent) {
            var op = this.token.text;
            this.nextToken();
            var right = this.parseUnary();

            var expr = new BinaryExpression(op, left, right);
            left = expr;
        }
        return left;
    }
    private parseLogicalOr(): Expression {
        var left = this.parseLogicalAnd();
        if (this.token.id == TokenId.DoubleBar || this.token.text == 'or') {
            var op = this.token.text;
            var right = this.parseLogicalAnd();
            var expr = new BinaryExpression(op, left, right);
            left = expr;
        }
        return left;
    }
    private parseLogicalAnd(): Expression {
        var left = this.parseComparison();
        if (this.token.id == TokenId.DoubleAmphersand || this.token.id == TokenId.Amphersand ||
            this.token.text == 'and') {

            var op = this.token.text;
            this.nextToken();
            var right = this.parseComparison();
            var expr = new BinaryExpression(op, left, right);
            left = expr;
        }
        return left;
    }
    // =, ==, !=, <>, >, >=, <, <= operators
    private parseComparison(): Expression {
        var left = this.parseAdditive();
        while (this.token.id == TokenId.Equal || this.token.id == TokenId.DoubleEqual ||
            this.token.id == TokenId.ExclamationEqual || this.token.id == TokenId.LessGreater ||
            this.token.id == TokenId.GreaterThan || this.token.id == TokenId.GreaterThanEqual ||
            this.token.id == TokenId.LessThan || this.token.id == TokenId.LessThanEqual ||
            this.token.text == KeyWords.like) {

            var op = this.token.text;
            this.nextToken();
            var right = this.parseAdditive();
            var expr = new BinaryExpression(op, left, right);
            left = expr;
        }
        return left;
    }
    // +, -, & operators
    private parseAdditive(): Expression {
        var left = this.parseMultiplicative();
        while (this.token.id == TokenId.Plus || this.token.id == TokenId.Minus || this.token.id == TokenId.Amphersand) {
            var tokenId = this.token.id;
            var tokenText = this.token.text;

            this.nextToken();
            var right = this.parseMultiplicative();
            var expr = new BinaryExpression(tokenText, left, right);
            left = expr;
        }
        return left;
    }
    private parseExpression(): Expression {
        var expr = this.parseLogicalOr();
        return expr;
    }
    private _parseRealLiteral(): Expression {
        this.validateToken(TokenId.RealLiteral);
        let text = this.token.text;
        let last = text[text.length - 1];
        let value = Number.parseFloat(text);

        return new ConstantExpression(value);
    }

    parse(): Expression {
        this.nextToken();
        var expr = this.parseExpression();
        this.validateToken(TokenId.End);
        return expr;
    }

}
