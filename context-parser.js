"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextParser = exports.BaseContext = void 0;
var wasm_structure_1 = require("./wasm-structure");
exports.BaseContext = {
    "export": { inputTypes: undefined, outputTypes: undefined, opCodes: undefined },
    "fn": { inputTypes: undefined, outputTypes: undefined, opCodes: undefined, newContext: true },
    "var": { inputTypes: undefined, outputTypes: undefined, opCodes: undefined, newContext: true },
    ";": { inputTypes: undefined, outputTypes: undefined, opCodes: [wasm_structure_1.Opcodes.end], popContext: true },
    '+': { inputTypes: ['int', 'int'], outputTypes: ['int'], opCodes: [wasm_structure_1.Opcodes.i32Add] },
    '*': { inputTypes: ['int', 'int'], outputTypes: ['int'], opCodes: [wasm_structure_1.Opcodes.i32Mul] },
    '-': { inputTypes: ['int', 'int'], outputTypes: ['int'], opCodes: [wasm_structure_1.Opcodes.i32Sub] },
    '<': { inputTypes: ['int', 'int'], outputTypes: ['int'], opCodes: [wasm_structure_1.Opcodes.i32LessThanSigned] },
    '==': { inputTypes: ['int', 'int'], outputTypes: ['bool'], opCodes: [wasm_structure_1.Opcodes.i32Equals] },
    '==0': { inputTypes: ['int'], outputTypes: ['bool'], opCodes: [wasm_structure_1.Opcodes.i32EqualsZero] },
    '&&': { inputTypes: ['int', 'int'], outputTypes: ['bool'], opCodes: [wasm_structure_1.Opcodes.i32And] },
};
var ContextParser = /** @class */ (function () {
    function ContextParser() {
    }
    ContextParser.prototype.parse = function (context, words) {
        if (words.length == 0)
            return null;
        var nextWord = words[0];
        if (nextWord.startsWith("'")) {
            console.log(nextWord);
        }
        else if (nextWord.startsWith("\"")) {
            console.log(nextWord);
        }
        else {
            // Lookup through context
            if (context[nextWord]) {
                console.log(nextWord);
                console.log(context[nextWord]);
            }
            else {
                // number? 
                console.log(nextWord);
            }
        }
        return this.parse(context, words.slice(1));
    };
    return ContextParser;
}());
exports.ContextParser = ContextParser;
