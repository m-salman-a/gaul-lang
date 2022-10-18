// Statement
// S ::= F itu E
//
// Expression
// E ::= T + E | T - E | T
//
// Term
// T ::= F * T | F / T | F
//
// Factor
// F ::= ID | Int | ( E ) | -F

/**
// BI -> BI-lang
// Bela-lang
// Selang

// 1. Source code
// 2. Tokenizer/Lexer
// 3. Parser
// 4. Interpreter

// Compiler -> translate C -> Assembly -> Binary
// Transpiler -> translate TypeScript -> JS, Babel

// Lexer
// 10 + 5
// SyntaxError: Missing token

const token = [
	{
		NUMBER: 10,
	},
	{
		OPERATOR: "+",
	},
	{
		NUMBER: 5,
	},
];

// Parser
// (10 + 5) * 2

// a = 10
// SyntaxError

const tree = {
	type: "AddExpression",
	left: {
		type: "NumericLiteral",
		value: 10,
	},
	right: {
		type: "MultiplicationExpression",
		left: {
			type: "NumericLiteral",
			value: 5,
		},
		right: {
			type: "NumericLiteral",
			value: 2,
		},
	},
};

// Interpreter

// 10 + 5
// Left: 10
// Right: 5

// (10 + 5) * 2
// Left: (10 + 5)
// Right: 2

function eval(params) {
	if (tree.type == "MultiplicationExpression") {
		const result = eval(tree.left) * eval(tree.right);
	}
}
*/
