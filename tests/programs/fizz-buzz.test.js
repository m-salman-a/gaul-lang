import Lexer from "../../src/lexer";
import Parser from "../../src/parser";

test("FizzBuzz Program", () => {
	const program = `
baca n
ulangin i dari 1 sampe n
	kalo i % 3 == 0 dan i % 5 == 0
		tulis "FizzBuzz"
	kalogak i % 3 == 0
		tulis "Fizz"
	kalogak i % 5 == 0
		tulis "Buzz"
	lainnya
		tulis i
	yaudah
yaudah
`;

	const tokens = new Lexer(program);
	const parser = new Parser(tokens);
	const ast = parser.parse();

	ast.eval([15]);

	expect(ast.env.outputStream).toStrictEqual([
		"1",
		"2",
		"Fizz",
		"4",
		"Buzz",
		"Fizz",
		"7",
		"8",
		"Fizz",
		"Buzz",
		"11",
		"Fizz",
		"13",
		"14",
		"FizzBuzz",
	]);
});
