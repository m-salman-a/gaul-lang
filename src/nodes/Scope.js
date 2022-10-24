class Scope {
  constructor (parent = null, variables = {}) {
    this.parent = parent;
    this.variables = variables;
  }

  set (name, value) {
    this.variables[name] = value;
  }

  get (name) {
    if (this.variables[name]) return this.variables[name];

    if (this.parent) return this.parent.get(name);

    return null;
  }
}

export { Scope };
