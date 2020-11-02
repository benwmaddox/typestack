import { Opcodes } from './wasm-structure';
import { ASTFunction, ASTImport, ASTModule, FunctionParser, ModuleParser, ASTParameter } from './intermediate-structure';
import { match } from 'assert';
import { stringify } from 'querystring';

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


function isInOrder(values: Array<Number>): boolean {
    for (var i = 1; i < values.length; i++) {
        if (values[i - 1] >= values[i]) return false;
    }
    return true;
}

// function findInterpolatedMatches(context: any, token: string): Array<any> {

//     var matchingFunctions: Array<any> = [];
//     var tokenSplit = token.substring(1, token.length - 1).split(" ");
//     var interpolatedOptions = context.filter(x => x.name.indexOf("{") != -1);
//     for (var i = 0; i < interpolatedOptions.length; i++) {
//         var wordWithoutQuotes = interpolatedOptions[i].name;//.substring(1, interpolatedOptions[i].name.length - 1);
//         var wordSplit = wordWithoutQuotes.split(" ").filter(x => x[0] != "{");

//         var locationInToken = wordSplit.map(x => tokenSplit.indexOf(x));
//         if (locationInToken.every(x => x != -1)
//             && isInOrder(locationInToken)
//         ) {
//             matchingFunctions.push(interpolatedOptions[i]);
//         }
//     }
//     return matchingFunctions;
// }
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
        parse: (context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression>): { context: ContextDictionary, words: Array<string>, expressions: Array<ParsedExpression> } => {
            var parameters = extractParameters(words);
            var fnIndex = words.indexOf("fn");
            var functionName = words[fnIndex + 1];
            if (functionName[0] == "'") {
                functionName = functionName.substring(1, functionName.length - 1)
            }
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
            // interpolated: 
            if (functionName.indexOf('{') != -1) {
                var interpolated = functionName.replace(/{(.+?)}/g, '{}').split(' ');
                var partContext: any = context;
                for (var i = 0; i < interpolated.length - 1; i++) {
                    var part = interpolated[i];
                    if (partContext[part] === undefined) {
                        partContext[part] = {};
                        partContext = partContext[part];
                    }
                    else {
                        partContext = partContext[part];
                    }
                }
                partContext[interpolated[interpolated.length - 1]] = contextItem;
                console.log(context["{}"]);
            }

            var functionEqualIndex = words.indexOf("=");

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

            // TODO: if context is.. a variable

            return { context: Object.getPrototypeOf(context), words, expressions };
        }
    }, // opCodes: [Opcodes.end],
    '+': {
        types: [
            { input: ['int', 'int'], output: ['int'], opCodes: [Opcodes.i32add] },
            { input: ['long', 'long'], output: ['long'], opCodes: [Opcodes.i64add] },
            { input: ['float', 'float'], output: ['float'], opCodes: [Opcodes.f32add] },
            { input: ['double', 'double'], output: ['double'], opCodes: [Opcodes.f64add] }
        ]
    },
    '*': { types: [{ input: ['int', 'int'], output: ['int'], opCodes: [Opcodes.i32mul] }] },
    '-': { types: [{ input: ['int', 'int'], output: ['int'], opCodes: [Opcodes.i32sub] }] },
    '<': { types: [{ input: ['int', 'int'], output: ['int'], opCodes: [Opcodes.i32lt_s] }] },
    '>': { types: [{ input: ['int', 'int'], output: ['int'], opCodes: [Opcodes.i32gt_s] }] },
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
    findInterpolationOptions(context: ContextDictionary, word: string): [ContextItem, Array<string>] | undefined {
        // var results: Array<ContextItem> = [];


        // Split up inner words
        // allow multiple statement matches
        // match on either word or {}
        var interpolated = word.split(' ');
        var isInInterpolatedSection = false;

        // TODO: allow multiple values to be interpolated in future
        var interpolatedResultWords: Array<string> = [];
        var searchContext: any = context;
        for (var i = 0; i < interpolated.length; i++) {
            var split = interpolated[i];
            // console.log(split);
            // console.log(searchContext);
            if (searchContext[split] !== undefined) {
                searchContext = searchContext[split];
                isInInterpolatedSection = false;
            }
            else if (searchContext["{}"] !== undefined) {
                searchContext = searchContext["{}"];
                isInInterpolatedSection = true;
                interpolatedResultWords.push(split);
            }
            // else if (isInInterpolatedSection) {

            // }
        }
        if (searchContext != undefined) {
            // console.log(searchContext);
            return [searchContext, interpolatedResultWords];
        }
        return undefined;
    }

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
            var wordWithoutQuotes = nextWord[0] == "'" ? nextWord.substring(1, nextWord.length - 1) : nextWord;
            var match = context[wordWithoutQuotes];
            if (match == undefined && nextWord[0] == "'") {
                // try by interpolation if in single quotes
                var interpolationOptions = this.findInterpolationOptions(context, wordWithoutQuotes)
                console.log(interpolationOptions);
                if (interpolationOptions !== undefined) {
                    match = interpolationOptions[0];
                    var innerWords: Array<string> = interpolationOptions[1];
                    var innerExpresions: Array<ParsedExpression> = [];

                    // TODO: fill in inner words based on match above
                    // var innerWords: Array<string> = [];

                    // console.log(innerWords);
                    this.parse(context, innerWords, innerExpresions)
                    // console.log(innerExpresions)
                    // TODO: right syntax?
                    console.log(expressions.length);
                    expressions.push(...innerExpresions);
                    console.log(expressions.length);
                }
                // else if (interpolationOptions.length > 2) {
                //     throw Error("Too many possible matches for: " + wordWithoutQuotes
                //         + JSON.stringify(interpolationOptions)
                //     );
                // }
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
                        op: Opcodes.call, // May need indirect call. We'll see
                        desc: "call: " + wordWithoutQuotes,
                        reference: reference
                    })
                    expressions.push({
                        op: function () { return reference.functionID },
                        desc: "Function ID"
                    })
                }
                // console.log(nextWord);
                if (match.types && match.functionReference == undefined) {
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
                    console.log('Could not parse ' + nextWord)
                }
                // TODO: other numbers
                // TODO: other constants / types? 
            }
        }

        return this.parse(context, words.slice(1), expressions);
    }


}
