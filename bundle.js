var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
define("wasm-runner", ["require", "exports", "fs"], function (require, exports, fs) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    fs = __importStar(fs);
    // var fs = require('fs');
    fs.readFile(__dirname + '/sample2.t', 'utf8', function (err, data) {
        // console.log('loaded')
        // console.log(data)
        // console.log(__dirname)
        // var bytes = wasmStructure.compile(data);
        // console.log(bytes);
        // runWasm(bytes);
    });
    var dataStack = [];
    var functionStack = [];
    var functionDefinitions = [];
    function runWasm(bytes) {
        return __awaiter(this, void 0, void 0, function () {
            var importObject, instance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        importObject = {
                            function: {
                                emit: function (value) {
                                    console.log(value);
                                }
                            }
                        };
                        return [4 /*yield*/, WebAssembly.instantiate(bytes, importObject).then(function (results) {
                                console.log(results);
                                console.log(results.instance.exports);
                            })
                            // console.log(instance.exports.run());
                            // instance.
                        ];
                    case 1:
                        instance = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
});
define("wasm-structure", ["require", "exports"], function (require, exports) {
    "use strict";
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
});
