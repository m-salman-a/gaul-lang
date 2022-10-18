class Statement {
  eval () {
    throw Error("Must implement an eval() method");
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

module.exports = {
  Assignment,
};
