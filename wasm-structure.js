"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasmStructure = exports.WasmType = exports.WasmSection = void 0;
var WasmSection = /** @class */ (function () {
    function WasmSection() {
    }
    return WasmSection;
}());
exports.WasmSection = WasmSection;
var WasmType;
(function (WasmType) {
    WasmType[WasmType["i32"] = 0] = "i32";
    WasmType[WasmType["i64"] = 1] = "i64";
    WasmType[WasmType["f32"] = 2] = "f32";
    WasmType[WasmType["f64"] = 3] = "f64";
})(WasmType = exports.WasmType || (exports.WasmType = {}));
var WasmStructure = /** @class */ (function () {
    function WasmStructure() {
        this.wasmHeader = [0x00, 0x61, 0x73, 0x6d];
        this.wasmVersion = [0x01, 0x00, 0x00, 0x00];
        this.section = {
            custom: 0x00,
            type: 0x01,
            import: 0x02,
            function: 0x03,
            table: 0x04,
            memory: 0x05,
            global: 0x06,
            export: 0x07,
            start: 0x08,
            elem: 0x09,
            code: 0x0A,
            data: 0x0B
        };
        this.customSection = [];
        this.types = [];
        this.imports = [];
        this.functions = [];
    }
    WasmStructure.prototype.addEmitImport = function () {
        var emitTest = [
            0x08,
            0x66, 0x75, 0x6e, 0x63, 0x74, 0x69, 0x6f, 0x6e,
            0x04,
            0x65, 0x6d, 0x69, 0x74,
            0x00,
            0x00,
            0x11 // ; FIXUP section size
        ];
        for (var i = 0; i < emitTest.length; i++) {
            this.imports.push(emitTest[i]);
        }
    };
    WasmStructure.prototype.addImport = function (importModule, importField, internalName, parameters, result) {
        var data = [];
        for (var i = 0; i < data.length; i++) {
            this.imports.push(data[i]);
        }
    };
    WasmStructure.prototype.formatSectionForWasm = function (SectionID, bytes) {
        return bytes.length > 0 ? __spreadArrays([SectionID,
            bytes.length], bytes) : [];
    };
    WasmStructure.prototype.getBytes = function () {
        var results = Uint8Array.from(__spreadArrays(this.wasmHeader, this.wasmVersion, this.formatSectionForWasm(this.section.type, this.types), this.formatSectionForWasm(this.section.function, this.functions), this.formatSectionForWasm(this.section.import, this.imports)));
        return results;
    };
    return WasmStructure;
}());
exports.WasmStructure = WasmStructure;
// export class WasmStructure {
//     private typeId: number = 0;
//     wasmHeader: Array<number> = [0x00, 0x61, 0x73, 0x6d];
//     wasmVersion: Array<number> = [0x01, 0x00, 0x00, 0x00];
//     opcodes = {
//         call: 0x10,
//         get_local: 0x20,
//         const: 0x43,
//         end: 0x0b
//     };
//     section = {
//         type: 0x01,
//         import: 0x02,
//         function: 0x03,
//         table: 0x04,
//         memory: 0x05,
//         global: 0x06,
//         export: 0x07,
//         start: 0x08,
//         elem: 0x09,
//         code: 0x0A,
//         data: 0x0B
//     }
//     valueType = {
//         i32: 0x7F,
//         i64: 0x7E,
//         f32: 0x7D,
//         f64: 0x7C
//     }
//     encodeRunType() {
//         var numberOfParameters = 1; // any number
//         var nubmerOfResults = 0; // 0 or 1?
//         return [
//             this.typeId++,
//             numberOfParameters,
//             nubmerOfResults
//         ]
//     }
//     tokenize(text: string): Array<string> {
//         var tokens: Array<string> = [];
//         var currentToken = "";
//         var withinSingleQuote = false;
//         var withinDoubleQuote = false;
//         var withinComment = false;
//         for (var i = 0; i < text.length; i++) {
//             if (text[i] == "'") {
//                 currentToken += text[i];
//                 withinSingleQuote = !withinSingleQuote;
//             }
//             else if (text[i] == "\"") {
//                 currentToken += text[i];
//                 withinDoubleQuote = !withinDoubleQuote;
//             }
//             else if (text[i] == "/" && text.length > i + 1 && text[i + 1] == "/") {
//                 withinComment = true;
//             }
//             else if (withinComment && text[i] == "\n") {
//                 withinComment = false;
//             }
//             else if ((text[i] == " " || text[i] == "\n" || text[i] == "\n" || text[i] == "\r")
//                 && !withinSingleQuote && !withinDoubleQuote) {
//                 if (currentToken != "") {
//                     tokens.push(currentToken)
//                     currentToken = "";
//                 }
//             }
//             else if (!withinComment) {
//                 currentToken += text[i];
//             }
//         }
//         if (currentToken != "") {
//             tokens.push(currentToken);
//         }
//         return tokens;
//     }
//     compile(text: string) {
//         var tokens = this.tokenize(text);
//         console.log(tokens);
//         var runType = this.encodeRunType();
//         var types = [
//             // run signature
//             this.section.type,
//             0,
//             1, // number of types, figure this out
//             ...runType,
//         ];
//         types.push(types.length);// Add type FIXUP
//         var importBytes: Array<number> = [ // TODO
//             0x08,                                        // string length
//             0x66, 0x75, 0x6e, 0x63, 0x74, 0x69, 0x6f, 0x6e,                      //function  ; import module name
//             0x04,                                       // ; string length
//             0x65, 0x6d, 0x6974,                                //emit  ; import field name
//             0x00,                                       // ; import kind
//             0x00,                                       // ; import signature index
//             0x11                                       // ; FIXUP section size
//         ];
//         var imports = [
//             this.section.import,
//             0,
//             1, // number of imports
//             importBytes.length,
//             ...importBytes
//         ];
//         var functionBytes: Array<number> = [
//             // run 
//         ];
//         var functions = [
//             this.section.function,
//             functionBytes.length,
//             ...functionBytes
//         ];
//         var codeDefinitions: Array<number> = [
//         ];
//         var runIndex = 1; // find index of run function
//         var startSection = [
//             this.section.start,
//             1, // size of next value...
//             runIndex
//         ]
//         return Uint8Array.from([
//             ...this.wasmHeader,
//             ...this.wasmVersion,
//             // ...types,
//             ...imports,
//             ...functions,
//             ...codeDefinitions,
//             // ...startSection
//         ]);
//     }
// }
