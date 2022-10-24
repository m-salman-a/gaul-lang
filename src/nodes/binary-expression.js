class BinaryExpression {
  constructor (left, right) {
    this.left = left;
    this.right = right;
  }

  eval (env) {
    throw Error("Must implement an eval() method");
  }
}

class Add extends BinaryExpression {
  eval (env) {
    return this.left.eval(env) + this.right.eval(env);
  }
}

class Subtract extends BinaryExpression {
  eval (env) {
    return this.left.eval(env) - this.right.eval(env);
  }
}

class Multiply extends BinaryExpression {
  eval (env) {
    return this.left.eval(env) * this.right.eval(env);
  }
}

class Divide extends BinaryExpression {
  eval (env) {
    return this.left.eval(env) / this.right.eval(env);
  }
}

export { Add, Subtract, Multiply, Divide };
