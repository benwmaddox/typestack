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
var extractResults = function (tokens) {
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
    var additionalParameters = tokens.slice(fnIndex + 2, functionEqualIndex);
    var results = [];
    for (var i = 0; i < additionalParameters.length; i++) {
        var item = additionalParameters[i];
        if (item.indexOf(':') == -1) {
            results.push(item);
        }
    }
    return results;
};
exports.BaseContext = {
    'export': {
        parse: function (context, words, expressions) {
            expressions.push({ desc: "export" });
            return { context: context, words: words, expressions: expressions };
        }
    },
    'import': {
        parse: function (context, words, expressions) {
            expressions.push({ desc: "import" });
            return { context: context, words: words, expressions: expressions };
        }
    },
    'use': {
        parse: function (context, words, expressions) {
            expressions.push({ desc: "use" });
            return { context: context, words: words, expressions: expressions };
        }
    },
    'fn': {
        parse: function (context, words, expressions) {
            var parameters = extractParameters(words);
            var fnIndex = words.indexOf("fn");
            var functionName = words[fnIndex + 1];
            if (functionName[0] == "'") {
                functionName = functionName.substring(1, functionName.length - 1);
            }
            var newContext = Object.create(context);
            for (var i = 0; i < parameters.length; i++) {
                newContext[parameters[i].name] = {
                    types: [
                        {
                            input: undefined,
                            output: [parameters[i].type],
                            opCodes: [
                                wasm_structure_1.Opcodes.get_local,
                                i
                            ]
                        }
                    ]
                };
            }
            var contextItem = {
                types: [
                    {
                        input: parameters.map(function (x) { return x.type; }),
                        parameters: parameters.map(function (x) { return x.name; }),
                        output: extractResults(words),
                        opCodes: 
                        // flatten opcodes
                        Array.prototype.concat.apply([], parameters.map(function (x, i) {
                            return [wasm_structure_1.Opcodes.get_local, i];
                        }))
                    }
                ],
                functionReference: {
                    name: functionName,
                    typeID: undefined,
                    functionID: undefined,
                    exportID: undefined
                }
            };
            context[functionName] = contextItem;
            // interpolated: 
            if (functionName.indexOf('{') != -1) {
                var interpolated = functionName.replace(/{(.+?)}/g, '{}').split(' ');
                var partContext = context;
                for (var i = 0; i < interpolated.length - 1; i++) {
                    var part = interpolated[i];
                    if (partContext[part] === undefined) {
                        partContext[part] = {};
                        partContext = partContext[part];
                    }
                }
                partContext[interpolated[interpolated.length - 1]] = contextItem;
                // console.log(functionNameInterpolated)
            }
            var functionEqualIndex = words.indexOf("=");
            expressions.push({
                desc: "Adding function: " + functionName,
                function: contextItem
            });
            return { context: newContext, words: words.slice(functionEqualIndex), expressions: expressions };
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
            // If context is a function
            expressions.push({
                op: wasm_structure_1.Opcodes.end,
                desc: 'End function ' //+ context.functionReference?.name
            });
            // TODO: if context is.. a variable
            return { context: Object.getPrototypeOf(context), words: words, expressions: expressions };
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
        if (nextWord.startsWith("\"")) {
            // console.log(nextWord)
            // TODO string variable...
        }
        else {
            // Lookup through context
            var wordWithoutQuotes = nextWord[0] == "'" ? nextWord.substring(1, nextWord.length - 1) : nextWord;
            var match = context[wordWithoutQuotes];
            if (!match && nextWord[0] == "'") {
                // try by interpolation if in single quotes
                // Split up inner words
                // allow multiple statement matches
                // match on either word or {}
                var interpolated = wordWithoutQuotes.replace(/{(.+?)}/g, '{}').split(' ');
                var innerExpresions = [];
                var innerWords = [[]];
                // this.parse(context, )
            }
            if (match) {
                if (match.newContext === true) {
                    expressions.push({ desc: "New context level " });
                    // console.log('    Adding context level')
                    context = Object.create(context);
                }
                if (match.functionReference !== undefined) {
                    var reference = match.functionReference;
                    expressions.push({
                        op: wasm_structure_1.Opcodes.call,
                        desc: "call: " + wordWithoutQuotes,
                        reference: reference
                    });
                    // TODO: interpolation variables
                    expressions.push({
                        op: function () { return reference.functionID; },
                        desc: "Function ID"
                    });
                }
                // console.log(nextWord);
                if (match.types && match.functionReference == undefined) {
                    // TODO: find actual matching type                
                    var matchedType = match.types[0];
                    if (matchedType.opCodes) {
                        for (var i = 0; i < matchedType.opCodes.length; i++) {
                            expressions.push({
                                op: matchedType.opCodes[i],
                                desc: wordWithoutQuotes
                            });
                        }
                    }
                }
                else if (match.parse) {
                    var parseResults = match.parse(context, words, expressions);
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
                    // expressions.push({ desc: "Removed context level " });
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
                else {
                    console.log('Could not parse ' + nextWord);
                }
                // TODO: other numbers
                // TODO: other constants / types? 
            }
        }
        return this.parse(context, words.slice(1), expressions);
    };
    return ContextParser;
}());
exports.ContextParser = ContextParser;
