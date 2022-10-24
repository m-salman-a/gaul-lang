class Variable {
  constructor (name) {
    this.name = name;
  }

  eval (env) {
    const value = env.get(this.name);

    if (!value) {
      throw SyntaxError(`Invalid identifier '${name}'`);
    }

    return value;
  }
}

export { Variable };
