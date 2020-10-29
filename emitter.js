"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emitter = void 0;
var wasm_structure_1 = require("./wasm-structure");
var Emitter = /** @class */ (function () {
    function Emitter() {
    }
    Emitter.prototype.getBytes = function (module) {
        var result = new Uint8Array();
        var wasmStructure = new wasm_structure_1.WasmStructure();
        // wasmStructure.addFunction()
        return wasmStructure.getBytes();
    };
    return Emitter;
}());
exports.Emitter = Emitter;
