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
var _a = require('perf_hooks'), PerformanceObserver = _a.PerformanceObserver, performance = _a.performance;
var lexer_1 = require("./lexer");
var context_parser_1 = require("./context-parser");
var fs = __importStar(require("fs"));
var context_emitter_1 = require("./context-emitter");
var util_1 = require("util");
var module = 'sample3';
fs.readFile(__dirname + ("/" + module + ".t"), 'utf8', function (err, data) {
    var startTime = performance.now();
    var lexer = new lexer_1.Lexer();
    var tokenized = lexer.tokenize(data);
    var tokenizedTime = performance.now();
    // var parser = new Parser();    
    // var astModule = parser.parseModule(module, tokenized);
    // var emmitter = new Emitter();
    // var bytes2 = emmitter.getBytes(astModule);
    // console.log(JSON.stringify(astModule, undefined, "  "));
    var contextParser = new context_parser_1.ContextParser();
    var expressions = [];
    var context = Object.create(context_parser_1.BaseContext);
    var preParseTime = performance.now();
    var remainingWords = contextParser.parse(context, tokenized, expressions);
    var postParseTime = performance.now();
    // console.log(JSON.stringify(expressions, undefined, "  "));
    var contextEmitter = new context_emitter_1.ContextEmitter();
    var preEmitTime = performance.now();
    var contextBytes = contextEmitter.getBytes(expressions);
    var postEmitTime = performance.now();
    // console.log(JSON.stringify(contextBytes));
    // console.log(expressions);
    // console.log(JSON.stringify(expressions, undefined, "  "));    
    var preFileTime = performance.now();
    fs.writeFileSync('output.wasm', contextBytes);
    var postFileTime = performance.now();
    var preInitWasmTime = performance.now();
    var memory = new WebAssembly.Memory({ initial: 10 });
    runWasmWithCallback(contextBytes, {
        console: console,
        function: {
            log: console.log,
            stringLog: function (startAddress, length) {
                console.log({ startAddress: startAddress, length: length });
                var bytes = new Uint8Array(memory.buffer, startAddress, length);
                var string = new util_1.TextDecoder('utf8').decode(bytes);
                console.log(string);
            }
        },
        js: {
            memory: memory
        }
    }, function (item) {
        var postInitWasmTime = performance.now();
        // console.log((<any>item.instance.exports));
        var exports = item.instance.exports;
        console.log(' ');
        var i32 = new Uint32Array(memory.buffer);
        i32[0] = 0x21;
        // Running each exported fn. No parameters in test
        for (var e in exports) {
            var preFnRunTime = performance.now();
            console.log(e + ": " + (exports[e]()));
            var postFnRunTime = performance.now();
            console.log(e + " run time: " + (postFnRunTime - preFnRunTime).toFixed(2) + " ms");
            // var pre2ndFnRunTime = performance.now();
            // console.log(e + ": " + (exports[e]()));
            // var post2ndFnRunTime = performance.now();
            // console.log(`${e} 2nd run time: ${post2ndFnRunTime - pre2ndFnRunTime}`)
        }
        var finalTime = performance.now();
        console.log(' ');
        console.log("File write time: " + (postFileTime - preFileTime).toFixed(2) + " ms");
        console.log("Tokenize time: " + (tokenizedTime - startTime).toFixed(2) + " ms");
        console.log("Parse time: " + (postParseTime - preParseTime).toFixed(2) + " ms");
        console.log("Emit time: " + (postEmitTime - preEmitTime).toFixed(2) + " ms");
        console.log("Wasm init time: " + (postInitWasmTime - preInitWasmTime).toFixed(2) + " ms");
        console.log("Full run time: " + (finalTime - startTime).toFixed(2) + " ms");
    });
});
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
