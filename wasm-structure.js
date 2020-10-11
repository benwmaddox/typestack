"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasmStructure = void 0;
var WasmStructure = /** @class */ (function () {
    function WasmStructure() {
        this.typeId = 0;
        this.wasmHeader = [0x00, 0x61, 0x73, 0x6d];
        this.wasmVersion = [0x01, 0x00, 0x00, 0x00];
        this.opcodes = {
            call: 0x10,
            get_local: 0x20,
            const: 0x43,
            end: 0x0b
        };
        this.section = {
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
        this.valueType = {
            i32: 0x7F,
            i64: 0x7E,
            f32: 0x7D,
            f64: 0x7C
        };
    }
    WasmStructure.prototype.encodeRunType = function () {
        var numberOfParameters = 1; // any number
        var nubmerOfResults = 0; // 0 or 1?
        return [
            this.typeId++,
            numberOfParameters,
            nubmerOfResults
        ];
    };
    WasmStructure.prototype.tokenize = function (text) {
        var tokens = [];
        var currentToken = "";
        var withinSingleQuote = false;
        var withinDoubleQuote = false;
        var withinComment = false;
        for (var i = 0; i < text.length; i++) {
            if (text[i] == "'") {
                currentToken += text[i];
                withinSingleQuote = !withinSingleQuote;
            }
            else if (text[i] == "\"") {
                currentToken += text[i];
                withinDoubleQuote = !withinDoubleQuote;
            }
            else if (text[i] == "/" && text.length > i + 1 && text[i + 1] == "/") {
                withinComment = true;
            }
            else if (withinComment && text[i] == "\n") {
                withinComment = false;
            }
            else if ((text[i] == " " || text[i] == "\n" || text[i] == "\n" || text[i] == "\r")
                && !withinSingleQuote && !withinDoubleQuote) {
                if (currentToken != "") {
                    tokens.push(currentToken);
                    currentToken = "";
                }
            }
            else if (!withinComment) {
                currentToken += text[i];
            }
        }
        if (currentToken != "") {
            tokens.push(currentToken);
        }
        return tokens;
    };
    WasmStructure.prototype.compile = function (text) {
        var tokens = this.tokenize(text);
        console.log(tokens);
        var runType = this.encodeRunType();
        var types = __spreadArrays([
            // run signature
            this.section.type,
            0,
            1
        ], runType);
        types.push(types.length); // Add type FIXUP
        var importBytes = [
            0x08,
            0x66, 0x75, 0x6e, 0x63, 0x74, 0x69, 0x6f, 0x6e,
            0x04,
            0x65, 0x6d, 0x6974,
            0x00,
            0x00,
            0x11 // ; FIXUP section size
        ];
        var imports = __spreadArrays([
            this.section.import,
            0,
            1,
            importBytes.length
        ], importBytes);
        var functionBytes = [
        // run 
        ];
        var functions = __spreadArrays([
            this.section.function,
            functionBytes.length
        ], functionBytes);
        var codeDefinitions = [];
        var runIndex = 1; // find index of run function
        var startSection = [
            this.section.start,
            1,
            runIndex
        ];
        return Uint8Array.from(__spreadArrays(this.wasmHeader, this.wasmVersion, imports, functions, codeDefinitions));
    };
    return WasmStructure;
}());
exports.WasmStructure = WasmStructure;
