import * as BinaryExpression from "./nodes/binary-expression.js";
import * as Literal from "./nodes/literal.js";
import * as Statement from "./nodes/statement.js";
import * as UnaryExpression from "./nodes/unary-expression.js";
import { Keywords } from "./keywords.js";
import { Program } from "./nodes/program.js";
import { Scope } from "./nodes/scope.js";
import { Variable } from "./nodes/variable.js";

class ParseToken {
  constructor (type, value, result = null) {
    this.type = type;
    this.value = value;
    this._result = result;
  }

  match (expected, func) {
    if (this._result) return this;
    if (this.type === expected) {
      return new ParseToken(this.type, this.value, func());
    }

    return this;
  }

  else (func) {
    if (this._result) return this;

    return new ParseToken(this.type, this.value, func());
  }

  result () {
    return this._result;
  }
}

export default class Parser {
  constructor (it) {
    this.it = it;
    this.nextToken = null;
    this.scopeStack = [];

    this.advance();
  }

  advance () {
    const token = this.it.next().value;

    this.nextToken = new ParseToken(token.type, token.value);
  }

  consume (expected) {
    const currentToken = this.nextToken;

    if (this.nextToken.type !== expected) {
      throw SyntaxError(
				`Expected token of type ${expected}, but got one of ${this.type} instead`
      );
    }

    this.advance();

    return currentToken.value;
  }

  parse () {
    return this.parseProgram();
  }

  /**
	 * <Program>
	 *  : <Statement>
	 *  ;
	 */
  parseProgram () {
    // TODO: refactor somehow
    const globalScope = new Scope();
    this.scopeStack.push(globalScope);

    const statement = this.parseStatement();

    return new Program(statement, globalScope);
  }

  /**
	 * <Statement>
	 *  : <If>
	 *  | <Assignment>
	 *  | <Expression>
	 *  ;
	 */
  parseStatement () {
    return this.nextToken
      .match(Keywords.IF, () => {})
      .match("id", () => this.parseAssignment())
      .else(() => this.parseExpression())
      .result();
  }

  /**
	 * <Assignment>
	 *  : identifier "itu" <Expression>
	 *  ;
	 */
  parseAssignment () {
    const identifier = this.parseIdentifier();
    this.consume(Keywords.ASSIGN);
    return new Statement.Assignment(
      identifier,
      this.parseExpression(),
      this.scopeStack.at(-1)
    );
  }

  /**
	 * <Expression>
	 *  : <Term> "+" <Term>
	 *  | <Term> "-" <Term>
	 *  | <Term>
	 *  ;
	 */
  parseExpression () {
    let left = this.parseTerm();
    let matched = true;

    while (matched) {
      matched = true;
      left = this.nextToken
        .match("+", () => {
          this.advance();
          return new BinaryExpression.Add(left, this.parseTerm());
        })
        .match("-", () => {
          this.advance();
          return new BinaryExpression.Subtract(left, this.parseTerm());
        })
        .else(() => {
          matched = false;
          return left;
        })
        .result();
    }

    return left;
  }

  /**
	 * <Term>
	 *  : <Unary> "*" <Unary>
	 *  | <Unary> "/" <Unary>
	 *  | <Unary>
	 *  ;
	 */
  parseTerm () {
    let left = this.parseUnary();
    let matched = true;

    while (matched) {
      matched = true;
      left = this.nextToken
        .match("*", () => {
          this.advance();
          return new BinaryExpression.Multiply(left, this.parseUnary());
        })
        .match("/", () => {
          this.advance();
          return new BinaryExpression.Divide(left, this.parseUnary());
        })
        .else(() => {
          matched = false;
          return left;
        })
        .result();
    }

    return left;
  }

  /**
	 * <Unary>
	 *  : "-" number
	 *  | <Literal>
	 *  ;
	 */
  parseUnary () {
    return this.nextToken
      .match("-", () => {
        this.advance();
        return new UnaryExpression.Negative(this.parseNumber());
      })
      .else(() => this.parseLiteral())
      .result();
  }

  /**
	 * <Literal>
	 *  : "(" <Expression> ")"
	 *  | <Boolean>
	 *  | number
	 *  | string
	 *  | identifier
	 *  ;
	 *
	 */
  parseLiteral () {
    return this.nextToken
      .match("(", () => {
        this.advance();
        const expression = this.parseExpression();
        this.consume(")");
        return expression;
      })
      .match("benar", () => this.parseBoolean())
      .match("salah", () => this.parseBoolean())
      .match("num", () => this.parseNumber())
      .match("str", () => this.parseString())
      .result();
  }

  /**
	 * identifier
	 */
  parseIdentifier () {
    const value = this.consume("id");
    const scope = this.scopeStack.at(-1);
    return new Variable(value, scope);
  }

  /**
	 * boolean
	 */
  parseBoolean () {
    return this.nextToken
      .match("benar", () => {
        this.advance();
        return new Literal.Boolean(true);
      })
      .match("salah", () => {
        this.advance();
        return new Literal.Boolean(false);
      })
      .result();
  }

  /**
	 * number
	 */
  parseNumber () {
    const value = this.consume("num");
    return new Literal.Number(value);
  }

  /**
	 * string
	 */
  parseString () {
    const value = this.consume("str");
    return new Literal.String(value);
  }
}
