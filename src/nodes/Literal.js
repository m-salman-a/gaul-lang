class Literal {
  constructor (value) {
    this.value = value;
  }

  eval () {
    throw new Error("Must implement an eval() method");
  }
}

class StringLiteral extends Literal {
  eval () {
    return this.value;
  }
}

class NumberLiteral extends Literal {
  eval () {
    return Number(this.value);
  }
}

module.exports = {
  String: StringLiteral,
  Number: NumberLiteral,
};
