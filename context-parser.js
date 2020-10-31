"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextParser = exports.BaseContext = void 0;
var wasm_structure_1 = require("./wasm-structure");
exports.BaseContext = {
    "export": { inputTypes: undefined, outputTypes: undefined, OpsCodes: undefined },
    "fn": { inputTypes: undefined, outputTypes: undefined, OpsCodes: undefined, newContext: true },
    ";": { inputTypes: undefined, outputTypes: undefined, OpsCodes: [wasm_structure_1.Opcodes.end], popContext: true },
    '+': { inputTypes: ['int', 'int'], outputTypes: ['int'], OpsCodes: [wasm_structure_1.Opcodes.i32Add] },
    '*': { inputTypes: ['int', 'int'], outputTypes: ['int'], OpsCodes: [wasm_structure_1.Opcodes.i32Mul] },
    '-': { inputTypes: ['int', 'int'], outputTypes: ['int'], OpsCodes: [wasm_structure_1.Opcodes.i32Sub] },
    '<': { inputTypes: ['int', 'int'], outputTypes: ['int'], OpsCodes: [wasm_structure_1.Opcodes.i32LessThanSigned] },
    '==': { inputTypes: ['int', 'int'], outputTypes: ['bool'], OpsCodes: [wasm_structure_1.Opcodes.i32Equals] },
    '==0': { inputTypes: ['int'], outputTypes: ['bool'], OpsCodes: [wasm_structure_1.Opcodes.i32EqualsZero] },
    '&&': { inputTypes: ['int', 'int'], outputTypes: ['bool'], OpsCodes: [wasm_structure_1.Opcodes.i32And] }
};
var ContextParser = /** @class */ (function () {
    function ContextParser() {
    }
    ContextParser.prototype.parse = function (context, words) {
        return {};
    };
    return ContextParser;
}());
exports.ContextParser = ContextParser;
