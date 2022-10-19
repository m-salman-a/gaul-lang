class Token {
  constructor (type) {
    this.type = type;
  }
}

class EOF extends Token {
  constructor () {
    super("eof");
  }
}

class Tab extends Token {
  constructor () {
    super("tab");
  }
}

class Num extends Token {
  constructor (value) {
    super("num");
    this.value = value;
  }
}

class Str extends Token {
  constructor (value) {
    super("str");
    this.value = value;
  }
}

class Symbol extends Token {}

class Id extends Token {
  constructor (value) {
    super("id");
    this.value = value;
  }
}

export { EOF, Tab, Num, Str, Symbol, Id };
