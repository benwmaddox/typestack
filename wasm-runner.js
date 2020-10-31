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
var context_parser_1 = require("./context-parser");
var fs = __importStar(require("fs"));
var module = 'sample3';
fs.readFile(__dirname + ("/" + module + ".t"), 'utf8', function (err, data) {
    var lexer = new lexer_1.Lexer();
    var tokenized = lexer.tokenize(data);
    // var parser = new Parser();    
    // var astModule = parser.parseModule(module, tokenized);
    // var emmitter = new Emitter();
    // var bytes2 = emmitter.getBytes(astModule);
    // console.log(JSON.stringify(astModule, undefined, "  "));
    var contextParser = new context_parser_1.ContextParser();
    var expressions = [];
    var context = Object.create(context_parser_1.BaseContext);
    var remainingWords = contextParser.parse(context, tokenized, expressions);
    console.log(expressions);
    console.log(context);
    console.log(Object.getPrototypeOf(context));
    var bytes = runIntoWasm(tokenized);
    fs.writeFileSync('output.wasm', bytes);
    // runWasmWithCallback(bytes2, {
    //     console: console,
    //     function: {
    //         log: console.log
    //     }
    // }, (item) => {
    //     console.log((<any>item.instance.exports));
    //     // console.log((<any>item.instance.exports)['test']());
    // });
    // runWasmWithCallback(bytes, {
    //     console: console,
    //     function: {
    //         log: console.log
    //     }
    // }, (item) => {
    //     console.log((<any>item.instance.exports));
    //     // var result = (<any>item.instance.exports)['add two {i:int}'](1);
    //     // console.log((<any>item.instance.exports)['add two'](3));
    //     // console.log((<any>item.instance.exports)['double'](9));
    //     console.log((<any>item.instance.exports)['test']());
    //     // console.log((<any>item.instance.exports)['add one twice'](3));
    //     // console.log((<any>item.instance.exports)['add'](91, 9));
    //     // console.log((<any>item.instance.exports)['subtract'](10, 3));
    //     // console.log((<any>item.instance.exports)['less than'](1, 3));
    // });
});
function buildParameterList(input) {
    var index = 0;
    var regex = new RegExp('{(.+?):(.+?)}');
    var regexResult = regex.exec(input.substr(index));
    var result = [];
    while (regexResult !== null) {
        result.push({
            name: regexResult[1],
            type: regexResult[2]
        });
        index += regexResult.index + regexResult[0].length;
        regexResult = regex.exec(input.substr(index));
    }
    return result;
}
var dictionary = [];
function builtInWords() {
    var results = [];
    results.push({ name: '+', OpsCodes: [wasm_structure_1.Opcodes.i32add] });
    results.push({ name: '*', OpsCodes: [wasm_structure_1.Opcodes.i32mul] });
    results.push({ name: '-', OpsCodes: [wasm_structure_1.Opcodes.i32sub] });
    results.push({ name: '<', OpsCodes: [wasm_structure_1.Opcodes.i32lt_s] });
    results.push({ name: '==', OpsCodes: [wasm_structure_1.Opcodes.i32eq] });
    results.push({ name: '==0', OpsCodes: [wasm_structure_1.Opcodes.i32eqz] });
    results.push({ name: '&&', OpsCodes: [wasm_structure_1.Opcodes.i32and] });
    return results;
}
function runIntoWasm(tokens) {
    dictionary = builtInWords();
    var wasmStructure = new wasm_structure_1.WasmStructure();
    var index = 0;
    var definingFunction = false;
    while (index < tokens.length) {
        var token = tokens[index];
        if (token == "fn") {
            definingFunction = true;
            var functionEqualIndex = tokens.indexOf("=", index);
            if (functionEqualIndex < 0) {
                throw 'No = for function ' + tokens[index + 1];
            }
            var functionEndIndex = tokens.indexOf(";", functionEqualIndex);
            if (functionEndIndex < 0) {
                throw 'No ; ending for ' + tokens[index + 1];
            }
            var definition = {
                name: tokens[index + 1][0] == "'"
                    ? tokens[index + 1].substring(1, tokens[index + 1].length - 1)
                    : tokens[index + 1],
                // parameters: tokens.slice(index + 2, functionEqualIndex),
                parameters: buildParameterList(tokens[index + 1].substring(1, tokens[index + 1].length - 1)),
                body: tokens.slice(functionEqualIndex + 1, functionEndIndex),
                result: { name: null, type: tokens[functionEqualIndex - 1] }
            };
            var additionalParameters = tokens.slice(index + 2, functionEqualIndex - 1);
            for (var i = 0; i < additionalParameters.length; i++) {
                var item = additionalParameters[i];
                if (item.indexOf(':') != -1) {
                    definition.parameters.push({
                        name: item.split(":")[0],
                        type: item.split(":")[1]
                    });
                }
            }
            // console.log(definition);
            var parameterOps = definition.parameters.map(function (x) { return x.type == "int" ? wasm_structure_1.WasmType.i32 : wasm_structure_1.WasmType.f64; });
            var bodyOps = bodyTokensToOps(definition);
            // console.log(bodyOps);
            if (index > 0 && tokens[index - 1] == "export") {
                var exportIds = wasmStructure.AddExportFunction(definition.name, parameterOps, wasm_structure_1.WasmType.i32, // TODO
                bodyOps);
                dictionary.push({
                    name: definition.name,
                    IDs: exportIds
                });
            }
            else {
                var functionIds = wasmStructure.AddFunctionDetails(parameterOps, wasm_structure_1.WasmType.i32, // TODO
                bodyOps);
                dictionary.push({
                    name: definition.name,
                    IDs: functionIds
                });
            }
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
function isInOrder(values) {
    for (var i = 1; i < values.length; i++) {
        if (values[i - 1] >= values[i])
            return false;
    }
    return true;
}
function findInterpolatedMatches(token) {
    var matchingFunctions = [];
    var tokenSplit = token.substring(1, token.length - 1).split(" ");
    var interpolatedOptions = dictionary.filter(function (x) { return x.name.indexOf("{") != -1; });
    for (var i = 0; i < interpolatedOptions.length; i++) {
        var wordWithoutQuotes = interpolatedOptions[i].name; //.substring(1, interpolatedOptions[i].name.length - 1);
        var wordSplit = wordWithoutQuotes.split(" ").filter(function (x) { return x[0] != "{"; });
        // if (wordSplit.length < tokenSplit.length) continue;
        // console.log(wordSplit);
        // console.log(tokenSplit);
        var locationInToken = wordSplit.map(function (x) { return tokenSplit.indexOf(x); });
        if (locationInToken.every(function (x) { return x != -1; })
            && isInOrder(locationInToken)) {
            matchingFunctions.push(interpolatedOptions[i]);
            // console.log("found interpolated ")
        }
    }
    return matchingFunctions;
}
function bodyTokensToOps(definition) {
    var tokens = definition.body;
    var parameters = definition.parameters;
    var result = [];
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        var matchingFunctions;
        if (token[0] == "'") {
            matchingFunctions = dictionary.filter(function (x) { return "'" + x.name + "'" == token; });
            if (matchingFunctions.length == 0) {
                // console.log('looking for ' + token);
                matchingFunctions = findInterpolatedMatches(token);
                // TODO : calculate parameters to use / Maybe recursion here?
                // interpolated...
                // var interpolatedMatchingFunction = token[0] == "'"
                //     ? dictionary.filter(x => "'" + x.name + "'" == token)
                //     : dictionary.filter(x => x.name == token);
            }
        }
        else {
            matchingFunctions = dictionary.filter(function (x) { return x.name == token; });
        }
        if (matchingFunctions.length != 0) {
            var lastFunction = matchingFunctions[matchingFunctions.length - 1];
            if (lastFunction.IDs != null) {
                result.push(wasm_structure_1.Opcodes.call);
                result.push(lastFunction.IDs.functionId); // Last matching function
            }
            else if (lastFunction.OpsCodes != null) {
                for (var j = 0; j < lastFunction.OpsCodes.length; j++) {
                    result.push(lastFunction.OpsCodes[j]);
                }
            }
            else {
                throw 'Function missing ID or opscodes for ' + token;
            }
            continue;
        }
        var parsedInt = parseInt(token);
        if (!isNaN(parsedInt)) {
            result.push(wasm_structure_1.Opcodes.i32Const);
            result.push(parsedInt);
            continue;
        }
        var matchingParameters = parameters.filter(function (x) { return x.name == token; });
        if (matchingParameters.length != 0) {
            var lastParam = matchingParameters[matchingParameters.length - 1];
            var paramIndex = parameters.indexOf(lastParam);
            result.push(wasm_structure_1.Opcodes.get_local);
            result.push(paramIndex);
            continue;
        }
        throw 'Could not find match for ' + token;
    }
    return result;
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
