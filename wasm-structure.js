"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasmStructure = exports.ExportKind = exports.Opcodes = exports.WasmType = exports.WasmSection = void 0;
var WasmSection = /** @class */ (function () {
    function WasmSection() {
    }
    return WasmSection;
}());
exports.WasmSection = WasmSection;
var WasmType;
(function (WasmType) {
    WasmType[WasmType["i32"] = 127] = "i32";
    WasmType[WasmType["i64"] = 126] = "i64";
    WasmType[WasmType["f32"] = 125] = "f32";
    WasmType[WasmType["f64"] = 124] = "f64";
})(WasmType = exports.WasmType || (exports.WasmType = {}));
var Opcodes;
(function (Opcodes) {
    //https://webassembly.github.io/spec/core/binary/instructions.html
    Opcodes[Opcodes["call"] = 16] = "call";
    Opcodes[Opcodes["get_local"] = 32] = "get_local";
    Opcodes[Opcodes["i32Const"] = 65] = "i32Const";
    Opcodes[Opcodes["i64Const"] = 66] = "i64Const";
    Opcodes[Opcodes["f32Const"] = 67] = "f32Const";
    Opcodes[Opcodes["f64Const"] = 68] = "f64Const";
    Opcodes[Opcodes["end"] = 11] = "end";
    Opcodes[Opcodes["i32Add"] = 106] = "i32Add";
    Opcodes[Opcodes["i32Mul"] = 108] = "i32Mul";
})(Opcodes = exports.Opcodes || (exports.Opcodes = {}));
;
// export kind (0x00 = functionIndex, 0x01 = tableIndex, 0x02 = memory index, 0x03 = global index)
var ExportKind;
(function (ExportKind) {
    ExportKind[ExportKind["function"] = 0] = "function";
    ExportKind[ExportKind["table"] = 1] = "table";
    ExportKind[ExportKind["memory"] = 2] = "memory";
    ExportKind[ExportKind["global"] = 3] = "global";
})(ExportKind = exports.ExportKind || (exports.ExportKind = {}));
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
        // addEmitImport(): void {
        //     // Not working :( )
        //     var emitTest = [ // TODO
        //         0x08,                                        // string length
        //         0x66, 0x75, 0x6e, 0x63, 0x74, 0x69, 0x6f, 0x6e,                      //function  ; import module name
        //         0x04,                                       // ; string length
        //         0x65, 0x6d, 0x69, 0x74,                                //emit  ; import field name
        //         0x00,                                       // ; import kind
        //         0x00,                                       // ; import signature index
        //         0x11                                       // ; FIXUP section size
        //     ];
        //     for (var i = 0; i < emitTest.length; i++) {
        //         this.imports.push(emitTest[i]);
        //     }
        // }
        this.importId = 0;
        // Return ID
        this.typeId = 0;
        this.functionIndex = 0;
        this.exportId = 0;
        this.codeId = 0;
        this.customSection = [];
        this.types = [];
        this.imports = [];
        this.functions = [];
        this.codeSections = [];
        this.exports = [];
    }
    WasmStructure.prototype.addImportFunction = function (importModule, importField, internalName, parameters, result) {
        // TODO: ...
        var typeId = this.addFunctionType(parameters, result);
        var functionId = this.addFunction();
        var declCount = 0;
        // var codeId = this.addCode([declCount, ...functionBody, Opcodes.end]);
        var data = [];
        for (var i = 0; i < data.length; i++) {
            this.imports.push(data[i]);
        }
        return this.importId++;
    };
    WasmStructure.prototype.AddExportFunction = function (exportName, parameters, result, functionBody) {
        var typeId = this.addFunctionType(parameters, result);
        var functionId = this.addFunction();
        var exportId = this.addExport(exportName, ExportKind.function, functionId);
        var declCount = 0;
        var codeId = this.addCode(__spreadArrays([declCount], functionBody, [Opcodes.end]));
        return {
            typeId: typeId,
            functionId: functionId,
            exportId: exportId,
            codeId: codeId
        };
    };
    WasmStructure.prototype.addFunctionType = function (parameters, result) {
        var data = __spreadArrays([0x60,
            parameters.length], parameters);
        if (result != null) {
            data.push(1);
            data.push(result);
        }
        for (var i = 0; i < data.length; i++) {
            this.types.push(data[i]);
        }
        return this.typeId++;
    };
    WasmStructure.prototype.addFunction = function () {
        this.functions.push(this.functionIndex);
        return this.functionIndex++;
    };
    WasmStructure.prototype.stringToUTF8 = function (text) {
        if (!text) {
            throw new Error('no text');
        }
        var results = [];
        // TODO: I need better handlings of this. 
        for (var i = 0; i < text.length; i++) {
            results.push(text.charCodeAt(i));
        }
        return results;
        // return new TextEncoder().encode(text);
    };
    WasmStructure.prototype.addExport = function (exportName, exportKind, index) {
        var nameUtf8 = this.stringToUTF8(exportName);
        // length of subsequent string
        this.exports.push(nameUtf8.length);
        // string bytes from name
        for (var i = 0; i < nameUtf8.length; i++) {
            this.exports.push(nameUtf8[i]);
        }
        this.exports.push(exportKind);
        // export index of this export kind
        this.exports.push(index);
        return this.exportId++;
    };
    WasmStructure.prototype.addCode = function (values) {
        this.codeSections.push(values.length); // each item gets the length defined
        for (var i = 0; i < values.length; i++) {
            this.codeSections.push(values[i]);
        }
        return this.codeId++;
    };
    WasmStructure.prototype.AddFunctionDetails = function (parameters, result, functionBody) {
        var typeId = this.addFunctionType(parameters, result);
        var functionId = this.addFunction();
        var declCount = 0;
        var codeId = this.addCode(__spreadArrays([declCount], functionBody, [Opcodes.end]));
        return {
            typeId: typeId,
            functionId: functionId,
            codeId: codeId
        };
    };
    WasmStructure.prototype.formatSectionForWasm = function (SectionID, bytes) {
        var u32Length = bytes.length + 1; // this.toBytesInt32(bytes.length + 1)
        return bytes.length > 0 ? __spreadArrays([SectionID,
            u32Length], bytes) : [];
    };
    // formatSectionForWasmWithCount(SectionID: number, count: number, bytes: Array<number>): Array<number> {
    //     return bytes.length > 0 ?
    //         [SectionID,
    //             count,
    //             ...bytes] : [];
    // }
    WasmStructure.prototype.toBytesInt32 = function (value) {
        // var result = new Uint8Array([
        //     (value & 0xff000000) >> 24,
        //     (value & 0x00ff0000) >> 16,
        //     (value & 0x0000ff00) >> 8,
        //     (value & 0x000000ff)
        // ]);
        // return result.buffer;
        return [
            (value & 0xff000000) >> 24,
            (value & 0x00ff0000) >> 16,
            (value & 0x0000ff00) >> 8,
            (value & 0x000000ff)
        ];
    };
    WasmStructure.prototype.formatCodeSection = function () {
    };
    WasmStructure.prototype.formatSectionForWasmWithSizeAndCount = function (SectionID, count, bytes) {
        var u32Length = bytes.length + 1; //this.toBytesInt32(bytes.length + 1)
        // var u32Length = new Uint32Array([bytes.length + 1]);
        // var u8Length = Uint8Array.from(u32Length);
        // for (var i = 0; i < u32Length.byteLength; i++) {
        //     // console.log(u32Length.buffer[i])
        // }
        // console.log(u32Length.buffer);
        return bytes.length > 0 ? __spreadArrays([SectionID,
            u32Length,
            count], bytes) : [];
    };
    WasmStructure.prototype.getBytes = function () {
        var results = Uint8Array.from(__spreadArrays(this.wasmHeader, this.wasmVersion, this.formatSectionForWasmWithSizeAndCount(this.section.type, this.typeId, this.types), this.formatSectionForWasmWithSizeAndCount(this.section.function, this.functionIndex, this.functions), this.formatSectionForWasmWithSizeAndCount(this.section.import, this.importId, this.imports), this.formatSectionForWasmWithSizeAndCount(this.section.export, this.exportId, this.exports), this.formatSectionForWasmWithSizeAndCount(this.section.code, this.codeId, this.codeSections)));
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
