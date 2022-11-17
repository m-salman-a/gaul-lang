import Lexer from "./lexer.js";
import Parser from "./parser.js";
import { parentPort, workerData } from "worker_threads";

const { program, input } = workerData;

const tokens = new Lexer(program);
const parser = new Parser(tokens);

const ast = parser.parse();

await ast.eval(input);

// sending message back to main thread
parentPort.postMessage({ done: true, output: ast.env.outputStream });
