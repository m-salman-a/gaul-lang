class Statement {
  eval (env) {
    throw Error("Must implement an eval() method");
  }
}

class Empty extends Statement {}

class Block extends Statement {
  constructor (statements) {
    super();
    this.statements = statements;
  }

  eval (env) {
    this.statements.forEach((statement) => statement.eval(env));
  }
}

class Assignment extends Statement {
  constructor (left, right) {
    super();
    this.left = left;
    this.right = right;
  }

  eval (env) {
    env.set(this.left.name, this.right.eval(env));
  }
}

class If extends Statement {
  constructor (condition, trueFunc, falseFunc) {
    super();
    this.condition = condition;
    this.trueFunc = trueFunc;
    this.falseFunc = falseFunc;
  }

  eval (env) {
    if (this.condition.eval(env)) {
      this.trueFunc.eval(env);
    } else {
      this.falseFunc.eval(env);
    }
  }
}

export { Assignment, If, Block as Multiple, Empty };
