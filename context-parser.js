"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextParser = exports.BaseContext = void 0;
var wasm_structure_1 = require("./wasm-structure");
function isInOrder(values) {
    for (var i = 1; i < values.length; i++) {
        if (values[i - 1] >= values[i])
            return false;
    }
    return true;
}
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
    // if (functionEqualIndex < 0) {
    // throw new Error('No = for function ' + tokens[index + 1]);
    // }
    var functionEndIndex = tokens.indexOf(";", functionEqualIndex != -1 ? functionEqualIndex : fnIndex);
    if (functionEndIndex < 0) {
        throw new Error('No ; ending for ' + tokens[index + 1]);
    }
    var parameters = buildParameterList(tokens[fnIndex + 1].substring(1, tokens[fnIndex + 1].length - 1));
    var additionalParameters = tokens.slice(fnIndex + 2, (functionEqualIndex != -1 ? functionEqualIndex : functionEndIndex) - 1);
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
    var functionEndIndex = tokens.indexOf(";");
    if (functionEndIndex < 0) {
        throw new Error('No ; ending for ' + tokens[index + 1]);
    }
    var functionEqualIndex = tokens.slice(fnIndex, functionEndIndex).indexOf("=", index);
    if (functionEqualIndex < 0) {
        // throw new Error('No = for function ' + tokens[index + 1]);
    }
    var additionalParameters = tokens.slice(fnIndex + 2, (functionEqualIndex || functionEndIndex));
    var results = [];
    for (var i = 0; i < additionalParameters.length; i++) {
        var item = additionalParameters[i];
        if (item.indexOf(':') == -1) {
            results.push(item);
        }
    }
    return results;
};
exports.BaseContext = [
    {
        token: 'export',
        parse: function (context, words, expressions) {
            expressions.push({ desc: "export" });
            return { context: context, words: words, expressions: expressions };
        }
    },
    {
        token: 'import',
        parse: function (context, words, expressions) {
            // TODO
            var functionEndIndex = words.indexOf(";");
            var fnIndex = words.slice(0, functionEndIndex).indexOf("fn");
            expressions.push({ desc: "import" });
            expressions.push({ desc: words[1].substring(1, words[1].length - 1) });
            expressions.push({ desc: words[2].substring(1, words[2].length - 1) });
            return { context: context, words: words.slice(2), expressions: expressions };
        }
    },
    {
        token: 'use',
        parse: function (context, words, expressions) {
            expressions.push({ desc: "use" });
            return { context: context, words: words, expressions: expressions };
        }
    },
    {
        token: 'assert',
        parse: function (context, words, expressions) {
            var functionName = context[context.length - 1].token;
            // if success: emit .
            // if failure: emit Fail {functionName}
            expressions.push({
                op: wasm_structure_1.Opcodes.blockIf,
                desc: "If"
            });
            expressions.push({
                op: 0x7F,
                desc: "i32 Block type"
            });
            // todo: push . to log instructions
            expressions.push({ op: wasm_structure_1.Opcodes.i32Const, desc: "i32 const" });
            var i32Bytes = wasm_structure_1.toSignedLEB128(1);
            for (var i = 0; i < i32Bytes.length; i++) {
                expressions.push({ op: i32Bytes[i], desc: '1' + ' part ' + (i + 1) });
            }
            expressions.push({
                op: wasm_structure_1.Opcodes.else,
                desc: "Else"
            });
            expressions.push({ op: wasm_structure_1.Opcodes.i32Const, desc: "i32 const" });
            var i32Bytes = wasm_structure_1.toSignedLEB128(0);
            for (var i = 0; i < i32Bytes.length; i++) {
                expressions.push({ op: i32Bytes[i], desc: '0' + ' part ' + (i + 1) });
            }
            // todo: push error message to log instructions
            // expressions.push({
            //     op: Opcodes.call,
            //     desc: 'call log'
            // })
            // expressions.push({
            //     op: ,
            //     desc: 'call log'
            // })
            expressions.push({
                op: wasm_structure_1.Opcodes.end,
                desc: "End If"
            });
            return { context: context, words: words, expressions: expressions };
        }
    },
    {
        token: 'op',
        parse: function (context, words, expressions) {
            var opName = words[1];
            if (opName[0] == "'") {
                opName = opName.substring(1, opName.length - 1);
            }
            var equalIndex = words.indexOf("=");
            var endIndex = words.indexOf(";");
            var contextItem = {
                token: opName,
                types: [
                    {
                        opCodes: words.slice(equalIndex + 1, endIndex).map(function (x) { return parseInt(x); }).filter(function (x) { return x !== null; })
                    }
                ],
            };
            context.push(contextItem);
            return { context: context, words: words.slice(endIndex), expressions: expressions };
        }
    },
    {
        token: 'fn',
        parse: function (context, words, expressions) {
            var parameters = extractParameters(words);
            var fnIndex = words.indexOf("fn");
            var functionName = words[fnIndex + 1];
            if (functionName[0] == "'") {
                functionName = functionName.substring(1, functionName.length - 1);
            }
            var newContext = Object.create(context);
            for (var i = 0; i < parameters.length; i++) {
                newContext.push({
                    token: parameters[i].name,
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
                });
            }
            var contextItem = {
                token: functionName,
                interpolationTokens: functionName.indexOf('{') == -1 ? undefined : functionName.replace(/{(.+?)}/g, '{}').split(' '),
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
            context.push(contextItem);
            var functionEndIndex = words.indexOf(";");
            var functionEqualIndex = words.slice(0, functionEndIndex).indexOf("=");
            expressions.push({
                desc: "Function " + functionName,
                function: contextItem
            });
            return { context: newContext, words: words.slice(functionEqualIndex || functionEndIndex), expressions: expressions };
        }
    },
    {
        token: 'var',
        newContext: true,
        parse: function (context, words, expressions) {
            return { context: context, words: words, expressions: expressions };
        }
    },
    {
        token: ';',
        popContext: true,
        parse: function (context, words, expressions) {
            // If context is a function
            // var lastContext = context[context.length - 1];
            // if (lastContext.functionReference !== undefined) {
            expressions.push({
                op: wasm_structure_1.Opcodes.end,
                desc: 'End function' //+ context.functionReference?.name
            });
            // }
            // else { // if (lastContext.token == "?" || lastContext.token == "if") {
            //     expressions.push({
            //         op: Opcodes.end,
            //         desc: 'End ' + lastContext.token
            //     })
            // }
            return { context: Object.getPrototypeOf(context), words: words, expressions: expressions };
        }
    },
    {
        token: '+',
        types: [
            { input: ['int', 'int'], output: ['int'], opCodes: [wasm_structure_1.Opcodes.i32add] },
            { input: ['long', 'long'], output: ['long'], opCodes: [wasm_structure_1.Opcodes.i64add] },
            { input: ['float', 'float'], output: ['float'], opCodes: [wasm_structure_1.Opcodes.f32add] },
            { input: ['double', 'double'], output: ['double'], opCodes: [wasm_structure_1.Opcodes.f64add] }
        ]
    },
    { token: '*', types: [{ input: ['int', 'int'], output: ['int'], opCodes: [wasm_structure_1.Opcodes.i32mul] }] },
    { token: '-', types: [{ input: ['int', 'int'], output: ['int'], opCodes: [wasm_structure_1.Opcodes.i32sub] }] },
    { token: '<', types: [{ input: ['int', 'int'], output: ['int'], opCodes: [wasm_structure_1.Opcodes.i32lt_s] }] },
    { token: '>', types: [{ input: ['int', 'int'], output: ['int'], opCodes: [wasm_structure_1.Opcodes.i32gt_s] }] },
    { token: '>=', types: [{ input: ['int', 'int'], output: ['int'], opCodes: [wasm_structure_1.Opcodes.i32ge_s] }] },
    { token: '==', types: [{ input: ['int', 'int'], output: ['bool'], opCodes: [wasm_structure_1.Opcodes.i32eq] }] },
    { token: '==0', types: [{ input: ['int'], output: ['bool'], opCodes: [wasm_structure_1.Opcodes.i32eqz] }] },
    { token: '&&', types: [{ input: ['int', 'int'], output: ['bool'], opCodes: [wasm_structure_1.Opcodes.i32and] }] },
    { token: 'if', types: [{ input: ['int', 'int'], output: ['bool'], opCodes: [wasm_structure_1.Opcodes.blockIf, 0x7F] }], newContext: true },
    { token: '?', types: [{ input: ['int', 'int'], output: ['bool'], opCodes: [wasm_structure_1.Opcodes.blockIf, 0x7F] }], newContext: true },
    { token: 'else', types: [{ input: ['int', 'int'], output: ['bool'], opCodes: [wasm_structure_1.Opcodes.else] }] },
    { token: ':', types: [{ input: ['int', 'int'], output: ['bool'], opCodes: [wasm_structure_1.Opcodes.else] }] },
    {
        token: 'Store int {value:int} at {offset:int} / {alignment:int}', interpolationTokens: ["Store", "int", '{}', 'at', '{}', '/', '{}'],
        types: [{ input: ['int', 'int', 'int'], output: [], opCodes: [wasm_structure_1.Opcodes.i32Store] }]
    },
    // Should be followed by alignment of 2 then offset. But the values shouldn't be listed as const.
    {
        token: 'Op i32Store',
        parse: function (context, words, expressions) {
            // expressions.push({
            //     op: Opcodes.get_local,
            //     desc: 'param 1'
            // })
            // expressions.push({
            //     op: 0,
            //     desc: 'param 1'
            // })
            // expressions.push({
            //     op: Opcodes.get_local,
            //     desc: 'param 2'
            // })
            // expressions.push({
            //     op: 1,
            //     desc: 'param 2'
            // })
            // expressions.push({
            //     op: Opcodes.i32Store,
            //     desc: 'i32.Store '
            // })
            // If context is a function
            expressions.push({
                op: wasm_structure_1.Opcodes.i32Store,
                desc: 'i32.Store '
            });
            expressions.push({
                op: 0x02,
                desc: 'Alignment'
            });
            expressions.push({
                op: 0x00,
                desc: 'Offset' // need to allow code to add this
            });
            // TODO: if context is.. a variable
            return { context: context, words: words, expressions: expressions };
        } //, types: [{ input: ['int', 'int'], output: [] }    ]
    },
    { token: 'Op i32Store8', types: [{ input: ['int', 'int'], output: [], opCodes: [wasm_structure_1.Opcodes.i32Store8] }] }
    // { token: 'load unsigned byte', types: [{ input: ['int', 'int'], output: ['bool'], opCodes: [Opcodes.i32Load8_u] }] },
];
var ContextParser = /** @class */ (function () {
    function ContextParser() {
    }
    ContextParser.prototype.findInterpolationOptions = function (context, word) {
        // Split up inner words
        // allow multiple statement matches
        // match on either word or {}
        var isInInterpolatedSection = false;
        var matches = [];
        for (var i = context.length - 1; i > 0; i--) {
            if (context[i].interpolationTokens === undefined) {
                continue;
            }
            var interpolated = word.split(' ');
            var interpolatedResultWords = [];
            var j = 0;
            var isMatching = true;
            while (j < context[i].interpolationTokens.length && isMatching) {
                var next = interpolated.splice(0, 1);
                if (next.length === 0) {
                    isMatching = false;
                }
                else if (context[i].interpolationTokens[j] == "{}") {
                    interpolatedResultWords.push(next[0]);
                    isInInterpolatedSection = true;
                    j++;
                }
                else if (context[i].interpolationTokens[j] == next[0]) {
                    isInInterpolatedSection = false;
                    j++;
                }
                else if (isInInterpolatedSection) {
                    interpolatedResultWords.push(next[0]);
                }
                else {
                    isMatching = false;
                }
                // j++;
            }
            if (j < context[i].interpolationTokens.length) {
                isMatching = false;
            }
            if (isMatching) {
                matches.push([context[i], interpolatedResultWords]);
            }
            else {
                // console.log('No match from ' + word + ' to ' + context[i].token)
            }
        }
        return matches;
    };
    ContextParser.prototype.parse = function (context, words, expressions) {
        if (words.length == 0) {
            return words;
        }
        var nextWord = words[0];
        if (nextWord.startsWith("\"")) {
            // TODO string variable...
            var closingQuoteIndex = words.slice(1).indexOf("\"");
            // var string = new TextEncoder('utf8') TextDecoder().decode(bytes);
        }
        else {
            // Lookup through context
            var wordWithoutQuotes = nextWord[0] == "'" ? nextWord.substring(1, nextWord.length - 1) : nextWord;
            //TODO: find last match:
            var match = context.find(function (item) { return item.token == wordWithoutQuotes; }); // context[wordWithoutQuotes];
            if (match == undefined && nextWord[0] == "'") {
                // try by interpolation if in single quotes
                var interpolationOptions = this.findInterpolationOptions(context, wordWithoutQuotes);
                if (interpolationOptions.length == 1) {
                    match = interpolationOptions[0][0];
                    var innerWords = interpolationOptions[0][1];
                    var innerExpresions = [];
                    this.parse(context, innerWords, innerExpresions);
                    expressions.push.apply(expressions, innerExpresions);
                }
                else if (interpolationOptions.length > 1) {
                    throw Error("Too many possible matches for: " + wordWithoutQuotes
                        + JSON.stringify(interpolationOptions));
                }
            }
            if (match) {
                if (match.newContext === true) {
                    expressions.push({ desc: "New context level " });
                    context = Object.create(context);
                    // context.push({
                    //     token: match.token
                    // });
                }
                if (match.functionReference !== undefined) {
                    var reference = match.functionReference;
                    expressions.push({
                        op: wasm_structure_1.Opcodes.call,
                        desc: "call: " + wordWithoutQuotes,
                        reference: reference
                    });
                    expressions.push({
                        op: function () { return reference.functionID; },
                        desc: "Function ID"
                    });
                }
                else if (match.types && match.functionReference == undefined) {
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
                }
            }
            else {
                var parsedInt = parseInt(nextWord);
                if (!isNaN(parsedInt)) {
                    expressions.push({ op: wasm_structure_1.Opcodes.i32Const, desc: "i32 const" });
                    var i32Bytes = wasm_structure_1.toSignedLEB128(parseInt(nextWord));
                    for (var i = 0; i < i32Bytes.length; i++) {
                        expressions.push({ op: i32Bytes[i], desc: nextWord + ' part ' + (i + 1) });
                    }
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
