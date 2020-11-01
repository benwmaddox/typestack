"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextEmitter = void 0;
var wasm_structure_1 = require("./wasm-structure");
var ContextEmitter = /** @class */ (function () {
    function ContextEmitter() {
    }
    ContextEmitter.prototype.getBytes = function (expressions) {
        var _this = this;
        var _a, _b, _c;
        var wasmStructure = new wasm_structure_1.WasmStructure();
        var i = 0;
        // var currentFunctionId : number | null = null;
        while (i < expressions.length) {
            var expression = expressions[i];
            if (expression.desc) {
                console.log(expression.desc);
            }
            if (expression.function) {
                // TODO: maybe op should be separate from value? 
                var functionEndIndex = expressions.findIndex(function (x) { return x.op == wasm_structure_1.Opcodes.end; });
                var name = ((_a = expression.function.functionReference) === null || _a === void 0 ? void 0 : _a.name) || "ERROR STATE";
                var type = expression.function.types ? expression.function.types[0] : {};
                var resultType = ((_b = type.output) === null || _b === void 0 ? void 0 : _b.map(function (x) { return _this.mapTypeToWasmType(x); })[0]) || wasm_structure_1.WasmType.f64;
                var typeIndex = wasmStructure.addFunctionType(((_c = type.input) === null || _c === void 0 ? void 0 : _c.map(function (x) { return _this.mapTypeToWasmType(x); })) || [wasm_structure_1.WasmType.f64], resultType);
                var functionIndex = wasmStructure.addFunction(typeIndex);
                if (false) {
                    wasmStructure.addExport(name, wasm_structure_1.ExportKind.function, functionIndex);
                }
                // wasmStructure.AddExportFunction(name,
                //     type.parameters?.map(x => this.mapTypeToWasmType(x)) || [WasmType.f64],
                //     null,
                //     expressions.slice(i, functionEndIndex)
                // )
            }
            if (expression.op == wasm_structure_1.Opcodes.end) {
                // wasmStructure.addCode()
            }
            else if (expression.op !== undefined) {
            }
            if (expression.reference) {
            }
            i++;
        }
    };
    ContextEmitter.prototype.mapTypeToWasmType = function (input) {
        if (input == "int")
            return wasm_structure_1.WasmType.i32;
        if (input == "long")
            return wasm_structure_1.WasmType.i64;
        if (input == "float")
            return wasm_structure_1.WasmType.f32;
        if (input == "double")
            return wasm_structure_1.WasmType.f64;
        throw new Error("Can't convert to wasm type " + input);
    };
    return ContextEmitter;
}());
exports.ContextEmitter = ContextEmitter;
