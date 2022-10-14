import PeekableIterator from "../src/peekableIterator";
import Lexer from "../src/lexer";

test("WHEN next() with 1 number is called SHOULD consume a number", () => {
	const sut = _setupSUT("1");

	let token = sut.next();

	expect(token).toStrictEqual({ type: "num", value: 1 });
});

test("WHEN next() is called with numbers and decimal point SHOULD consume all adjacent numbers and decimal points", () => {
	const sut = _setupSUT("123.456");

	let token = sut.next();

	expect(token).toStrictEqual({ type: "num", value: 123.456 });
});

test("WHEN next() is called with a string SHOULD consume the string without quotes", () => {
	const sut = _setupSUT(`"123. 456"`);

	let token = sut.next();

	expect(token).toStrictEqual({ type: "str", value: "123. 456" });
});

test("WHEN next() is called with an identifier SHOULD consume the identifier", () => {
	const sut = _setupSUT(" foo_js123 ");

	let token = sut.next();

	expect(token).toStrictEqual({ type: "id", value: "foo_js123" });
});

test("WHEN next() is called with a tab SHOULD return tab type", () => {
	const sut = _setupSUT(`	`);

	let token = sut.next();

	expect(token).toStrictEqual({ type: "tab" });
});

test("WHEN next() is called with ( SHOULD return lparen type", () => {
	const sut = _setupSUT("(");

	let token = sut.next();

	expect(token).toStrictEqual({ type: "lparen" });
});

test("WHEN next() is called with ) SHOULD return rparen type", () => {
	const sut = _setupSUT(")");

	let token = sut.next();

	expect(token).toStrictEqual({ type: "rparen" });
});

test("WHEN next() is called whitespace (space, newline) SHOULD skip", () => {
	const str = `


    
`;
	const sut = _setupSUT(str);

	let token = sut.next();

	expect(token).toStrictEqual({ type: "eof" });
});

test("WHEN next() is called with operator should return the operator as type", () => {
	const sut = _setupSUT("*");

	let token = sut.next();

	expect(token).toStrictEqual({ type: "*" });
});

test("WHEN next() is called with comparison should return the comparison as type", () => {
	const sut = _setupSUT(">");

	let token = sut.next();

	expect(token).toStrictEqual({ type: ">" });
});

test("WHEN next() is called with comparison should return the comparison as type", () => {
	const sut = _setupSUT("<=");

	let token = sut.next();

	expect(token).toStrictEqual({ type: "<=" });
});

function _setupSUT(string) {
	return new Lexer(new PeekableIterator(string));
}
