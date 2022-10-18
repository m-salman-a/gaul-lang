import * as Token from "./tokens/Token";
import PeekableIterator from "./peekableIterator";

export default class Lexer {
  constructor (it) {
    this.it = new PeekableIterator(it);
  }

  [Symbol.iterator] () {
    return this;
  }

  next () {
    const {
      value: { current, next },
      done,
    } = this.it.next();

    if (done) return { value: new Token.EOF(), done: true };

    if (current.match(/[ \n]/)) {
      return this.next();
    } else if (current === "\t") {
      return { value: new Token.Tab(), done: false };
    } else if (current.match(/[()\\[\]]/)) {
      return { value: new Token.Symbol(current), done: false };
    } else if (current.match(/[+\-\\*/%]/)) {
      return { value: new Token.Symbol(current), done: false };
    } else if (current.match(/[=!><]/)) {
      return {
        value: new Token.Symbol(this.#consumeOperator(current, next)),
        done: false,
      };
    } else if (current.match(/[.0-9]/)) {
      return {
        value: new Token.Num(this.#consumeNumber(current, next)),
        done: false,
      };
    } else if (current.match(/"/)) {
      return {
        value: new Token.Str(this.#consumeString(current, next)),
        done: false,
      };
    } else if (current.match(/[_0-z]/)) {
      return {
        value: new Token.Id(this.#consumeIdentifier(current, next)),
        done: false,
      };
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

    return numStr;
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
