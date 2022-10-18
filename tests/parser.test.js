import * as BinaryExpression from "../src/nodes/BinaryExpression";
import * as Literal from "../src/nodes/Literal";
import * as Statement from "../src/nodes/Statement";
import * as UnaryExpression from "../src/nodes/UnaryExpression";
import { Variable } from "../src/nodes/Variable";
import Parser from "../src/parser";

test("WHEN given number token SHOULD return a Number Literal", () => {
	const sut = _setupSUT([{ type: "num", value: "10" }]);

	const ast = sut.parse();

	expect(ast).toStrictEqual(new Literal.Number("10"));
	expect(ast.eval()).toBe(10);
});

test("WHEN negative number token SHOULD return a Unary Expression and Number Literal", () => {
	const sut = _setupSUT([
		{ type: "op", value: "-" },
		{ type: "num", value: "10" },
	]);

	const ast = sut.parse();

	expect(ast).toStrictEqual(
		new UnaryExpression.Negative(new Literal.Number("10"))
	);
	expect(ast.eval()).toBe(-10);
});

test("WHEN multiplying three numbers SHOULD return nested Multiply Expression", () => {
	const sut = _setupSUT([
		{ type: "num", value: "10" },
		{ type: "op", value: "*" },
		{ type: "num", value: "5" },
		{ type: "op", value: "*" },
		{ type: "num", value: "8" },
	]);

	const ast = sut.parse();

	expect(ast).toStrictEqual(
		new BinaryExpression.Multiply(
			new BinaryExpression.Multiply(
				new Literal.Number("10"),
				new Literal.Number("5")
			),
			new Literal.Number("8")
		)
	);
	expect(ast.eval()).toBe(400);
});

test("WHEN adding three numbers SHOULD return nested Add Expression", () => {
	const sut = _setupSUT([
		{ type: "num", value: "10" },
		{ type: "op", value: "+" },
		{ type: "num", value: "5" },
		{ type: "op", value: "+" },
		{ type: "num", value: "8" },
	]);

	const ast = sut.parse();

	expect(ast).toStrictEqual(
		new BinaryExpression.Add(
			new BinaryExpression.Add(
				new Literal.Number("10"),
				new Literal.Number("5")
			),
			new Literal.Number("8")
		)
	);
	expect(ast.eval()).toBe(23);
});

test("WHEN given a complex expression SHOULD follow PEMDAS", () => {
	const sut = _setupSUT([
		{ type: "num", value: "10" },
		{ type: "op", value: "+" },
		{ type: "num", value: "2" },
		{ type: "op", value: "*" },
		{ type: "sym", value: "(" },
		{ type: "num", value: "5" },
		{ type: "op", value: "+" },
		{ type: "num", value: "8" },
		{ type: "sym", value: ")" },
		{ type: "op", value: "-" },
		{ type: "num", value: "8" },
	]);

	const ast = sut.parse();

	expect(ast).toStrictEqual(
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
	);
	expect(ast.eval()).toBe(28);
});

test("WHEN given an assignment statement SHOULD set variable in global scope", () => {
	const sut = _setupSUT([
		{ type: "id", value: "foo" },
		{ type: "id", value: "itu" },
		{ type: "num", value: "10" },
	]);

	const ast = sut.parse();
	ast.eval();

	expect(ast).toStrictEqual(
		new Statement.Assignment(
			new Variable("foo", sut.globalScope),
			new Literal.Number("10"),
			sut.globalScope
		)
	);
	expect(new Variable("foo", sut.globalScope).eval()).toBe(10);
});

function _setupSUT(tokens) {
	return new Parser(tokens);
}
