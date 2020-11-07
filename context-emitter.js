"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextEmitter = void 0;
var wasm_structure_1 = require("./wasm-structure");
var ContextEmitter = /** @class */ (function () {
    function ContextEmitter() {
    }
    ContextEmitter.prototype.getBytes = function (expressions) {
        var _this = this;
        var _a, _b;
        var wasmStructure = new wasm_structure_1.WasmStructure();
        var i = 0;
        // var currentFunctionId : number | null = null;
        while (i < expressions.length) {
            var expression = expressions[i];
            if (expression.desc) {
                // console.log(expression.desc);
            }
            if (expression.desc == 'import') {
                // var importEndIndex = expressions.slice(i).findIndex(x => x.op == Opcodes.end) + i;
                // var importType = expressions.slice(i, importEndIndex).map(x => x.desc).indexOf('fn') != -1 ? "fn" : 'NOT IMPLEMENTED IMPORT';
                // console.log('importing emitter')
                // var type = expression.function.types ? expression.function.types[0] : {};
                // var resultType = type.output?.map(x => this.mapTypeToWasmType(x))[0] || WasmType.f64;
            }
            if (expression.function) {
                var functionEndIndex = expressions.slice(i).findIndex(function (x) { return x.op == wasm_structure_1.Opcodes.end; }) + i;
                var functionReference = expression.function.functionReference;
                if (functionReference == null) {
                    throw Error("There should be a function reference here");
                }
                var name = functionReference.name || "ERROR STATE";
                var type = expression.function.types ? expression.function.types[0] : {};
                var resultType = ((_a = type.output) === null || _a === void 0 ? void 0 : _a.map(function (x) { return _this.mapTypeToWasmType(x); })[0]) || wasm_structure_1.WasmType.f64;
                var typeIndex = wasmStructure.addFunctionType(((_b = type.input) === null || _b === void 0 ? void 0 : _b.map(function (x) { return _this.mapTypeToWasmType(x); })) || [wasm_structure_1.WasmType.f64], resultType);
                functionReference.typeID = typeIndex;
                var functionIndex = wasmStructure.addFunction(typeIndex);
                functionReference.functionID = functionIndex;
                if (i > 0 && expressions[i - 1].desc == 'export') { // TODO: Better way to handle this?
                    var exportIndex = wasmStructure.addExport(name, wasm_structure_1.ExportKind.function, functionIndex);
                    functionReference.exportID = exportIndex;
                }
                if (i > 2 && expressions[i - 3].desc == 'import') { // TODO: Better way to handle this?
                    var importIndex = wasmStructure.addImportFunction(expressions[i - 2].desc || 'UNKNOWN', expressions[i - 1].desc || 'UNKNOWN', name, functionIndex);
                    // functionReference.im = ImportIndex;
                }
                var code = expressions
                    .slice(i, functionEndIndex)
                    .filter(function (x) { return x.op != undefined; })
                    .map(function (x) { return typeof (x.op) == 'function' ? x.op() : x.op; });
                var declCount = 0;
                var codeId = wasmStructure.addCode(__spreadArrays([declCount], code, [wasm_structure_1.Opcodes.end]));
                i = functionEndIndex;
            }
            // TODO: maybe op should be separate from value? 
            // if (expression.op == Opcodes.end) {
            //     // wasmStructure.addCode()
            // }
            // else if (expression.op !== undefined) {
            // }
            // if (expression.reference) {
            // }
            i++;
        }
        return wasmStructure.getBytes();
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
