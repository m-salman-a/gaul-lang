class Statement {
  eval () {
    throw Error("Must implement an eval() method");
  }
}

class Multiple extends Statement {
  constructor (statements) {
    super();
    this.statements = statements;
  }

  eval () {
    this.statements.forEach((statement) => statement.eval());
  }
}

class Assignment extends Statement {
  constructor (left, right, scope) {
    super();
    this.left = left;
    this.right = right;
    this.scope = scope;
  }

  eval () {
    this.scope.set(this.left.name, this.right.eval());
  }
}

class If extends Statement {
  constructor (condition, doTrue, doFalse) {
    super();
    this.condition = condition;
    this.doTrue = doTrue;
    this.doFalse = doFalse;

    this.scope = {};
  }

  eval () {
    if (this.condition.eval()) {
      this.doFalse.eval();
    } else {
      this.doTrue.eval();
    }
  }
}

export { Assignment, If, Multiple };
