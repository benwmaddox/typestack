"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextParser = exports.BaseContext = void 0;
var wasm_structure_1 = require("./wasm-structure");
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
var extractParameters = function (tokens) {
    var index = 0;
    var fnIndex = tokens.indexOf("fn", index);
    var functionEqualIndex = tokens.indexOf("=", index);
    if (functionEqualIndex < 0) {
        throw new Error('No = for function ' + tokens[index + 1]);
    }
    var functionEndIndex = tokens.indexOf(";", functionEqualIndex);
    if (functionEndIndex < 0) {
        throw new Error('No ; ending for ' + tokens[index + 1]);
    }
    var parameters = buildParameterList(tokens[fnIndex + 1].substring(1, tokens[fnIndex + 1].length - 1));
    var additionalParameters = tokens.slice(fnIndex + 2, functionEqualIndex - 1);
    for (var i = 0; i < additionalParameters.length; i++) {
        var item = additionalParameters[i];
        if (item.indexOf(':') != -1) {
            parameters.push({
                name: item.split(":")[0],
                type: item.split(":")[1]
            });
        }
    }
    return parameters;
};
exports.BaseContext = {
    'export': {
        parse: function (context, words, expressions) {
            return { context: context, words: words, expressions: expressions };
        }
    },
    'import': {
        parse: function (context, words, expressions) {
            return { context: context, words: words, expressions: expressions };
        }
    },
    'use': {
        parse: function (context, words, expressions) {
            return { context: context, words: words, expressions: expressions };
        }
    },
    'fn': {
        //newContext: true,
        parse: function (context, words, expressions) {
            var parameters = extractParameters(words);
            // console.log("---extracting parameters")
            // console.log(parameters);
            // console.log("---new context")
            var newContext = context; //<ContextDictionary>Object.create(context);
            var functionName = words[0];
            var contextItem = {
                types: [
                    {
                        input: [],
                        output: [],
                    }
                    // TODO: define reference that can be modified and used elsewhere?
                ]
            };
            expressions.push({ desc: "Defining: " + functionName });
            newContext[functionName] = contextItem;
            var functionEqualIndex = words.indexOf("=");
            var functionEndIndex = words.indexOf(";", functionEqualIndex);
            console.log('starting words');
            console.log(words);
            console.log('after fn parse');
            console.log(words.slice(functionEndIndex));
            return { context: newContext, words: words.slice(functionEndIndex), expressions: expressions };
        }
    },
    'var': {
        newContext: true,
        parse: function (context, words, expressions) {
            return { context: context, words: words, expressions: expressions };
        }
    },
    ';': {
        popContext: true,
        parse: function (context, words, expressions) {
            return { context: context, words: words, expressions: expressions };
        }
    },
    '+': {
        types: [
            { input: ['int', 'int'], output: ['int'], opCodes: [wasm_structure_1.Opcodes.i32add] },
            { input: ['long', 'long'], output: ['long'], opCodes: [wasm_structure_1.Opcodes.i64add] },
            { input: ['float', 'float'], output: ['float'], opCodes: [wasm_structure_1.Opcodes.f32add] },
            { input: ['double', 'double'], output: ['double'], opCodes: [wasm_structure_1.Opcodes.f64add] },
        ]
    },
    '*': { types: [{ input: ['int', 'int'], output: ['int'], opCodes: [wasm_structure_1.Opcodes.i32mul] }] },
    '-': { types: [{ input: ['int', 'int'], output: ['int'], opCodes: [wasm_structure_1.Opcodes.i32sub] }] },
    '<': { types: [{ input: ['int', 'int'], output: ['int'], opCodes: [wasm_structure_1.Opcodes.i32lt_s] }] },
    '==': { types: [{ input: ['int', 'int'], output: ['bool'], opCodes: [wasm_structure_1.Opcodes.i32eq] }] },
    '==0': { types: [{ input: ['int'], output: ['bool'], opCodes: [wasm_structure_1.Opcodes.i32eqz] }] },
    '&&': { types: [{ input: ['int', 'int'], output: ['bool'], opCodes: [wasm_structure_1.Opcodes.i32and] }] },
};
var ContextParser = /** @class */ (function () {
    function ContextParser() {
    }
    ContextParser.prototype.parse = function (context, words, expressions) {
        if (words.length == 0) {
            return words;
        }
        var nextWord = words[0];
        if (nextWord.startsWith("'")) {
            // console.log(nextWord)
            expressions.push({
                op: wasm_structure_1.Opcodes.call,
                desc: "call: " + nextWord,
                reference: {}
                // TODO: connect reference to something that will have IDs later
                // TODO: interpolation
            });
        }
        else if (nextWord.startsWith("\"")) {
            // console.log(nextWord)
            // TODO string variable...
        }
        else {
            // Lookup through context
            if (context[nextWord]) {
                var match = context[nextWord];
                if (match.newContext === true) {
                    expressions.push({ desc: "New context level " });
                    // console.log('    Adding context level')
                    context = Object.create(context);
                }
                // console.log(nextWord);
                if (match.types) {
                    // TODO: find actual matching type                
                    var matchedType = match.types[0];
                    if (matchedType.opCodes) {
                        for (var i = 0; i < matchedType.opCodes.length; i++) {
                            expressions.push({
                                op: matchedType.opCodes[i],
                                desc: nextWord
                            });
                        }
                    }
                }
                else if (match.parse) {
                    var parseResults = match.parse(context, words.slice(1), expressions);
                    // console.log(parseResults);
                    context = parseResults.context;
                    words = parseResults.words;
                    expressions = parseResults.expressions;
                }
                else {
                    // TODO compile error, couldn't match type. Give context, etc
                    expressions.push({ desc: "Did not understand: " + nextWord });
                }
                if (match.popContext === true) {
                    expressions.push({ desc: "Removed context level " });
                    // console.log('    Removing context level')
                    // context = Object.getPrototypeOf(context);
                }
            }
            else {
                var parsedInt = parseInt(nextWord);
                if (!isNaN(parsedInt)) {
                    expressions.push({ op: wasm_structure_1.Opcodes.i32Const, desc: "i32 const" });
                    expressions.push({ op: parseInt(nextWord), desc: nextWord });
                }
                // number? 
                // console.log(nextWord);
            }
        }
        return this.parse(context, words.slice(1), expressions);
    };
    return ContextParser;
}());
exports.ContextParser = ContextParser;
