import * as Token from "./tokens/Token.js";
import PeekableIterator from "./PeekableIterator.js";

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
        value: new Token.Symbol(this.#consumeToken(current, next, /=/)),
        done: false,
      };
    } else if (current.match(/[.0-9]/)) {
      return {
        value: new Token.Num(this.#consumeToken(current, next, /[.0-9]/)),
        done: false,
      };
    } else if (current.match(/"/)) {
      return {
        value: new Token.Str(this.#consumeToken("", next, /[^"]/)),
        done: false,
      };
    } else if (current.match(/\w/)) {
      return {
        value: new Token.Id(this.#consumeToken(current, next, /\w/)),
        done: false,
      };
    }

    throw SyntaxError(`Invalid token: '${current}'`);
  }

  #consumeToken (current, next, matcher) {
    let str = current;

    while (next?.match(matcher)) {
      ({ current, next } = this.it.next().value);

      str += current;
    }

    return str;
  }
}
