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
            { inputTypes: ['int', 'int'], outputTypes: ['int'], opCodes: [wasm_structure_1.Opcodes.i32add] },
            { inputTypes: ['long', 'long'], outputTypes: ['long'], opCodes: [wasm_structure_1.Opcodes.i64add] },
            { inputTypes: ['float', 'float'], outputTypes: ['float'], opCodes: [wasm_structure_1.Opcodes.f32add] },
            { inputTypes: ['double', 'double'], outputTypes: ['double'], opCodes: [wasm_structure_1.Opcodes.f64add] },
        ]
    },
    '*': { types: [{ inputTypes: ['int', 'int'], outputTypes: ['int'], opCodes: [wasm_structure_1.Opcodes.i32mul] }] },
    '-': { types: [{ inputTypes: ['int', 'int'], outputTypes: ['int'], opCodes: [wasm_structure_1.Opcodes.i32sub] }] },
    '<': { types: [{ inputTypes: ['int', 'int'], outputTypes: ['int'], opCodes: [wasm_structure_1.Opcodes.i32le_s] }] },
    '==': { types: [{ inputTypes: ['int', 'int'], outputTypes: ['bool'], opCodes: [wasm_structure_1.Opcodes.i32eq] }] },
    '==0': { types: [{ inputTypes: ['int'], outputTypes: ['bool'], opCodes: [wasm_structure_1.Opcodes.i32eqz] }] },
    '&&': { types: [{ inputTypes: ['int', 'int'], outputTypes: ['bool'], opCodes: [wasm_structure_1.Opcodes.i32and] }] },
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
                if (context[nextWord].types) {
                    // TODO: find actual matching type                
                    var matchedType = context[nextWord].types[0];
                    console.log(matchedType);
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
