class UnaryExpression {
  constructor (arg) {
    this.arg = arg;
  }

  eval () {
    throw Error("Must implement an eval() method");
  }
}

class Negative extends UnaryExpression {
  eval () {
    return -this.arg.eval();
  }
}

export { Negative };
