class Variable {
  constructor (name, scope) {
    this.name = name;
    this.scope = scope;
  }

  eval () {
    return this.scope.get(this.name);
  }
}

export { Variable };
