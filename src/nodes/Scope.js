class Scope {
  constructor (parent = null) {
    this.parent = parent;
    this.variables = {};
  }

  set (name, value) {
    this.variables[name] = value;
  }

  get (name) {
    if (this.variables[name]) return this.variables[name];

    if (this.parent?.get(name)) return this.parent.get(name);

    throw SyntaxError(`Invalid identifier '${name}'`);
  }
}

module.exports = { Scope };
