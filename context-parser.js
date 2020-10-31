"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextParser = exports.BaseContext = void 0;
var wasm_structure_1 = require("./wasm-structure");
exports.BaseContext = {
    'export': {},
    'fn': { newContext: true },
    'var': { newContext: true },
    ';': { popContext: true },
    '+': {
        types: [
            { input: ['int', 'int'], output: ['int'], opCodes: [wasm_structure_1.Opcodes.i32add] },
            { input: ['long', 'long'], output: ['long'], opCodes: [wasm_structure_1.Opcodes.i64add] },
            { input: ['float', 'float'], output: ['float'], opCodes: [wasm_structure_1.Opcodes.f32add] },
            { input: ['double', 'double'], output: ['double'], opCodes: [wasm_structure_1.Opcodes.f64add] },
        ]
    },
    '*': { types: [{ input: ['int', 'int'], output: ['int'], opCodes: [wasm_structure_1.Opcodes.i32mul] }] },
    '-': { types: [{ input: ['int', 'int'], output: ['int'], opCodes: [wasm_structure_1.Opcodes.i32sub] }] },
    '<': { types: [{ input: ['int', 'int'], output: ['int'], opCodes: [wasm_structure_1.Opcodes.i32le_s] }] },
    '==': { types: [{ input: ['int', 'int'], output: ['bool'], opCodes: [wasm_structure_1.Opcodes.i32eq] }] },
    '==0': { types: [{ input: ['int'], output: ['bool'], opCodes: [wasm_structure_1.Opcodes.i32eqz] }] },
    '&&': { types: [{ input: ['int', 'int'], output: ['bool'], opCodes: [wasm_structure_1.Opcodes.i32and] }] },
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
                var match = context[nextWord];
                console.log(nextWord);
                if (match.types) {
                    // TODO: find actual matching type                
                    var matchedType = match.types[0];
                    console.log(matchedType);
                }
                if (match.newContext === true) {
                    context = Object.create(context);
                }
                if (match.popContext === true) {
                    context = Object.getPrototypeOf(context);
                }
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
