class Scope {
  constructor (parent = null, variables = {}) {
    this.parent = parent;
    this.variables = variables;
  }

  set (name, value) {
    this.variables[name] = value;
  }

  get (name) {
    if (name in this.variables) return this.variables[name];

    if (this.parent) return this.parent.get(name);

    return null;
  }

  remove (name) {
    if (name in this.variables) delete this.variables[name];
  }
}

export { Scope };
