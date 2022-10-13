export default class PeekableStream {
  constructor (string) {
    this.it = string[Symbol.iterator]();
    this.#peekNext();
  }

  #peekNext () {
    this.peek = this.it.next();
  }

  next () {
    if (this.peek.done) {
      return { value: undefined, done: true };
    }

    const char = this.peek.value;

    this.#peekNext();

    return { value: char, done: false };
  }
}
