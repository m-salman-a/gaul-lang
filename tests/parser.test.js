import * as BinaryExpression from "../src/nodes/binary-expression";
import * as Literal from "../src/nodes/literal";
import * as Statement from "../src/nodes/statement";
import * as UnaryExpression from "../src/nodes/unary-expression";
import { Variable } from "../src/nodes/variable";
import { Program } from "../src/nodes/program";
import Lexer from "../src/lexer";
import Parser from "../src/parser";

test("WHEN given number token SHOULD return a Number Literal", () => {
	const program = _setupParser("10");

	const ast = program.parse();

	expect(ast).toStrictEqual(new Program([new Literal.Number(10)]));
});

test("WHEN given string token SHOULD return a String Literal", () => {
	const program = _setupParser(`"10"`);

	const ast = program.parse();

	expect(ast).toStrictEqual(new Program([new Literal.String("10")]));
});

test("WHEN negative number token SHOULD return a Unary Expression and Number Literal", () => {
	const program = _setupParser("-10");

	const ast = program.parse();

	expect(ast).toStrictEqual(
		new Program([new UnaryExpression.Negative(new Literal.Number(10))])
	);
});

test("WHEN multiplying or dividing numbers SHOULD build tree going left to right", () => {
	const program = _setupParser("10 * 5 / 8");

	const ast = program.parse();

	expect(ast).toStrictEqual(
		new Program([
			new BinaryExpression.Divide(
				new BinaryExpression.Multiply(
					new Literal.Number(10),
					new Literal.Number(5)
				),
				new Literal.Number(8)
			),
		])
	);
});

test("WHEN adding or subtracting numbers SHOULD build tree going left to right", () => {
	const program = _setupParser("10 + 5 - 8");

	const ast = program.parse();

	expect(ast).toStrictEqual(
		new Program([
			new BinaryExpression.Subtract(
				new BinaryExpression.Add(new Literal.Number(10), new Literal.Number(5)),
				new Literal.Number(8)
			),
		])
	);
});

test("WHEN given a complex expression SHOULD build tree following follow PEMDAS", () => {
	const program = _setupParser("10 + 2 * (5 + 8) - 8");

	const ast = program.parse();

	expect(ast).toStrictEqual(
		new Program([
			new BinaryExpression.Subtract(
				new BinaryExpression.Add(
					new Literal.Number(10),
					new BinaryExpression.Multiply(
						new Literal.Number(2),
						new BinaryExpression.Add(
							new Literal.Number(5),
							new Literal.Number(8)
						)
					)
				),
				new Literal.Number(8)
			),
		])
	);
});

test("WHEN given comparison expression SHOULD work", () => {
	const program = _setupParser(
		`bukan ((2 > 3 atau 4 >= 3) == (2 < 3 dan 4 <= 3))`
	);

	const ast = program.parse();

	expect(ast).toStrictEqual(
		new Program([
			new UnaryExpression.Not(
				new BinaryExpression.Equal(
					new BinaryExpression.Or(
						new BinaryExpression.GT(
							new Literal.Number(2),
							new Literal.Number(3)
						),
						new BinaryExpression.GTE(
							new Literal.Number(4),
							new Literal.Number(3)
						)
					),
					new BinaryExpression.And(
						new BinaryExpression.LT(
							new Literal.Number(2),
							new Literal.Number(3)
						),
						new BinaryExpression.LTE(
							new Literal.Number(4),
							new Literal.Number(3)
						)
					)
				)
			),
		])
	);
});

test("WHEN given an assignment statement SHOULD return an Assignment Statement", () => {
	const program = _setupParser("foo itu 10");

	const ast = program.parse();

	expect(ast).toStrictEqual(
		new Program([
			new Statement.Assignment(new Variable("foo"), new Literal.Number(10)),
		])
	);
});

test("WHEN given an assignment statement with string SHOULD set variable in global scope", () => {
	const program = _setupParser(`foo itu "10"`);

	const ast = program.parse();

	expect(ast).toStrictEqual(
		new Program([
			new Statement.Assignment(new Variable("foo"), new Literal.String("10")),
		])
	);
});

test("WHEN given a Boolean value SHOULD return Boolean", () => {
	const program = _setupParser("foo itu benar");

	const ast = program.parse();

	expect(ast).toStrictEqual(
		new Program([
			new Statement.Assignment(new Variable("foo"), new Literal.Boolean(true)),
		])
	);
});

test("WHEN given an if block SHOULD return correct If type", () => {
	const program = _setupParser(`
kalo benar
	foo itu 10
	foo itu foo + 5
yaudah
`);

	const ast = program.parse();

	expect(ast).toStrictEqual(
		new Program([
			new Statement.If(
				new Literal.Boolean(true),
				new Statement.Multiple([
					new Statement.Assignment(new Variable("foo"), new Literal.Number(10)),
					new Statement.Assignment(
						new Variable("foo"),
						new BinaryExpression.Add(new Variable("foo"), new Literal.Number(5))
					),
				]),
				new Statement.Empty()
			),
		])
	);
});

test("WHEN given multiple expressions SHOULD return a Block statement", () => {
	const program = _setupParser(`
foo itu 5
foo itu 10 + 5
`);

	const ast = program.parse();

	expect(ast).toStrictEqual(
		new Program([
			new Statement.Assignment(new Variable("foo"), new Literal.Number(5)),
			new Statement.Assignment(
				new Variable("foo"),
				new BinaryExpression.Add(new Literal.Number(10), new Literal.Number(5))
			),
		])
	);
});

test("WHEN given nested if SHOULD return Nested If Statement", () => {
	const program = _setupParser(`
kalo benar
	kalo salah
	yaudah
yaudah
`);

	const ast = program.parse();

	expect(ast).toStrictEqual(
		new Program([
			new Statement.If(
				new Literal.Boolean(true),
				new Statement.Multiple([
					new Statement.If(
						new Literal.Boolean(false),
						new Statement.Multiple([]),
						new Statement.Empty()
					),
				]),
				new Statement.Empty()
			),
		])
	);
});

test("WHEN given if-else statement SHOULD return correct true and false Statement", () => {
	const program = _setupParser(`
kalo benar
	2
lainnya
	5
yaudah
`);

	const ast = program.parse();

	expect(ast).toStrictEqual(
		new Program([
			new Statement.If(
				new Literal.Boolean(true),
				new Statement.Multiple([new Literal.Number(2)]),
				new Statement.Multiple([new Literal.Number(5)])
			),
		])
	);
});

test("WHEN given if-else-if-else statement SHOULD return cascading If", () => {
	const program = _setupParser(`
kalo salah
	2
kalogak benar
	3
lainnya
	5
yaudah
`);

	const ast = program.parse();

	expect(ast).toStrictEqual(
		new Program([
			new Statement.If(
				new Literal.Boolean(false),
				new Statement.Multiple([new Literal.Number(2)]),
				new Statement.If(
					new Literal.Boolean(true),
					new Statement.Multiple([new Literal.Number(3)]),
					new Statement.Multiple([new Literal.Number(5)])
				)
			),
		])
	);
});

test("WHEN given For statement SHOULD run code multiple times", () => {
	const program = _setupParser(`
sum itu 0
ulangin i dari 1 sampe 10
	sum itu sum + i
yaudah
`);

	const ast = program.parse();

	expect(ast).toStrictEqual(
		new Program([
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
		])
	);
});

test("WHEN given baca & tulis SHOULD return Input & Print node", () => {
	const program = _setupParser(`
baca foo
tulis 10
`);

	const ast = program.parse();

	expect(ast).toStrictEqual(
		new Program([
			new Statement.Input(new Variable("foo")),
			new Statement.Print(new Literal.Number(10)),
		])
	);
});

test("WHEN given while statement SHOULD return multiple statements and condition", () => {
	const program = _setupParser(`
i itu 0
selama i < 10
	i itu i + 1
	tulis i
yaudah
`);

	const ast = program.parse();

	expect(ast).toStrictEqual(
		new Program([
			new Statement.Assignment(new Variable("i"), new Literal.Number(0)),
			new Statement.While(
				new BinaryExpression.LT(new Variable("i"), new Literal.Number(10)),
				new Statement.Multiple([
					new Statement.Assignment(
						new Variable("i"),
						new BinaryExpression.Add(new Variable("i"), new Literal.Number(1))
					),
					new Statement.Print(new Variable("i")),
				])
			),
		])
	);
});

function _setupParser(program) {
	return new Parser(new Lexer(program));
}
