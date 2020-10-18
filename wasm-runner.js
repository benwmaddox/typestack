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
var fs = __importStar(require("fs"));
function byteDifferences(a, b) {
}
// Test - Add Two
// {
//     var wasmStructure = new WasmStructure();
//     wasmStructure.AddExportFunction("addTwo", [WasmType.i32, WasmType.i32], WasmType.i32, [
//         0, // Declcount
//         Opcodes.get_local, 0,
//         Opcodes.get_local, 1,
//         Opcodes.i32Add,
//         Opcodes.end
//     ]);
//     // Expected bytes as geneted by tool
//     var expectedBytes = [0x00, 0x61, 0x73, 0x6D, 0x01, 0x00, 0x00, 0x00, 0x01, 0x07, 0x01, 0x60, 0x02, 0x7F, 0x7F, 0x01,
//         0x7F, 0x03, 0x02, 0x01, 0x00, 0x07, 0x0A, 0x01, 0x06, 0x61, 0x64, 0x64, 0x54, 0x77, 0x6F, 0x00,
//         0x00, 0x0A, 0x09, 0x01, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6A, 0x0B, 0x00, 0x0E, 0x04, 0x6E,
//         0x61, 0x6D, 0x65, 0x02, 0x07, 0x01, 0x00, 0x02, 0x00, 0x00, 0x01, 0x00];
//     var actual = wasmStructure.getBytes();//.map((item, index) => item.toString().padStart(3, ' '));
//     // var expectedBytes = expectedString.map((item, index) =>  )
//     var minSize = expectedBytes.length < actual.byteLength ? expectedBytes.length : actual.byteLength;
//     var differences = [];
//     for (var i = 0; i < minSize; i++) {
//         differences.push(expectedBytes[i] == actual[i] ? " " : "^");
//     }
//     console.log(expectedBytes.join(', ') + '\n');
//     console.log(actual.join(', ') + '\n');
//     console.log(differences.join(', '));
// }
// var fs = require('fs');
fs.readFile(__dirname + '/sample2.t', 'utf8', function (err, data) {
    // console.log('loaded')
    // console.log(data)
    // console.log(__dirname)
    var wasmStructure = new wasm_structure_1.WasmStructure();
    // wasmStructure.addEmitImport();
    // wasmStructure.addImport("function", "log", "emit", [WasmType.i32], null);
    // wasmStructure.addFunctionType([WasmType.f32, WasmType.f32], WasmType.f32);
    // wasmStructure.addFunction();
    wasmStructure.AddExportFunction("add Two", [wasm_structure_1.WasmType.i32, wasm_structure_1.WasmType.i32], wasm_structure_1.WasmType.i32, [
        0,
        wasm_structure_1.Opcodes.get_local, 0,
        wasm_structure_1.Opcodes.get_local, 1,
        wasm_structure_1.Opcodes.i32Add,
        wasm_structure_1.Opcodes.end
    ]);
    var bytes = wasmStructure.getBytes();
    console.log("\n" + bytes.length + " bytes");
    console.log("Bytes: \n" + bytes.join(", ") + "\n");
    // console.log(bytes);
    // var writeCallback = (err: string) => console.log(err);
    fs.writeFileSync('output.wasm', bytes);
    runWasm(bytes);
});
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
