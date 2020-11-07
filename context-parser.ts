import { Opcodes, WasmStructure, toUnsignedLEB128 } from './wasm-structure';
import { ASTFunction, ASTImport, ASTModule, FunctionParser, ModuleParser, ASTParameter } from './intermediate-structure';
import { match } from 'assert';
import { stringify } from 'querystring';
import { FORMERR } from 'dns';

type MacroFunction = (context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression>) => { context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression> };
export type FunctionReference = {
    name: string,
    typeID: number | undefined,
    functionID: number | undefined,
    exportID: number | undefined
}
export type ContextItem = {
    token: string,
    interpolationTokens?: Array<string>,
    newContext?: boolean,
    popContext?: boolean,
    types?: Array<ContextType>,
    parse?: MacroFunction,
    functionReference?: FunctionReference
}
export type ContextType = {
    input?: Array<string>,
    output?: Array<string>,
    parameters?: Array<string>,
    opCodes?: Array<Opcodes>,

}


function isInOrder(values: Array<Number>): boolean {
    for (var i = 1; i < values.length; i++) {
        if (values[i - 1] >= values[i]) return false;
    }
    return true;
}

function buildParameterList(input: string): Array<ASTParameter> {
    var index = 0;
    var regex = new RegExp('{(.+?):(.+?)}');
    var regexResult = regex.exec(input.substr(index));
    var result: Array<ASTParameter> = [];
    while (regexResult !== null) {
        result.push({
            name: regexResult[1],
            type: regexResult[2]
        })

        index += regexResult.index + regexResult[0].length;
        regexResult = regex.exec(input.substr(index));

    }
    return result;
}
var extractParameters = (tokens: Array<string>) => {
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
}

var extractResults = (tokens: Array<string>) => {
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
    var results: Array<string> = [];
    for (var i = 0; i < additionalParameters.length; i++) {
        var item = additionalParameters[i];
        if (item.indexOf(':') == -1) {
            results.push(item)
        }
    }

    return results;
}


export type ContextDictionary = Array<ContextItem>;
export var BaseContext: ContextDictionary = [
    {
        token: 'export',
        parse: (context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression>): { context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression> } => {
            expressions.push({ desc: "export" });
            return { context, words, expressions };
        }
    },
    {
        token: 'import',
        parse: (context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression>): { context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression> } => {
            expressions.push({ desc: "import" });

            return { context, words, expressions };
        }
    },
    {
        token: 'use',
        parse: (context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression>): { context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression> } => {
            expressions.push({ desc: "use" });
            return { context, words, expressions };
        }
    },
    {
        token: 'fn',
        parse: (context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression>): { context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression> } => {
            var parameters = extractParameters(words);
            var fnIndex = words.indexOf("fn");
            var functionName = words[fnIndex + 1];
            if (functionName[0] == "'") {
                functionName = functionName.substring(1, functionName.length - 1)
            }
            var newContext = <ContextDictionary>Object.create(context);
            for (var i = 0; i < parameters.length; i++) {
                newContext.push({
                    token: parameters[i].name,
                    types: [
                        {

                            input: undefined,
                            output: [parameters[i].type],
                            opCodes: [
                                Opcodes.get_local,
                                i
                            ]
                        }
                    ]
                });
            }

            var contextItem: ContextItem = {
                token: functionName,
                interpolationTokens: functionName.indexOf('{') == -1 ? undefined : functionName.replace(/{(.+?)}/g, '{}').split(' '),
                types: [
                    {
                        input: parameters.map(x => x.type),
                        parameters: parameters.map(x => x.name),
                        output: extractResults(words),
                        opCodes:
                            // flatten opcodes
                            Array.prototype.concat.apply([],
                                parameters.map((x, i) =>
                                    [Opcodes.get_local, i]))
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

            var functionEqualIndex = words.indexOf("=");

            expressions.push({
                desc: "Adding function: " + functionName,
                function: contextItem

            })
            return { context: newContext, words: words.slice(functionEqualIndex), expressions };
        }
    },
    {
        token: 'var',
        newContext: true,
        parse: (context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression>): { context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression> } => {
            return { context, words, expressions };
        }
    },
    {
        token: ';',
        popContext: true,
        parse: (context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression>): { context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression> } => {

            // If context is a function
            expressions.push({
                op: Opcodes.end,
                desc: 'End function ' //+ context.functionReference?.name
            })

            // TODO: if context is.. a variable

            return { context: Object.getPrototypeOf(context), words, expressions };
        }
    }, // opCodes: [Opcodes.end],
    {
        token: '+',
        types: [
            { input: ['int', 'int'], output: ['int'], opCodes: [Opcodes.i32add] },
            { input: ['long', 'long'], output: ['long'], opCodes: [Opcodes.i64add] },
            { input: ['float', 'float'], output: ['float'], opCodes: [Opcodes.f32add] },
            { input: ['double', 'double'], output: ['double'], opCodes: [Opcodes.f64add] }
        ]
    },
    { token: '*', types: [{ input: ['int', 'int'], output: ['int'], opCodes: [Opcodes.i32mul] }] },
    { token: '-', types: [{ input: ['int', 'int'], output: ['int'], opCodes: [Opcodes.i32sub] }] },
    { token: '<', types: [{ input: ['int', 'int'], output: ['int'], opCodes: [Opcodes.i32lt_s] }] },
    { token: '>', types: [{ input: ['int', 'int'], output: ['int'], opCodes: [Opcodes.i32gt_s] }] },
    { token: '==', types: [{ input: ['int', 'int'], output: ['bool'], opCodes: [Opcodes.i32eq] }] },
    { token: '==0', types: [{ input: ['int'], output: ['bool'], opCodes: [Opcodes.i32eqz] }] },
    { token: '&&', types: [{ input: ['int', 'int'], output: ['bool'], opCodes: [Opcodes.i32and] }] },
];

export type ParsedExpression = {
    op?: Opcodes | number | (() => number | undefined),
    desc?: string,
    reference?: FunctionReference,
    function?: ContextItem
};

export class ContextParser {
    findInterpolationOptions(context: ContextDictionary, word: string): Array<[ContextItem, Array<string>]> {
        // Split up inner words
        // allow multiple statement matches
        // match on either word or {}
        var isInInterpolatedSection = false;

        var matches: Array<[ContextItem, Array<string>]> = [];

        for (var i = context.length - 1; i > 0; i--) {
            if (context[i].interpolationTokens === undefined) {
                continue;
            }

            var interpolated = word.split(' ');
            var interpolatedResultWords: Array<string> = [];
            var j = 0;
            var isMatching = true;
            while (j < context[i].interpolationTokens!.length && isMatching) {
                var next = interpolated.splice(0, 1);
                if (next.length === 0) {
                    isMatching = false;
                }
                else if (context[i].interpolationTokens![j] == "{}") {
                    interpolatedResultWords.push(next[0]);
                    isInInterpolatedSection = true;
                    j++;
                }
                else if (context[i].interpolationTokens![j] == next[0]) {
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
            if (j < context[i].interpolationTokens!.length) {
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
    }

    parse(context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression>): Array<string> {
        if (words.length == 0) {
            return words;
        }
        var nextWord = words[0];
        if (nextWord.startsWith("\"")) {
            // TODO string variable...
        }
        else {
            // Lookup through context
            var wordWithoutQuotes = nextWord[0] == "'" ? nextWord.substring(1, nextWord.length - 1) : nextWord;

            //TODO: find last match:
            var match = context.find(item => item.token == wordWithoutQuotes);// context[wordWithoutQuotes];
            if (match == undefined && nextWord[0] == "'") {
                // try by interpolation if in single quotes
                var interpolationOptions = this.findInterpolationOptions(context, wordWithoutQuotes)
                if (interpolationOptions.length == 1) {
                    match = interpolationOptions[0][0];
                    var innerWords: Array<string> = interpolationOptions[0][1];
                    var innerExpresions: Array<ParsedExpression> = [];
                    this.parse(context, innerWords, innerExpresions)
                    expressions.push(...innerExpresions);
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
                }
                if (match.functionReference !== undefined) {
                    var reference = match.functionReference;
                    expressions.push({
                        op: Opcodes.call, // May need indirect call. We'll see
                        desc: "call: " + wordWithoutQuotes,
                        reference: reference
                    })
                    expressions.push({
                        op: function () { return reference.functionID },
                        desc: "Function ID"
                    })
                }

                else if (match.types && match.functionReference == undefined) {
                    // TODO: find actual matching type                
                    var matchedType: ContextType = match.types![0];
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
                    expressions.push({ op: Opcodes.i32Const, desc: "i32 const" });

                    var i32Bytes = toUnsignedLEB128(parseInt(nextWord))
                    for (var i = 0; i < i32Bytes.length; i++) {
                        expressions.push({ op: i32Bytes[i], desc: nextWord + ' part ' + (i + 1) });
                    }

                }
                else {
                    console.log('Could not parse ' + nextWord)
                }
                // TODO: other numbers
                // TODO: other constants / types? 
            }
        }

        return this.parse(context, words.slice(1), expressions);
    }


}
