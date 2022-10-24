import * as BinaryExpression from "../src/nodes/binary-expression";
import * as Literal from "../src/nodes/literal";
import * as Statement from "../src/nodes/statement";
import * as UnaryExpression from "../src/nodes/unary-expression";
import { Variable } from "../src/nodes/variable";
import { Scope } from "../src/nodes/scope";

test("WHEN given NumberLiteral SHOULD eval to number", () => {
	const sut = new Literal.Number(10);

	expect(sut.eval(10));
});

test("WHEN give StringLiteral SHOULD eval to a string", () => {
	const sut = new Literal.String(`"10"`);

	expect(sut.eval("10"));
});

test("WHEN given a Negative UnaryExpression SHOULD eval to a negative number", () => {
	const sut = new UnaryExpression.Negative(new Literal.Number(10));

	expect(sut.eval()).toBe(-10);
});

test("WHEN multiplying or dividing three numbers SHOULD go from left to right", () => {
	const sut = new BinaryExpression.Divide(
		new BinaryExpression.Multiply(
			new Literal.Number("10"),
			new Literal.Number("5")
		),
		new Literal.Number("8")
	);

	expect(sut.eval()).toBe(6.25);
});

test("WHEN adding or subtracting three numbers SHOULD go from left to right", () => {
	const sut = new BinaryExpression.Subtract(
		new BinaryExpression.Add(new Literal.Number("10"), new Literal.Number("5")),
		new Literal.Number("8")
	);

	expect(sut.eval()).toBe(7);
});

test("WHEN given a tree with a complex expression SHOULD follow PEMDAS", () => {
	const sut = new BinaryExpression.Subtract(
		new BinaryExpression.Add(
			new Literal.Number("10"),
			new BinaryExpression.Multiply(
				new Literal.Number("2"),
				new BinaryExpression.Add(
					new Literal.Number("5"),
					new Literal.Number("8")
				)
			)
		),
		new Literal.Number("8")
	);

	expect(sut.eval()).toBe(28);
});

test("WHEN given an assignment SHOULD set variable on scope", () => {
	const variable = new Variable("foo");
	const scope = new Scope();
	const sut = new Statement.Assignment(variable, new Literal.Number("10"));

	sut.eval(scope);

	expect(scope.get("foo")).toBe(10);
	expect(variable.eval(scope)).toBe(10);
});

test("WHEN given an if with true condition SHOULD run code in if block", () => {
	const variable = new Variable("foo");
	const scope = new Scope();
	const sut = new Statement.If(
		new Literal.Boolean(true),
		new Statement.Assignment(variable, new Literal.Number("1")),
		new Statement.Assignment(variable, new Literal.Number("2"))
	);

	sut.eval(scope);

	expect(scope.get("foo")).toBe(1);
	expect(variable.eval(scope)).toBe(1);
});

test("WHEN given an if with false condition SHOULD run code in else block", () => {
	const variable = new Variable("foo");
	const scope = new Scope();
	const sut = new Statement.If(
		new Literal.Boolean(false),
		new Statement.Assignment(variable, new Literal.Number("1")),
		new Statement.Assignment(variable, new Literal.Number("2"))
	);

	sut.eval(scope);

	expect(scope.get("foo")).toBe(2);
	expect(variable.eval(scope)).toBe(2);
});

test("WHEN given an if-(else if)-else condition SHOULD run code with true condition", () => {
	const variable = new Variable("foo");
	const scope = new Scope();
	const sut = new Statement.If(
		new Literal.Boolean(false),
		new Statement.Assignment(variable, new Literal.Number("1")),
		new Statement.If(
			new Literal.Boolean(true),
			new Statement.Assignment(variable, new Literal.Number("2")),
			new Statement.Assignment(variable, new Literal.Number("3"))
		)
	);

	sut.eval(scope);

	expect(scope.get("foo")).toBe(2);
	expect(variable.eval(scope)).toBe(2);
});
