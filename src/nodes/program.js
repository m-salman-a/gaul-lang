import { Scope } from "./scope";

class Program {
  constructor (program, scope = new Scope()) {
    this.program = program;
    this.globalScope = scope;
  }

  eval () {
    return this.program.eval();
  }
}

export { Program };
