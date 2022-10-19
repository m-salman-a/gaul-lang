import PeekableIterator from "../src/peekable-iterator";

test("WHEN next() is called THEN result should be first member & peek should be second member from the iterable.", () => {
	// Arrange
	const sut = new PeekableIterator("Hello, world!");

	// Act
	const result = sut.next();

	// Assert
	expect(result).toStrictEqual({
		value: { current: "H", next: "e" },
		done: false,
	});
});

test("WHEN next() is called with empty string THEN result & peek should be undefined and done.", () => {
	// Arrange
	const sut = new PeekableIterator("");

	// Act
	const result = sut.next();

	// Assert
	expect(result).toStrictEqual({
		value: { current: undefined, next: undefined },
		done: true,
	});
});

test("WHEN next() is called in a loop looped THEN should output the whole string as long as result isn't done.", () => {
	const sut = new PeekableIterator("Hello, World");
	let str = "";

	for (var result of sut) {
		str += result.current;
	}

	expect(str).toBe("Hello, World");
});
