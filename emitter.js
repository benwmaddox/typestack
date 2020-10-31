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
        for (var i = 0; i < module.functions.length; i++) {
            var func = module.functions[i];
            if (func.shouldExport && func.name) {
                if (func.name) {
                    var exportIDs = wasmStructure.AddExportFunction(func.name, this.convertASTParametersToWasm(func.parameters), this.convertASTResultToWasm(func.result) || wasm_structure_1.WasmType.i32, this.buildFunctionBody(func.actions));
                }
                else {
                    throw new Error("Missing function name with export");
                }
            }
            else {
                var functionIDs = wasmStructure.AddFunctionDetails(this.convertASTParametersToWasm(func.parameters), this.convertASTResultToWasm(func.result) || wasm_structure_1.WasmType.i32, this.buildFunctionBody(func.actions));
            }
        }
        return wasmStructure.getBytes();
    };
    Emitter.prototype.buildFunctionBody = function (actions) {
        var results = [];
        // TODO ..............................................................................................................
        return results;
    };
    Emitter.prototype.convertASTParametersToWasm = function (input) {
        var result = [];
        for (var i = 0; i < input.length; i++) {
            var wasmType = this.convertASTParameterToWasm(input[i]);
            if (wasmType != null) {
                result.push(wasmType);
            }
        }
        return result;
    };
    Emitter.prototype.convertASTParameterToWasm = function (input) {
        var result = null;
        if (input == null)
            return null;
        if (input.type == "int") {
            result = wasm_structure_1.WasmType.i32;
        }
        else if (input.type == "long") {
            result = wasm_structure_1.WasmType.i64;
        }
        else if (input.type == "float") {
            result = wasm_structure_1.WasmType.f32;
        }
        else if (input.type == "double") {
            result = wasm_structure_1.WasmType.f64;
        }
        return result;
    };
    Emitter.prototype.convertASTResultToWasm = function (input) {
        var result = null;
        if (input == null)
            return null;
        if (input.type == "int") {
            result = wasm_structure_1.WasmType.i32;
        }
        else if (input.type == "long") {
            result = wasm_structure_1.WasmType.i64;
        }
        else if (input.type == "float") {
            result = wasm_structure_1.WasmType.f32;
        }
        else if (input.type == "double") {
            result = wasm_structure_1.WasmType.f64;
        }
        return result;
    };
    return Emitter;
}());
exports.Emitter = Emitter;
