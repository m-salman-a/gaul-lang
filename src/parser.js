import * as BinaryExpression from "./nodes/binary-expression.js";
import * as Literal from "./nodes/literal.js";
import * as Statement from "./nodes/statement.js";
import * as UnaryExpression from "./nodes/unary-expression.js";
import { Keywords } from "./keywords.js";
import { Program } from "./nodes/program.js";
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

  matchAny (expected, func) {
    if (this._result) return this;
    if (expected.includes(this.type)) {
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

    this.advance();
  }

  advance () {
    const token = this.it.next().value;

    this.nextToken = new ParseToken(token.type, token.value);
  }

  consume (expected) {
    const currentToken = this.nextToken;

    if (this.nextToken.type !== expected) {
      if (this.nextToken.type === "eof") {
        throw SyntaxError(`Unexpected end of file, missing ${expected} at ...`);
      }

      if (expected === "tab") {
        throw SyntaxError(`Missing indentation at ...`);
      }

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
    const statements = [];
    let matched = true;

    while (matched) {
      this.nextToken
        .match("eof", () => {
          matched = false;
          return new Statement.Empty();
        })
        .else(() => {
          statements.push(this.parseStatement());
        });
    }

    return new Program(statements);
  }

  /**
	 * <Statement>
	 *  : <If>
	 *  | <Assignment>
	 *  ;
	 */
  parseStatement () {
    return this.nextToken
      .match(Keywords.IF, () => this.parseIf())
      .match("id", () => this.parseAssignment())
      .else(() => this.parseExpression())
      .result();
  }

  /**
	 * <If>
	 *  : "kalo" <Expression> <BlockStatement> <If-end>
	 *  ;
	 */
  parseIf () {
    this.advance();

    const condition = this.parseExpression();
    const trueBlock = this.parseIfBlock();
    const falseBlock = this.parseIfEnd();

    return new Statement.If(condition, trueBlock, falseBlock);
  }

  /**
	 * <If-block>
	 *  : <Statement> <If-block>
	 *  ;
	 */
  parseIfBlock () {
    const statements = [];
    let matched = true;

    while (matched) {
      this.nextToken
        .matchAny([Keywords.END, Keywords.ELSEIF, Keywords.ELSE], () => {
          matched = false;
          return new Statement.Empty();
        })
        .match("eof", () => {
          this.consume(Keywords.END);
        })
        .else(() => {
          statements.push(this.parseStatement());
        });
    }

    return new Statement.Multiple(statements);
  }

  /**
	 * <If-end>
	 *  : "kalogak" <Expression> <If-block> <If-end>
	 *  | "lainnya" <If-block> "yaudah"
	 *  | "yaudah"
	 *  ;
	 */
  parseIfEnd () {
    return this.nextToken
      .match(Keywords.ELSEIF, () => {
        return this.parseIf();
      })
      .match(Keywords.ELSE, () => {
        this.advance();
        const block = this.parseIfBlock();
        this.advance();
        return block;
      })
      .match(Keywords.END, () => {
        this.advance();
        return new Statement.Empty();
      })
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
    return new Statement.Assignment(identifier, this.parseExpression());
  }

  /**
	 * <Expression>
	 *  : <Expression> "dan" <Expression>
	 *  | <Expression> "atau" <Expression>
	 *  | <CompExpression>
	 *  ;
	 */
  // TODO: refactor this sometime
  parseExpression () {
    let left = this.parseCompExpression();
    let matched = true;

    while (matched) {
      left = this.nextToken
        .match(Keywords.AND, () => {
          this.advance();
          return new BinaryExpression.And(left, this.parseCompExpression());
        })
        .match(Keywords.OR, () => {
          this.advance();
          return new BinaryExpression.Or(left, this.parseCompExpression());
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
	 * <CompExpression>
	 *  : <ArithExpression> ">" <ArithExpression>
	 *  | <ArithExpression> ">=" <ArithExpression>
	 *  | <ArithExpression> "<" <ArithExpression>
	 *  | <ArithExpression> "<=" <ArithExpression>
	 *  | <ArithExpression> "==" <ArithExpression>
	 *  | <ArithExpression> "!=" <ArithExpression>
	 *  | <ArithExpression>
	 */
  parseCompExpression () {
    const left = this.parseArithExpression();

    return this.nextToken
      .match("==", () => {
        this.advance();
        return new BinaryExpression.Equal(left, this.parseArithExpression());
      })
      .match("!=", () => {
        this.advance();
        return new BinaryExpression.NotEqual(left, this.parseArithExpression());
      })
      .match(">", () => {
        this.advance();
        return new BinaryExpression.GT(left, this.parseArithExpression());
      })
      .match(">=", () => {
        this.advance();
        return new BinaryExpression.GTE(left, this.parseArithExpression());
      })
      .match("<", () => {
        this.advance();
        return new BinaryExpression.LT(left, this.parseArithExpression());
      })
      .match("<=", () => {
        this.advance();
        return new BinaryExpression.LTE(left, this.parseArithExpression());
      })
      .else(() => left)
      .result();
  }

  /**
	 * <ArithExpression>
	 *  : <ArithExpression> "+" <ArithExpression>
	 *  | <ArithExpression> "-" <ArithExpression>
	 *  | <Term>
	 *  ;
	 */
  parseArithExpression () {
    let left = this.parseTerm();
    let matched = true;

    while (matched) {
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
	 *  : <Term> "*" <Term>
	 *  | <Term> "/" <Term>
	 *  | <Unary>
	 *  ;
	 */
  parseTerm () {
    let left = this.parseUnary();
    let matched = true;

    while (matched) {
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
	 *  | "bukan" <Expression>
	 *  | <Literal>
	 *  ;
	 */
  parseUnary () {
    return this.nextToken
      .match("-", () => {
        this.advance();
        return new UnaryExpression.Negative(this.parseNumber());
      })
      .match(Keywords.NOT, () => {
        this.advance();
        return new UnaryExpression.Not(this.parseExpression());
      })
      .else(() => this.parseLiteral())
      .result();
  }

  /**
	 * <Literal>
	 *  : "(" <Expression> ")"
	 *  | boolean
	 *  | number
	 *  | string
	 *  | identifier
	 *  ;
	 */
  parseLiteral () {
    return this.nextToken
      .match("(", () => {
        this.advance();
        const expression = this.parseExpression();
        this.consume(")");
        return expression;
      })
      .matchAny([Keywords.TRUE, Keywords.FALSE], () => this.parseBoolean())
      .match("num", () => this.parseNumber())
      .match("str", () => this.parseString())
      .match("id", () => this.parseIdentifier())
      .result();
  }

  /**
	 * identifier
	 */
  parseIdentifier () {
    const value = this.consume("id");
    return new Variable(value);
  }

  /**
	 * boolean
	 */
  parseBoolean () {
    return this.nextToken
      .match(Keywords.TRUE, () => {
        this.advance();
        return new Literal.Boolean(true);
      })
      .match(Keywords.FALSE, () => {
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
