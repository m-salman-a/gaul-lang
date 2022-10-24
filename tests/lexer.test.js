import { Keywords } from "../src/keywords";
import Lexer from "../src/lexer";
import * as Token from "../src/tokens/token";

test("WHEN next() with 1 number is called SHOULD consume a number", () => {
	const sut = _setupSUT("1");

	const { value, done } = sut.next();

	expect(value).toStrictEqual(new Token.Num("1"));
	expect(done).toBe(false);
});

test("WHEN next() is called with numbers and decimal point SHOULD consume all adjacent numbers and decimal points", () => {
	const sut = _setupSUT("123.456");

	const { value } = sut.next();

	expect(value).toStrictEqual(new Token.Num("123.456"));
});

test("WHEN next() is called with a string SHOULD consume the string without quotes", () => {
	const sut = _setupSUT(`"123. 456"`);

	const { value, done } = sut.next();

	expect(value).toStrictEqual(new Token.Str("123. 456"));
	expect(done).toBe(false);
});

test("WHEN next() is called with an identifier SHOULD consume the identifier", () => {
	const sut = _setupSUT(" foo_js123 ");

	const { value, done } = sut.next();

	expect(value).toStrictEqual(new Token.Id("foo_js123"));
	expect(done).toBe(false);
});

test("WHEN next() is called with a keyword SHOULD return keyword type", () => {
	const sut = _setupSUT(Keywords.IF);

	const { value, done } = sut.next();

	expect(value).toStrictEqual(new Token.Keyword(Keywords.IF));
	expect(done).toBe(false);
});

test("WHEN next() is called with a tab SHOULD skip", () => {
	const sut = _setupSUT(`	`);

	const { value, done } = sut.next();

	expect(value).toStrictEqual(new Token.EOF());
	expect(done).toBe(true);
});

test("WHEN next() is called with ( SHOULD return symbol type with value (", () => {
	const sut = _setupSUT("(");

	const { value, done } = sut.next();

	expect(value).toStrictEqual(new Token.Symbol("("));
	expect(done).toBe(false);
});

test("WHEN next() is called with ) SHOULD return symbol type with value )", () => {
	const sut = _setupSUT(")");

	const { value, done } = sut.next();

	expect(value).toStrictEqual(new Token.Symbol(")"));
	expect(done).toBe(false);
});

test("WHEN next() is called whitespace (space, newline) SHOULD skip", () => {
	const str = `


    
`;
	const sut = _setupSUT(str);

	const { value, done } = sut.next();

	expect(value).toStrictEqual(new Token.EOF());
	expect(done).toBe(true);
});

test("WHEN next() is called with operator should return the operator as type", () => {
	const sut = _setupSUT("*");

	const { value, done } = sut.next();

	expect(value).toStrictEqual(new Token.Symbol("*"));
	expect(done).toBe(false);
});

test("WHEN next() is called with comparison should return the comparison as type", () => {
	const sut = _setupSUT(">");

	const { value, done } = sut.next();

	expect(value).toStrictEqual(new Token.Symbol(">"));
	expect(done).toBe(false);
});

test("WHEN next() is called with comparison should return the comparison as type", () => {
	const sut = _setupSUT("<=");

	const { value, done } = sut.next();

	expect(value).toStrictEqual(new Token.Symbol("<="));
	expect(done).toBe(false);
});

function _setupSUT(string) {
	return new Lexer(string);
}
