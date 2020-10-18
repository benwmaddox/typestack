"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var wasm_structure_1 = require("./wasm-structure");
var lexer_1 = require("./lexer");
var fs = __importStar(require("fs"));
// var fs = require('fs');
fs.readFile(__dirname + '/sample3.t', 'utf8', function (err, data) {
    // console.log('loaded')
    // console.log(data)
    // console.log(__dirname)
    // wasmStructure.addEmitImport();
    // wasmStructure.addImport("function", "log", "emit", [WasmType.i32], null);
    // wasmStructure.addFunctionType([WasmType.f32, WasmType.f32], WasmType.f32);
    // wasmStructure.addFunction();
    // testAddTwo();
    var lexer = new lexer_1.Lexer();
    var tokenized = lexer.tokenize(data);
    console.log(tokenized);
    var bytes = runIntoWasm(tokenized);
    fs.writeFileSync('output.wasm', bytes);
    runWasmWithCallback(bytes, {
        console: console,
        function: {
            log: console.log
        }
    }, function (item) {
        console.log(item.instance.exports);
        item.instance.exports['add two {i:int}'](1);
    });
});
function buildParameterList(input) {
    var index = 0;
    var regex = new RegExp('{(.+?):(.+?)}');
    var regexResult = regex.exec(input.substr(index));
    var result = [];
    while (regexResult !== null) {
        result.push({
            parameter: regexResult[1],
            type: regexResult[2]
        });
        index += regexResult.index + regexResult[0].length;
        regexResult = regex.exec(input.substr(index));
    }
    return result;
}
function runIntoWasm(tokens) {
    var wasmStructure = new wasm_structure_1.WasmStructure();
    var index = 0;
    var definingFunction = false;
    while (index < tokens.length) {
        var token = tokens[index];
        if (token == "fn") {
            definingFunction = true;
            var functionEqualIndex = tokens.indexOf("=", index);
            var functionEndIndex = tokens.indexOf(";", functionEqualIndex);
            if (functionEndIndex < 0) {
                throw 'No ; ending for ' + tokens[index + 1];
            }
            var definition = {
                name: tokens[index + 1].substring(1, tokens[index + 1].length - 1),
                types: tokens.slice(index + 2, functionEqualIndex),
                bodyText: tokens.slice(functionEqualIndex + 1, functionEndIndex)
            };
            // console.log(regex.exec(definition.name));
            // console.log(regex.exec("fn print {i:int} {y:float} {x:blahblah}"));
            // var parameters = definition.name
            var parameters = buildParameterList(definition.name);
            console.log(parameters);
            // var emitId = wasmStructure.addImport("console", "log", "emit",
            //     [WasmType.i32],
            //     null
            // )
            // wasmStructure.addEmitImport();
            console.log(definition);
            var parameterOps = parameters.map(function (x) { return x.type == "int" ? wasm_structure_1.WasmType.i32 : wasm_structure_1.WasmType.f64; });
            var bodyOps = [
                wasm_structure_1.Opcodes.i32Const, 2,
                wasm_structure_1.Opcodes.get_local, 0,
                wasm_structure_1.Opcodes.i32Add
            ];
            console.log(parameterOps);
            console.log(bodyOps);
            var exportIds = wasmStructure.AddExportFunction(definition.name, parameterOps, wasm_structure_1.WasmType.i32, // TODO
            bodyOps);
            //functionDefinitions.push(definition);
            //checkForUndefinedWords(definition.bodyText);            
            // runWords(definition.bodyText);
            index = functionEndIndex;
        }
        else if (token == ";") {
            definingFunction = false;
        }
        else {
            //runWords([tokens[index]])
        }
        index++;
    }
    return wasmStructure.getBytes();
}
function testAddTwo() {
    var wasmStructure = new wasm_structure_1.WasmStructure();
    wasmStructure.AddExportFunction("add Two", [wasm_structure_1.WasmType.i32, wasm_structure_1.WasmType.i32], wasm_structure_1.WasmType.i32, [
        wasm_structure_1.Opcodes.get_local, 0,
        wasm_structure_1.Opcodes.get_local, 1,
        wasm_structure_1.Opcodes.i32Add
    ]);
    var bytes = wasmStructure.getBytes();
    console.log("\n" + bytes.length + " bytes");
    console.log("Bytes: \n" + bytes.join(", ") + "\n");
    // console.log(bytes);
    // var writeCallback = (err: string) => console.log(err);
    fs.writeFileSync('output.wasm', bytes);
    runWasm(bytes);
}
function runWasmWithCallback(bytes, importObject, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var instance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, WebAssembly.instantiate(bytes, importObject).then(callback)];
                case 1:
                    instance = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function runWasm(bytes) {
    return __awaiter(this, void 0, void 0, function () {
        var importObject, instance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    importObject = {
                        function: {
                            log: function (value) {
                                console.log(value);
                            }
                        }
                    };
                    return [4 /*yield*/, WebAssembly.instantiate(bytes, importObject).then(function (results) {
                            console.log(results);
                            console.log(results.instance.exports);
                            var exports = results.instance.exports;
                            console.log(exports['add Two'](3, 5));
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
