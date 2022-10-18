class BinaryExpression {
  constructor (left, right) {
    this.left = left;
    this.right = right;
  }

  eval () {
    throw Error("Must implement an eval() method");
  }
}

class Add extends BinaryExpression {
  eval () {
    return this.left.eval() + this.right.eval();
  }
}

class Subtract extends BinaryExpression {
  eval () {
    return this.left.eval() - this.right.eval();
  }
}

class Multiply extends BinaryExpression {
  eval () {
    return this.left.eval() * this.right.eval();
  }
}

class Divide extends BinaryExpression {
  eval () {
    return this.left.eval() / this.right.eval();
  }
}

module.exports = {
  Add,
  Subtract,
  Multiply,
  Divide,
};
