export default class Lexer {
  constructor (it) {
    this.it = it;
  }

  [Symbol.iterator] () {
    return this;
  }

  next () {
    const {
      value: { current, next },
      done,
    } = this.it.next();

    if (done) return { type: "eof" };

    if (current.match(/[ \n]/)) {
      return this.next();
    } else if (current === "\t") {
      return { type: "tab" };
    } else if (current === "(") {
      return { type: "lparen" };
    } else if (current === ")") {
      return { type: "rparen" };
    } else if (current.match(/[+\\-\\*/%]/)) {
      return { type: current };
    } else if (current.match(/[=!><]/)) {
      return { type: this.#consumeOperator(current, next) };
    } else if (current.match(/[.0-9]/)) {
      return { type: "num", value: this.#consumeNumber(current, next) };
    } else if (current.match(/"/)) {
      return { type: "str", value: this.#consumeString(current, next) };
    } else if (current.match(/[_0-z]/)) {
      return { type: "id", value: this.#consumeIdentifier(current, next) };
    }
    throw SyntaxError(`Invalid token: '${current}'`);
  }

  #consumeOperator (current, next) {
    let opStr = current;

    if (next?.match(/=/)) {
      ({ current, next } = this.it.next().value);

      opStr += current;
    }
    return opStr;
  }

  #consumeNumber (current, next) {
    let numStr = current;

    while (next?.match(/[.0-9]/)) {
      ({ current, next } = this.it.next().value);

      numStr += current;
    }

    return Number(numStr);
  }

  #consumeString (current, next) {
    let str = "";

    while (next?.match(/[^"]/)) {
      ({ current, next } = this.it.next().value);

      str += current;

      if (next?.match(/["]/)) return str;
    }

    throw SyntaxError('Missing " at end of string');
  }

  #consumeIdentifier (current, next) {
    let idStr = current;

    while (next?.match(/[_0-z]/)) {
      ({ current, next } = this.it.next().value);

      idStr += current;
    }

    return idStr;
  }
}
