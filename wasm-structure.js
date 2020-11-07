"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasmStructure = exports.toUnsignedLEB128 = exports.ExportKind = exports.Opcodes = exports.WasmType = exports.WasmSection = void 0;
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
    Opcodes[Opcodes["blockType"] = 64] = "blockType";
    Opcodes[Opcodes["unreachable"] = 0] = "unreachable";
    Opcodes[Opcodes["nop"] = 1] = "nop";
    Opcodes[Opcodes["blockIn"] = 2] = "blockIn";
    Opcodes[Opcodes["blockLoop"] = 3] = "blockLoop";
    Opcodes[Opcodes["blockIf"] = 4] = "blockIf";
    Opcodes[Opcodes["else"] = 5] = "else";
    Opcodes[Opcodes["labelIndex"] = 12] = "labelIndex";
    Opcodes[Opcodes["labelIfIndex"] = 13] = "labelIfIndex";
    Opcodes[Opcodes["umm"] = 14] = "umm";
    Opcodes[Opcodes["return"] = 15] = "return";
    Opcodes[Opcodes["call"] = 16] = "call";
    Opcodes[Opcodes["callIndirect"] = 17] = "callIndirect";
    // Parametric
    Opcodes[Opcodes["drop"] = 26] = "drop";
    Opcodes[Opcodes["select"] = 27] = "select";
    // variable
    Opcodes[Opcodes["get_local"] = 32] = "get_local";
    Opcodes[Opcodes["set_local"] = 33] = "set_local";
    Opcodes[Opcodes["tee_local"] = 34] = "tee_local";
    Opcodes[Opcodes["get_global"] = 35] = "get_global";
    Opcodes[Opcodes["set_global"] = 36] = "set_global";
    // memory
    Opcodes[Opcodes["i32Load"] = 40] = "i32Load";
    Opcodes[Opcodes["i64Load"] = 41] = "i64Load";
    Opcodes[Opcodes["f32Load"] = 42] = "f32Load";
    Opcodes[Opcodes["f64Load"] = 43] = "f64Load";
    Opcodes[Opcodes["i32Load8_s"] = 44] = "i32Load8_s";
    Opcodes[Opcodes["i32Load8_u"] = 45] = "i32Load8_u";
    Opcodes[Opcodes["i32Load16_s"] = 46] = "i32Load16_s";
    Opcodes[Opcodes["i32Load16_u"] = 47] = "i32Load16_u";
    Opcodes[Opcodes["i64Load8_s"] = 48] = "i64Load8_s";
    Opcodes[Opcodes["i64Load8_u"] = 49] = "i64Load8_u";
    Opcodes[Opcodes["i64Load16_s"] = 50] = "i64Load16_s";
    Opcodes[Opcodes["i64Load16_u"] = 51] = "i64Load16_u";
    Opcodes[Opcodes["i64Load32_s"] = 52] = "i64Load32_s";
    Opcodes[Opcodes["i64Load32_u"] = 53] = "i64Load32_u";
    Opcodes[Opcodes["i32Store"] = 54] = "i32Store";
    Opcodes[Opcodes["i64Store"] = 55] = "i64Store";
    Opcodes[Opcodes["f32Store"] = 56] = "f32Store";
    Opcodes[Opcodes["f64Store"] = 57] = "f64Store";
    Opcodes[Opcodes["i32Store8"] = 58] = "i32Store8";
    Opcodes[Opcodes["i32Store16"] = 59] = "i32Store16";
    Opcodes[Opcodes["i64Store8"] = 60] = "i64Store8";
    Opcodes[Opcodes["i64Store16"] = 61] = "i64Store16";
    Opcodes[Opcodes["i64Store32"] = 62] = "i64Store32";
    Opcodes[Opcodes["memorySize"] = 63] = "memorySize";
    Opcodes[Opcodes["memoryGrow"] = 64] = "memoryGrow";
    // numeric - immediate value following
    Opcodes[Opcodes["i32Const"] = 65] = "i32Const";
    Opcodes[Opcodes["i64Const"] = 66] = "i64Const";
    Opcodes[Opcodes["f32Const"] = 67] = "f32Const";
    Opcodes[Opcodes["f64Const"] = 68] = "f64Const";
    // numeric - without immediate values
    Opcodes[Opcodes["i32eqz"] = 69] = "i32eqz";
    Opcodes[Opcodes["i32eq"] = 70] = "i32eq";
    Opcodes[Opcodes["i32ne"] = 71] = "i32ne";
    Opcodes[Opcodes["i32lt_s"] = 72] = "i32lt_s";
    Opcodes[Opcodes["i32lt_u"] = 73] = "i32lt_u";
    Opcodes[Opcodes["i32gt_s"] = 74] = "i32gt_s";
    Opcodes[Opcodes["i32gt_u"] = 75] = "i32gt_u";
    Opcodes[Opcodes["i32le_s"] = 76] = "i32le_s";
    Opcodes[Opcodes["i32le_u"] = 77] = "i32le_u";
    Opcodes[Opcodes["i32ge_s"] = 78] = "i32ge_s";
    Opcodes[Opcodes["i32ge_u"] = 79] = "i32ge_u";
    Opcodes[Opcodes["i64eqz"] = 80] = "i64eqz";
    Opcodes[Opcodes["i64eq"] = 81] = "i64eq";
    Opcodes[Opcodes["i64ne"] = 82] = "i64ne";
    Opcodes[Opcodes["i64lt_s"] = 83] = "i64lt_s";
    Opcodes[Opcodes["i64lt_u"] = 84] = "i64lt_u";
    Opcodes[Opcodes["i64gt_s"] = 85] = "i64gt_s";
    Opcodes[Opcodes["i64gt_u"] = 86] = "i64gt_u";
    Opcodes[Opcodes["i64le_s"] = 87] = "i64le_s";
    Opcodes[Opcodes["i64le_u"] = 88] = "i64le_u";
    Opcodes[Opcodes["i64ge_s"] = 89] = "i64ge_s";
    Opcodes[Opcodes["i64ge_u"] = 90] = "i64ge_u";
    Opcodes[Opcodes["f32eq"] = 91] = "f32eq";
    Opcodes[Opcodes["f32ne"] = 92] = "f32ne";
    Opcodes[Opcodes["f32lt"] = 93] = "f32lt";
    Opcodes[Opcodes["f32gt"] = 94] = "f32gt";
    Opcodes[Opcodes["f32le"] = 95] = "f32le";
    Opcodes[Opcodes["f32ge"] = 96] = "f32ge";
    Opcodes[Opcodes["f64eq"] = 97] = "f64eq";
    Opcodes[Opcodes["f64ne"] = 98] = "f64ne";
    Opcodes[Opcodes["f64lt"] = 99] = "f64lt";
    Opcodes[Opcodes["f64gt"] = 100] = "f64gt";
    Opcodes[Opcodes["f64le"] = 101] = "f64le";
    Opcodes[Opcodes["f64ge"] = 102] = "f64ge";
    Opcodes[Opcodes["i32clz"] = 103] = "i32clz";
    Opcodes[Opcodes["i32ctz"] = 104] = "i32ctz";
    Opcodes[Opcodes["i32popcnt"] = 105] = "i32popcnt";
    Opcodes[Opcodes["i32add"] = 106] = "i32add";
    Opcodes[Opcodes["i32sub"] = 107] = "i32sub";
    Opcodes[Opcodes["i32mul"] = 108] = "i32mul";
    Opcodes[Opcodes["i32div_s"] = 109] = "i32div_s";
    Opcodes[Opcodes["i32div_u"] = 110] = "i32div_u";
    Opcodes[Opcodes["i32rem_s"] = 111] = "i32rem_s";
    Opcodes[Opcodes["i32rem_u"] = 112] = "i32rem_u";
    Opcodes[Opcodes["i32and"] = 113] = "i32and";
    Opcodes[Opcodes["i32or"] = 114] = "i32or";
    Opcodes[Opcodes["i32xor"] = 115] = "i32xor";
    Opcodes[Opcodes["i32shl"] = 116] = "i32shl";
    Opcodes[Opcodes["i32shr_s"] = 117] = "i32shr_s";
    Opcodes[Opcodes["i32shr_u"] = 118] = "i32shr_u";
    Opcodes[Opcodes["i32rotl"] = 119] = "i32rotl";
    Opcodes[Opcodes["i32rotr"] = 120] = "i32rotr";
    Opcodes[Opcodes["i64clz"] = 121] = "i64clz";
    Opcodes[Opcodes["i64ctz"] = 122] = "i64ctz";
    Opcodes[Opcodes["i64popcnt"] = 123] = "i64popcnt";
    Opcodes[Opcodes["i64add"] = 124] = "i64add";
    Opcodes[Opcodes["i64sub"] = 125] = "i64sub";
    Opcodes[Opcodes["i64mul"] = 126] = "i64mul";
    Opcodes[Opcodes["i64div_s"] = 127] = "i64div_s";
    Opcodes[Opcodes["i64div_u"] = 128] = "i64div_u";
    Opcodes[Opcodes["i64rem_s"] = 129] = "i64rem_s";
    Opcodes[Opcodes["i64rem_u"] = 130] = "i64rem_u";
    Opcodes[Opcodes["i64and"] = 131] = "i64and";
    Opcodes[Opcodes["i64or"] = 132] = "i64or";
    Opcodes[Opcodes["i64xor"] = 133] = "i64xor";
    Opcodes[Opcodes["i64shl"] = 134] = "i64shl";
    Opcodes[Opcodes["i64shr_s"] = 135] = "i64shr_s";
    Opcodes[Opcodes["i64shr_u"] = 136] = "i64shr_u";
    Opcodes[Opcodes["i64rotl"] = 137] = "i64rotl";
    Opcodes[Opcodes["i64rotr"] = 138] = "i64rotr";
    Opcodes[Opcodes["f32abs"] = 139] = "f32abs";
    Opcodes[Opcodes["f32neg"] = 140] = "f32neg";
    Opcodes[Opcodes["f32ceil"] = 141] = "f32ceil";
    Opcodes[Opcodes["f32floor"] = 142] = "f32floor";
    Opcodes[Opcodes["f32trunc"] = 143] = "f32trunc";
    Opcodes[Opcodes["f32nearest"] = 144] = "f32nearest";
    Opcodes[Opcodes["f32sqrt"] = 145] = "f32sqrt";
    Opcodes[Opcodes["f32add"] = 146] = "f32add";
    Opcodes[Opcodes["f32sub"] = 147] = "f32sub";
    Opcodes[Opcodes["f32mul"] = 148] = "f32mul";
    Opcodes[Opcodes["f32div"] = 149] = "f32div";
    Opcodes[Opcodes["f32min"] = 150] = "f32min";
    Opcodes[Opcodes["f32max"] = 151] = "f32max";
    Opcodes[Opcodes["f32copysign"] = 152] = "f32copysign";
    Opcodes[Opcodes["f64abs"] = 153] = "f64abs";
    Opcodes[Opcodes["f64neg"] = 154] = "f64neg";
    Opcodes[Opcodes["f64ceil"] = 155] = "f64ceil";
    Opcodes[Opcodes["f64floor"] = 156] = "f64floor";
    Opcodes[Opcodes["f64trunc"] = 157] = "f64trunc";
    Opcodes[Opcodes["f64nearest"] = 158] = "f64nearest";
    Opcodes[Opcodes["f64sqrt"] = 159] = "f64sqrt";
    Opcodes[Opcodes["f64add"] = 160] = "f64add";
    Opcodes[Opcodes["f64sub"] = 161] = "f64sub";
    Opcodes[Opcodes["f64mul"] = 162] = "f64mul";
    Opcodes[Opcodes["f64div"] = 163] = "f64div";
    Opcodes[Opcodes["f64min"] = 164] = "f64min";
    Opcodes[Opcodes["f64max"] = 69] = "f64max";
    Opcodes[Opcodes["f64copysign"] = 166] = "f64copysign";
    Opcodes[Opcodes["i32wrap_i64"] = 167] = "i32wrap_i64";
    Opcodes[Opcodes["i32trunc_f32_s"] = 168] = "i32trunc_f32_s";
    Opcodes[Opcodes["i32trunc_f32_u"] = 169] = "i32trunc_f32_u";
    Opcodes[Opcodes["i32trunc_f64_s"] = 170] = "i32trunc_f64_s";
    Opcodes[Opcodes["i32trunc_f64_u"] = 171] = "i32trunc_f64_u";
    Opcodes[Opcodes["i64extend_i32_s"] = 172] = "i64extend_i32_s";
    Opcodes[Opcodes["i64extend_i32_u"] = 173] = "i64extend_i32_u";
    Opcodes[Opcodes["i64trunc_f32_s"] = 174] = "i64trunc_f32_s";
    Opcodes[Opcodes["i64trunc_f32_u"] = 175] = "i64trunc_f32_u";
    Opcodes[Opcodes["i64trunc_f64_s"] = 176] = "i64trunc_f64_s";
    Opcodes[Opcodes["i64trunc_f64_u"] = 177] = "i64trunc_f64_u";
    Opcodes[Opcodes["f32convert_i32_s"] = 178] = "f32convert_i32_s";
    Opcodes[Opcodes["f32convert_i32_u"] = 179] = "f32convert_i32_u";
    Opcodes[Opcodes["f32convert_i64_s"] = 180] = "f32convert_i64_s";
    Opcodes[Opcodes["f32convert_i64_u"] = 181] = "f32convert_i64_u";
    Opcodes[Opcodes["f32demote_f64"] = 182] = "f32demote_f64";
    Opcodes[Opcodes["f64convert_i32_s"] = 183] = "f64convert_i32_s";
    Opcodes[Opcodes["f64convert_i32_u"] = 184] = "f64convert_i32_u";
    Opcodes[Opcodes["f64convert_i64_s"] = 185] = "f64convert_i64_s";
    Opcodes[Opcodes["f64convert_i64_u"] = 186] = "f64convert_i64_u";
    Opcodes[Opcodes["f64promote_f32"] = 187] = "f64promote_f32";
    Opcodes[Opcodes["i32reinterpret_f32"] = 188] = "i32reinterpret_f32";
    Opcodes[Opcodes["i64reinterpret_f64"] = 189] = "i64reinterpret_f64";
    Opcodes[Opcodes["f32reinterpret_i32"] = 190] = "f32reinterpret_i32";
    Opcodes[Opcodes["f64reinterpret_i64"] = 191] = "f64reinterpret_i64";
    Opcodes[Opcodes["i32extend8_s"] = 192] = "i32extend8_s";
    Opcodes[Opcodes["i32extend16_s"] = 193] = "i32extend16_s";
    Opcodes[Opcodes["i64extend8_s"] = 194] = "i64extend8_s";
    Opcodes[Opcodes["i64extend16_s"] = 195] = "i64extend16_s";
    Opcodes[Opcodes["i64extend32_s"] = 196] = "i64extend32_s";
    // saturation truncation - 1 byte prefix
    Opcodes[Opcodes["i32tunc_sat"] = 252] = "i32tunc_sat";
    Opcodes[Opcodes["end"] = 11] = "end"; // expression end. function body
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
function toBytesInt32(value) {
    return [
        (value & 0xff000000) >> 24,
        (value & 0x00ff0000) >> 16,
        (value & 0x0000ff00) >> 8,
        (value & 0x000000ff)
    ];
}
function toUnsignedLEB128(value) {
    // var bytes8 = toBytesInt32(value);
    var bytesLEB = [];
    var currentValue = value;
    while (currentValue > 0 || bytesLEB.length === 0) {
        var tmp = (currentValue & 0x0000007F); // 7 bits at true
        // console.log('tmp');
        // console.log(tmp);
        currentValue = currentValue >> 7;
        if (currentValue > 0) {
            tmp = (tmp | 0x00000080);
        }
        // console.log('tmp');
        // console.log(tmp);
        bytesLEB.push(tmp);
    }
    // console.log('From ' + value);
    // console.log(bytesLEB);
    return bytesLEB;
}
exports.toUnsignedLEB128 = toUnsignedLEB128;
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
        this.typeCache = {};
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
    WasmStructure.prototype.addImportFunction = function (importModule, importField, internalName, functionId) {
        console.log("Adding import: " + importModule + ", " + importField + ", " + internalName + ", " + functionId);
        // var typeId = this.addFunctionType(parameters, result);
        // var functionId = this.addFunction(typeId);
        var declCount = 0;
        var data = [];
        for (var i = 0; i < data.length; i++) {
            this.imports.push(data[i]);
        }
        return this.importId++;
    };
    WasmStructure.prototype.AddExportFunction = function (exportName, parameters, result, functionBody) {
        var typeId = this.addFunctionType(parameters, result);
        var functionId = this.addFunction(typeId);
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
        var typeKey = JSON.stringify(data);
        var cacheMatch = this.typeCache[typeKey];
        if (cacheMatch != undefined) {
            return cacheMatch;
        }
        this.typeCache[typeKey] = this.typeId;
        for (var i = 0; i < data.length; i++) {
            this.types.push(data[i]);
        }
        return this.typeId++;
    };
    WasmStructure.prototype.addFunction = function (typeIndex) {
        this.functions.push(typeIndex);
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
        // console.log('Converting ' + exportName);
        // console.log(nameUtf8);
        // console.log(nameUtf8.length);
        // console.log(index);
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
        var functionId = this.addFunction(typeId);
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
    WasmStructure.prototype.formatCodeSection = function () {
    };
    WasmStructure.prototype.formatSectionForWasmWithSizeAndCount = function (SectionID, count, bytes) {
        var results = bytes.length > 0 ? __spreadArrays([SectionID], toUnsignedLEB128(bytes.length + 1), toUnsignedLEB128(count), bytes) : [];
        return results;
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
