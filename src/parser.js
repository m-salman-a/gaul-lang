import * as BinaryExpression from "./nodes/BinaryExpression";
import * as Literal from "./nodes/Literal";
import * as Statement from "./nodes/Statement";
import * as UnaryExpression from "./nodes/UnaryExpression";
import { Scope } from "./nodes/Scope";
import { Variable } from "./nodes/Variable";
import PeekableIterator from "./peekableIterator";

export default class Parser {
  constructor (it) {
    this.it = new PeekableIterator(it);
    this.nextToken = null;
    this.globalScope = new Scope();
  }

  parse () {
    return this.#parseAssignment();
  }

  #skipToken () {
    ({ next: this.nextToken } = this.it.next().value);
  }

  #parseAssignment () {
    const left = this.#parseExpression();

    if (this.nextToken?.value === "itu") {
      this.#skipToken();
      const right = this.#parseExpression();
      return new Statement.Assignment(left, right, this.globalScope);
    }

    return left;
  }

  #parseExpression () {
    let left = this.#parseTerm();

    while (true) {
      if (this.nextToken?.type === "+") {
        this.#skipToken();
        const right = this.#parseTerm();
        left = new BinaryExpression.Add(left, right);
      } else if (this.nextToken?.type === "-") {
        this.#skipToken();
        const right = this.#parseTerm();
        left = new BinaryExpression.Subtract(left, right);
      } else {
        return left;
      }
    }
  }

  #parseTerm () {
    let left = this.#parseFactor();

    while (true) {
      if (this.nextToken?.type === "*") {
        this.#skipToken();
        const right = this.#parseFactor();
        left = new BinaryExpression.Multiply(left, right);
      } else if (this.nextToken?.type === "/") {
        this.it.next();
        const right = this.#parseFactor();
        left = new BinaryExpression.Divide(left, right);
      } else {
        return left;
      }
    }
  }

  #parseFactor () {
    const {
      value: { current, next },
      done,
    } = this.it.next();

    if (done) throw SyntaxError("Expected number, string, or identifier");

    this.nextToken = next;

    if (current.type === "num") {
      return new Literal.Number(current.value);
    } else if (current.type === "(") {
      const expression = this.#parseExpression();
      this.#skipToken();
      return expression;
    } else if (current.type === "-") {
      const expression = this.#parseExpression();
      return new UnaryExpression.Negative(expression);
    } else if (current.type === "id") {
      return new Variable(current.value, this.globalScope);
    }
  }
}
