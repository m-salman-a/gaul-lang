import { Scope } from "./scope";

class Program {
  constructor (statements) {
    this.statements = statements;
    this.globalScope = new Scope();
  }

  eval () {
    this.statements.forEach((statement) => statement.eval(this.globalScope));
  }
}

export { Program };
