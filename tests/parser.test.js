import * as BinaryExpression from "../src/nodes/binary-expression";
import * as Literal from "../src/nodes/literal";
import * as Statement from "../src/nodes/statement";
import * as UnaryExpression from "../src/nodes/unary-expression";
import { Variable } from "../src/nodes/variable";
import { Program } from "../src/nodes/program";
import Lexer from "../src/lexer";
import Parser from "../src/parser";
import { Scope } from "../src/nodes/scope";

test("WHEN given number token SHOULD return a Number Literal", () => {
	const sut = _setupSUT("10");

	const ast = sut.parse();

	expect(ast).toStrictEqual(new Program(new Literal.Number("10")));
	expect(ast.eval()).toBe(10);
});

test("WHEN given string token SHOULD return a String Literal", () => {
	const sut = _setupSUT(`"10"`);

	const ast = sut.parse();

	expect(ast).toStrictEqual(new Program(new Literal.String("10")));
	expect(ast.eval()).toBe("10");
});

test("WHEN negative number token SHOULD return a Unary Expression and Number Literal", () => {
	const sut = _setupSUT("-10");

	const ast = sut.parse();

	expect(ast).toStrictEqual(
		new Program(new UnaryExpression.Negative(new Literal.Number("10")))
	);
	expect(ast.eval()).toBe(-10);
});

test("WHEN multiplying three numbers SHOULD return nested Multiply Expression", () => {
	const sut = _setupSUT("10 * 5 / 8");

	const ast = sut.parse();

	expect(ast).toStrictEqual(
		new Program(
			new BinaryExpression.Divide(
				new BinaryExpression.Multiply(
					new Literal.Number("10"),
					new Literal.Number("5")
				),
				new Literal.Number("8")
			)
		)
	);
	expect(ast.eval()).toBe(6.25);
});

test("WHEN adding three numbers SHOULD return nested Add Expression", () => {
	const sut = _setupSUT("10 + 5 - 8");

	const ast = sut.parse();

	expect(ast).toStrictEqual(
		new Program(
			new BinaryExpression.Subtract(
				new BinaryExpression.Add(
					new Literal.Number("10"),
					new Literal.Number("5")
				),
				new Literal.Number("8")
			)
		)
	);
	expect(ast.eval()).toBe(7);
});

test("WHEN given a complex expression SHOULD follow PEMDAS", () => {
	const sut = _setupSUT("10 + 2 * (5 + 8) - 8");

	const ast = sut.parse();

	expect(ast).toStrictEqual(
		new Program(
			new BinaryExpression.Subtract(
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
			)
		)
	);
	expect(ast.eval()).toBe(28);
});

test("WHEN given an assignment statement SHOULD set variable in global scope", () => {
	const sut = _setupSUT("foo itu 10");

	const ast = sut.parse();
	const foo = new Variable("foo", ast.globalScope);

	expect(ast).toStrictEqual(
		new Program(
			new Statement.Assignment(foo, new Literal.Number("10"), ast.globalScope)
		)
	);

	ast.eval();

	expect(ast.globalScope.get("foo")).toBe(10);
	expect(foo.eval()).toBe(10);
});

test("WHEN given an assignment statement with string SHOULD set variable in global scope", () => {
	const sut = _setupSUT(`foo itu "10"`);

	const ast = sut.parse();
	const foo = new Variable("foo", ast.globalScope);

	expect(ast).toStrictEqual(
		new Program(
			new Statement.Assignment(foo, new Literal.String("10"), ast.globalScope)
		)
	);

	ast.eval();

	expect(ast.globalScope.get("foo")).toBe("10");
	expect(foo.eval()).toBe("10");
});

test("WHEN given a Boolean value SHOULD return Boolean", () => {
	const sut = _setupSUT("foo itu benar");

	const ast = sut.parse();
	const foo = new Variable("foo", ast.globalScope);

	expect(ast).toStrictEqual(
		new Program(
			new Statement.Assignment(foo, new Literal.Boolean(true), ast.globalScope)
		)
	);

	ast.eval();

	expect(ast.globalScope.get("foo")).toBe(true);
	expect(foo.eval()).toBe(true);
});

test("WHEN given an if block SHOULD return correct If type", () => {
	const sut = _setupSUT(`
kalo benar
	foo itu 5
	foo itu foo + 5
yaudah
`);

	const ast = sut.parse();
	const foo = new Variable("foo");

	expect(ast).toStrictEqual(
		new Statement.If(
			new Literal.Boolean(true),
			new Statement.Multiple([
				new Statement.Assignment(foo, new Literal.Number("5"), sut.globalScope),
				new Statement.Assignment(
					foo,
					new BinaryExpression.Add(foo, new Literal.Number("5")),
					sut.globalScope
				),
			]),
			new Statement.Multiple([])
		)
	);
});

function _setupSUT(program) {
	return new Parser(new Lexer(program));
}
