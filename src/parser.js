import * as BinaryExpression from "./nodes/BinaryExpression";
import * as Literal from "./nodes/Literal";
import * as UnaryExpression from "./nodes/UnaryExpression";
import PeekableIterator from "./peekableIterator";

export default class Parser {
  constructor (it) {
    this.it = new PeekableIterator(it);
    this.nextToken = null;
  }

  parse () {
    return this.#parseExpression();
  }

  #skipToken () {
    ({ next: this.nextToken } = this.it.next().value);
  }

  #parseExpression () {
    let left = this.#parseTerm();

    while (true) {
      if (this.nextToken?.value === "+") {
        this.#skipToken();
        const right = this.#parseTerm();
        left = new BinaryExpression.Add(left, right);
      } else if (this.nextToken?.value === "-") {
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
      if (this.nextToken?.value === "*") {
        this.#skipToken();
        const right = this.#parseFactor();
        left = new BinaryExpression.Multiply(left, right);
      } else if (this.nextToken?.value === "/") {
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
    } else if (current.value === "(") {
      const expression = this.#parseExpression();
      this.#skipToken();
      return expression;
    } else if (current.value === "-") {
      const expression = this.#parseExpression();
      return new UnaryExpression.Negative(expression);
    }
  }
}
