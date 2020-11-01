import { Opcodes } from './wasm-structure';
import { ASTFunction, ASTImport, ASTModule, FunctionParser, ModuleParser, ASTParameter } from './intermediate-structure';
import { match } from 'assert';

type MacroFunction = (context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression>) => { context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression> };
export type FunctionReference = {
    name: string,
    typeID: number | undefined,
    functionID: number | undefined,
    exportID: number | undefined
}
export type ContextItem = {
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


export type ContextDictionary = { [index: string]: ContextItem };
export var BaseContext: ContextDictionary = {
    'export': {
        parse: (context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression>): { context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression> } => {
            expressions.push({ desc: "export" });
            return { context, words, expressions };
        }
    },
    'import': {
        parse: (context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression>): { context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression> } => {
            expressions.push({ desc: "import" });
            return { context, words, expressions };
        }
    },
    'use': {
        parse: (context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression>): { context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression> } => {
            expressions.push({ desc: "use" });
            return { context, words, expressions };
        }
    },
    'fn': {
        //newContext: true,
        parse: (context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression>): { context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression> } => {

            var parameters = extractParameters(words);
            // console.log("---extracting parameters")
            // console.log(parameters);
            // console.log("---new context")
            var fnIndex = words.indexOf("fn");
            var functionName = words[fnIndex + 1];
            // console.log('fn index ' + fnIndex);
            var newContext = <ContextDictionary>Object.create(context);
            for (var i = 0; i < parameters.length; i++) {
                newContext[parameters[i].name] = {
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
                };

            }

            var contextItem: ContextItem = {
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

            context[functionName] = contextItem;



            var functionEqualIndex = words.indexOf("=");
            // var functionEndIndex = words.indexOf(";", functionEqualIndex);
            // console.log('starting words')
            // console.log(words.slice(0, functionEqualIndex))
            // console.log('after fn parse');
            // console.log(words.slice(functionEndIndex));
            expressions.push({
                desc: "Adding function: " + functionName,
                function: contextItem

            })
            return { context: newContext, words: words.slice(functionEqualIndex), expressions };
        }
    },
    'var': {
        newContext: true,
        parse: (context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression>): { context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression> } => {
            return { context, words, expressions };
        }
    },
    ';': {
        popContext: true,
        parse: (context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression>): { context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression> } => {

            // If context is a function
            expressions.push({
                op: Opcodes.end,
                desc: 'End function ' //+ context.functionReference?.name
            })

            // if context is.. a variable

            return { context: Object.getPrototypeOf(context), words, expressions };
        }
    }, // opCodes: [Opcodes.end],
    '+': {
        types: [
            { input: ['int', 'int'], output: ['int'], opCodes: [Opcodes.i32add] },
            { input: ['long', 'long'], output: ['long'], opCodes: [Opcodes.i64add] },
            { input: ['float', 'float'], output: ['float'], opCodes: [Opcodes.f32add] },
            { input: ['double', 'double'], output: ['double'], opCodes: [Opcodes.f64add] },
        ]
    },
    '*': { types: [{ input: ['int', 'int'], output: ['int'], opCodes: [Opcodes.i32mul] }] },
    '-': { types: [{ input: ['int', 'int'], output: ['int'], opCodes: [Opcodes.i32sub] }] },
    '<': { types: [{ input: ['int', 'int'], output: ['int'], opCodes: [Opcodes.i32lt_s] }] },
    '==': { types: [{ input: ['int', 'int'], output: ['bool'], opCodes: [Opcodes.i32eq] }] },
    '==0': { types: [{ input: ['int'], output: ['bool'], opCodes: [Opcodes.i32eqz] }] },
    '&&': { types: [{ input: ['int', 'int'], output: ['bool'], opCodes: [Opcodes.i32and] }] },

};

export type ParsedExpression = {
    op?: Opcodes | number | (() => number | undefined),
    desc?: string,
    reference?: FunctionReference,
    function?: ContextItem
};

export class ContextParser {
    parse(context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression>): Array<string> {
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
            if (context[nextWord]) {
                var match = context[nextWord];
                if (match.newContext === true) {
                    expressions.push({ desc: "New context level " });
                    // console.log('    Adding context level')
                    context = Object.create(context);
                }
                if (match.functionReference !== undefined) {
                    var reference = match.functionReference;
                    expressions.push({
                        op: Opcodes.call, // May need indirect call. We'll see
                        desc: "call: " + nextWord,
                        reference: reference
                    })
                    // TODO: interpolation
                    expressions.push({
                        op: () => reference.functionID,
                        desc: "Function ID"
                    })
                }
                // console.log(nextWord);
                if (match.types) {
                    // TODO: find actual matching type                
                    var matchedType: ContextType = match.types![0];
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
                    expressions.push({ op: Opcodes.i32Const, desc: "i32 const" });
                    expressions.push({ op: parseInt(nextWord), desc: nextWord });
                }
                else {
                    console.log('could not parse ' + nextWord)
                }
                // number? 
                // console.log(nextWord);

            }
        }

        return this.parse(context, words.slice(1), expressions);
    }
}
