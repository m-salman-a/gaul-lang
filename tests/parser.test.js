import * as BinaryExpression from "../src/nodes/binary-expression";
import * as Literal from "../src/nodes/literal";
import * as Statement from "../src/nodes/statement";
import * as UnaryExpression from "../src/nodes/unary-expression";
import { Variable } from "../src/nodes/variable";
import { Program } from "../src/nodes/program";
import Lexer from "../src/lexer";
import Parser from "../src/parser";

test("WHEN given number token SHOULD return a Number Literal", () => {
	const sut = _setupSUT("10");

	const ast = sut.parse();

	expect(ast).toStrictEqual(new Program([new Literal.Number("10")]));
});

test("WHEN given string token SHOULD return a String Literal", () => {
	const sut = _setupSUT(`"10"`);

	const ast = sut.parse();

	expect(ast).toStrictEqual(new Program([new Literal.String("10")]));
});

test("WHEN negative number token SHOULD return a Unary Expression and Number Literal", () => {
	const sut = _setupSUT("-10");

	const ast = sut.parse();

	expect(ast).toStrictEqual(
		new Program([new UnaryExpression.Negative(new Literal.Number("10"))])
	);
});

test("WHEN multiplying or dividing numbers SHOULD build tree going left to right", () => {
	const sut = _setupSUT("10 * 5 / 8");

	const ast = sut.parse();

	expect(ast).toStrictEqual(
		new Program([
			new BinaryExpression.Divide(
				new BinaryExpression.Multiply(
					new Literal.Number("10"),
					new Literal.Number("5")
				),
				new Literal.Number("8")
			),
		])
	);
});

test("WHEN adding or subtracting numbers SHOULD build tree going left to right", () => {
	const sut = _setupSUT("10 + 5 - 8");

	const ast = sut.parse();

	expect(ast).toStrictEqual(
		new Program([
			new BinaryExpression.Subtract(
				new BinaryExpression.Add(
					new Literal.Number("10"),
					new Literal.Number("5")
				),
				new Literal.Number("8")
			),
		])
	);
});

test("WHEN given a complex expression SHOULD build tree following follow PEMDAS", () => {
	const sut = _setupSUT("10 + 2 * (5 + 8) - 8");

	const ast = sut.parse();

	expect(ast).toStrictEqual(
		new Program([
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
			),
		])
	);
});

test("WHEN given an assignment statement SHOULD return an Assignment Statement", () => {
	const sut = _setupSUT("foo itu 10");

	const ast = sut.parse();

	expect(ast).toStrictEqual(
		new Program([
			new Statement.Assignment(new Variable("foo"), new Literal.Number("10")),
		])
	);
});

test("WHEN given an assignment statement with string SHOULD set variable in global scope", () => {
	const sut = _setupSUT(`foo itu "10"`);

	const ast = sut.parse();

	expect(ast).toStrictEqual(
		new Program([
			new Statement.Assignment(new Variable("foo"), new Literal.String("10")),
		])
	);
});

test("WHEN given a Boolean value SHOULD return Boolean", () => {
	const sut = _setupSUT("foo itu benar");

	const ast = sut.parse();

	expect(ast).toStrictEqual(
		new Program([
			new Statement.Assignment(new Variable("foo"), new Literal.Boolean(true)),
		])
	);
});

test("WHEN given an if block SHOULD return correct If type", () => {
	const sut = _setupSUT(`
kalo benar
	foo itu 10
	foo itu foo + 5
yaudah
`);

	const ast = sut.parse();

	expect(ast).toStrictEqual(
		new Program([
			new Statement.If(
				new Literal.Boolean(true),
				new Statement.Multiple([
					new Statement.Assignment(
						new Variable("foo"),
						new Literal.Number("10")
					),
					new Statement.Assignment(
						new Variable("foo"),
						new BinaryExpression.Add(
							new Variable("foo"),
							new Literal.Number("5")
						)
					),
				]),
				new Statement.Multiple([])
			),
		])
	);
});

test("WHEN given multiple expressions SHOULD return a Block statement", () => {
	const sut = _setupSUT(`
foo itu 5
foo itu 10 + 5
`);

	const ast = sut.parse();

	expect(ast).toStrictEqual(
		new Program([
			new Statement.Assignment(new Variable("foo"), new Literal.Number("5")),
			new Statement.Assignment(
				new Variable("foo"),
				new BinaryExpression.Add(
					new Literal.Number("10"),
					new Literal.Number("5")
				)
			),
		])
	);
});

test("WHEN given nested if SHOULD return Nested If Statement", () => {
	const sut = _setupSUT(`
kalo benar
	kalo salah
	yaudah
yaudah
`);

	const ast = sut.parse();

	expect(ast).toStrictEqual(
		new Program([
			new Statement.If(
				new Literal.Boolean(true),
				new Statement.Multiple([
					new Statement.If(
						new Literal.Boolean(false),
						new Statement.Multiple([]),
						new Statement.Multiple([])
					),
				]),
				new Statement.Multiple([])
			),
		])
	);
});

function _setupSUT(program) {
	return new Parser(new Lexer(program));
}
