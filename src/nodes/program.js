import { Environment } from "./environment.js";

class Program {
  constructor (statements) {
    this.statements = statements;
    this.env = null;
  }

  async eval (inputs) {
    return new Promise((resolve) => {
      this.env = new Environment(null, {}, inputs);
      this.statements.forEach((statement) => statement.eval(this.env));
      resolve();
    });
  }
}

export { Program };
