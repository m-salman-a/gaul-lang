class Token {
  constructor (type) {
    this.type = type;
  }
}

class EOF extends Token {
  constructor (value) {
    super("eof");
    this.value = value;
  }
}

class Tab extends Token {
  constructor (value) {
    super("tab");
    this.value = value;
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

module.exports = {
  EOF,
  Tab,
  Num,
  Str,
  Symbol,
  Id,
};
