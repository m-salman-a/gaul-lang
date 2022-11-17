import * as BinaryExpression from "../src/nodes/binary-expression";
import * as Literal from "../src/nodes/literal";
import * as Statement from "../src/nodes/statement";
import * as UnaryExpression from "../src/nodes/unary-expression";
import { Program } from "../src/nodes/program";
import { Variable } from "../src/nodes/variable";
import { Environment } from "../src/nodes/environment";

test("WHEN given NumberLiteral SHOULD eval to number", () => {
	const ast = new Literal.Number(10);

	expect(ast.eval(10));
});

test("WHEN give StringLiteral SHOULD eval to a string", () => {
	const ast = new Literal.String(`"10"`);

	expect(ast.eval("10"));
});

test("WHEN given a Negative UnaryExpression SHOULD eval to a negative number", () => {
	const ast = new UnaryExpression.Negative(new Literal.Number(10));

	expect(ast.eval()).toBe(-10);
});

test("WHEN multiplying or dividing three numbers SHOULD go from left to right", () => {
	const ast = new BinaryExpression.Divide(
		new BinaryExpression.Multiply(
			new Literal.Number(10),
			new Literal.Number(5)
		),
		new Literal.Number(8)
	);
});

test("WHEN given modulo SHOULD return modulo of two numbers", () => {
	const ast = new BinaryExpression.Modulo(
		new Literal.Number(100),
		new Literal.Number(8)
	);

	expect(ast.eval()).toBe(4);
});

test("WHEN adding or subtracting three numbers SHOULD go from left to right", () => {
	const ast = new BinaryExpression.Subtract(
		new BinaryExpression.Add(new Literal.Number(10), new Literal.Number(5)),
		new Literal.Number(8)
	);

	expect(ast.eval()).toBe(7);
});

test("WHEN given a tree with a complex expression SHOULD follow PEMDAS", () => {
	const ast = new BinaryExpression.Subtract(
		new BinaryExpression.Add(
			new Literal.Number(10),
			new BinaryExpression.Multiply(
				new Literal.Number(2),
				new BinaryExpression.Add(new Literal.Number(5), new Literal.Number(8))
			)
		),
		new Literal.Number("8")
	);

	expect(ast.eval()).toBe(28);
});

test("WHEN given comparison SHOULD return correct boolean value", () => {
	const ast = new UnaryExpression.Not(
		new BinaryExpression.Equal(
			new BinaryExpression.Or(
				new BinaryExpression.GT(new Literal.Number(2), new Literal.Number(3)),
				new BinaryExpression.GTE(new Literal.Number(4), new Literal.Number(3))
			),
			new BinaryExpression.And(
				new BinaryExpression.LT(new Literal.Number(2), new Literal.Number(3)),
				new BinaryExpression.LTE(new Literal.Number(4), new Literal.Number(3))
			)
		)
	);

	expect(ast.eval()).toBe(true);
});

test("WHEN given an assignment SHOULD set variable on scope", () => {
	const variable = new Variable("foo");
	const scope = new Environment();
	const ast = new Statement.Assignment(variable, new Literal.Number(10));

	ast.eval(scope);

	expect(scope.get("foo")).toBe(10);
	expect(variable.eval(scope)).toBe(10);
});

test("WHEN given an if with true condition SHOULD run code in if block", () => {
	const variable = new Variable("foo");
	const scope = new Environment();
	const ast = new Statement.If(
		new Literal.Boolean(true),
		new Statement.Assignment(variable, new Literal.Number(1)),
		new Statement.Assignment(variable, new Literal.Number(2))
	);

	ast.eval(scope);

	expect(scope.get("foo")).toBe(1);
	expect(variable.eval(scope)).toBe(1);
});

test("WHEN given an if with false condition SHOULD run code in else block", () => {
	const variable = new Variable("foo");
	const scope = new Environment();
	const ast = new Statement.If(
		new Literal.Boolean(false),
		new Statement.Assignment(variable, new Literal.Number(1)),
		new Statement.Assignment(variable, new Literal.Number(2))
	);

	ast.eval(scope);

	expect(scope.get("foo")).toBe(2);
	expect(variable.eval(scope)).toBe(2);
});

test("WHEN given an if-(else if)-else condition SHOULD run code with true condition", () => {
	const variable = new Variable("foo");
	const scope = new Environment();
	const ast = new Statement.If(
		new Literal.Boolean(false),
		new Statement.Assignment(variable, new Literal.Number(1)),
		new Statement.If(
			new Literal.Boolean(true),
			new Statement.Assignment(variable, new Literal.Number(2)),
			new Statement.Assignment(variable, new Literal.Number(3))
		)
	);

	ast.eval(scope);

	expect(scope.get("foo")).toBe(2);
	expect(variable.eval(scope)).toBe(2);
});

test("WHEN given For statement SHOULD run code multiple times", () => {
	const ast = new Program([
		new Statement.Assignment(new Variable("sum"), new Literal.Number(0)),
		new Statement.For(
			new Variable("i"),
			new Literal.Number(1),
			new Literal.Number(10),
			new Statement.Multiple([
				new Statement.Assignment(
					new Variable("sum"),
					new BinaryExpression.Add(new Variable("sum"), new Variable("i"))
				),
			])
		),
	]);

	ast.eval();

	expect(ast.env.get("sum")).toBe(55);
});

test("WHEN given baca & tulis SHOULD set input & output stream", () => {
	const ast = new Program([
		new Statement.Input(new Variable("foo")),
		new Statement.Print(new Variable("foo")),
	]);

	ast.eval([10]);

	expect(ast.env.outputStream).toStrictEqual(["10"]);
});

test("WHEN given while expression SHOULD eval to correct value", () => {
	const ast = new Program([
		new Statement.Assignment(new Variable("i"), new Literal.Number(0)),
		new Statement.While(
			new BinaryExpression.LT(new Variable("i"), new Literal.Number(10)),
			new Statement.Multiple([
				new Statement.Assignment(
					new Variable("i"),
					new BinaryExpression.Add(new Variable("i"), new Literal.Number(1))
				),
			])
		),
		new Statement.Print(new Variable("i")),
	]);

	ast.eval();

	expect(ast.env.outputStream).toStrictEqual(["10"]);
});
