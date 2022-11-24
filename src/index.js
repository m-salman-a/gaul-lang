import { Worker } from "worker_threads";

const program = `
baca x
baca y
baca z

tulis "x:" + x
tulis "y:" + y
tulis "z:" + z
`;

const worker = new Worker("./src/run.js", {
  workerData: { program, input: ["15", "xxx", "benar"] },
});

const timeout = setTimeout(() => {
  worker.terminate();
}, 5000);

worker.on("message", (msg) => {
  console.log(msg.output);
  clearTimeout(timeout);
});

/*
Program
<P>
	: <S> <EOF>
	| <S> <P>
	;

MultipleStatement
<MS>
	: <S> <MS>
	| <S>
	;

If
<If>
	: "kalo" <Condition> <> "yaudah"
	; kalo <Condition> <If-body>

<Indent>
	: "\t" <Statement>
	| <Indent>
	;

Assign
<Assign>
	: <ID> "itu" <Expr>
	| <ID> "itu" "[" <Expr> "]"
	;

Condition
<Condition>
	: <Bool>
	;

Expression
<Expr>
	: <Term> "+" <Expr>
	| <Term> "-" <Expr>
	| <Term>
	;

Term
<Term>
	: <Unary> "*" <Term>
	| <Unary> "/" <Term>
	| <Unary>
	;

Unary
<Unary>
	: "-" <Factor>
	| "(" <Expr> ")"
	; <Factor>

Factor
<Factor>
	: id
	| num
	;

Boolean
<Bool>
	: "benar"
	| "salah"
	;

Terminal = symbols (+, -, *, /)
Nonterminal = can be expanded (factor, identifier, statement, etc.)
Production = nonterminal + terminal
Start = entry to program (Program -> Start)
*/

/*
ParseToken {
	_it: Iterable
	_nextToken: Token
	_result: Node
	advance() -> Void {
		this._nextToken
	}
	match(matcher, matchHandler) -> this {
		if (!this.result) return this

		if (this.nextToken.type === matcher) {
			this._result = matchHandler()

			return this
		}

		return null
	}
	matchNegative() -> this {
		return match("-", new Negative(
			new ParseToken(it)
				.matchNumber()
				.result())
		) // Need node type here
	}
	matchNumber () -> this {
		return match("num", new NumberLiteral())
	}
	matchString () -> this {
		return match("str", new StringLiteral())
	}
	result () -> Node {
		return _result
	}
}

Obj.matchNumber().matchString() -> Obj.result = Literal
*/

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
