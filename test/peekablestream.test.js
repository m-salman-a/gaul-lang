import PeekableStream from "../src/peekablestream";

test("WHEN next() is called THEN result should be first member & peek should be second member from the iterable.", () => {
	// Arrange
	const sut = new PeekableStream("Hello, world!");

	// Act
	const result = sut.next();

	// Assert
	expect(result).toStrictEqual({ value: "H", done: false });
	expect(sut.peek).toStrictEqual({ value: "e", done: false });
});

test("WHEN next() is called with empty string THEN result & peek should be undefined and done.", () => {
	// Arrange
	const sut = new PeekableStream("");

	// Act
	const result = sut.next();

	// Assert
	expect(sut.next()).toStrictEqual({ value: undefined, done: true });
	expect(sut.peek).toStrictEqual({ value: undefined, done: true });
});

test("WHEN next() is called in a loop looped THEN should output the whole string as long as result isn't done.", () => {
	const sut = new PeekableStream("Hello, World");
	let str = "";

	while (true) {
		let result = sut.next();

		if (result.done) break;

		str += result.value;
	}

	expect(str).toBe("Hello, World");
});
