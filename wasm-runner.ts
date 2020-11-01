import { WasmStructure, WasmType, Opcodes, ExportFunctionIds, FunctionIds } from './wasm-structure';
import { Lexer } from './lexer'
import { Parser } from './parser'
import { ContextParser, BaseContext, ParsedExpression } from './context-parser'
import { Emitter } from './emitter'
import * as fs from 'fs';
import { EventEmitter } from 'events';
import { ContextEmitter } from './context-emitter';

var module = 'sample3';

fs.readFile(__dirname + `/${module}.t`, 'utf8', function (err, data: string) {


    var lexer = new Lexer();
    var tokenized = lexer.tokenize(data);
    // var parser = new Parser();    
    // var astModule = parser.parseModule(module, tokenized);
    // var emmitter = new Emitter();
    // var bytes2 = emmitter.getBytes(astModule);
    // console.log(JSON.stringify(astModule, undefined, "  "));

    var contextParser = new ContextParser();
    var expressions: Array<ParsedExpression> = [];
    var context = Object.create(BaseContext);
    var remainingWords = contextParser.parse(context, tokenized, expressions);
    var contextEmitter = new ContextEmitter();
    var contextBytes = contextEmitter.getBytes(expressions);


    // console.log(expressions);
    // console.log(JSON.stringify(expressions, undefined, "  "));    
    // console.log(JSON.stringify(context, undefined, "  "));
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

type Parameter = { name: string, type: string };
function buildParameterList(input: string): Array<Parameter> {
    var index = 0;
    var regex = new RegExp('{(.+?):(.+?)}');
    var regexResult = regex.exec(input.substr(index));
    var result: Array<Parameter> = [];
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

// Not sure about structure since I may want to override functions later in the process
type DictionaryItem = { name: string, IDs?: ExportFunctionIds | FunctionIds, OpsCodes?: Array<Opcodes> }
var dictionary: Array<DictionaryItem> = [];


function builtInWords(): Array<DictionaryItem> {
    var results: Array<DictionaryItem> = [];
    results.push({ name: '+', OpsCodes: [Opcodes.i32add] });
    results.push({ name: '*', OpsCodes: [Opcodes.i32mul] });
    results.push({ name: '-', OpsCodes: [Opcodes.i32sub] });
    results.push({ name: '<', OpsCodes: [Opcodes.i32lt_s] });
    results.push({ name: '==', OpsCodes: [Opcodes.i32eq] });
    results.push({ name: '==0', OpsCodes: [Opcodes.i32eqz] });
    results.push({ name: '&&', OpsCodes: [Opcodes.i32and] });

    return results;
}
function runIntoWasm(tokens: Array<string>): Uint8Array {
    dictionary = builtInWords();
    var wasmStructure = new WasmStructure();

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
            var parameterOps = definition.parameters.map(x => x.type == "int" ? WasmType.i32 : WasmType.f64);
            var bodyOps = bodyTokensToOps(definition);

            // console.log(bodyOps);

            if (index > 0 && tokens[index - 1] == "export") {
                var exportIds = wasmStructure.AddExportFunction(
                    definition.name,
                    parameterOps,
                    WasmType.i32, // TODO
                    bodyOps
                )
                dictionary.push({
                    name: definition.name,
                    IDs: exportIds
                })
            }
            else {

                var functionIds = wasmStructure.AddFunctionDetails(
                    parameterOps,
                    WasmType.i32, // TODO
                    bodyOps
                )
                dictionary.push({
                    name: definition.name,
                    IDs: functionIds
                })
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
function isInOrder(values: Array<Number>): boolean {
    for (var i = 1; i < values.length; i++) {
        if (values[i - 1] >= values[i]) return false;
    }
    return true;
}
function findInterpolatedMatches(token: string): Array<DictionaryItem> {

    var matchingFunctions: Array<DictionaryItem> = [];
    var tokenSplit = token.substring(1, token.length - 1).split(" ");
    var interpolatedOptions = dictionary.filter(x => x.name.indexOf("{") != -1);
    for (var i = 0; i < interpolatedOptions.length; i++) {
        var wordWithoutQuotes = interpolatedOptions[i].name;//.substring(1, interpolatedOptions[i].name.length - 1);
        var wordSplit = wordWithoutQuotes.split(" ").filter(x => x[0] != "{");

        // if (wordSplit.length < tokenSplit.length) continue;
        // console.log(wordSplit);
        // console.log(tokenSplit);
        var locationInToken = wordSplit.map(x => tokenSplit.indexOf(x));
        if (locationInToken.every(x => x != -1)
            && isInOrder(locationInToken)
        ) {
            matchingFunctions.push(interpolatedOptions[i]);
            // console.log("found interpolated ")


        }
    }
    return matchingFunctions;
}

function bodyTokensToOps(definition: any): Array<number> {
    var tokens: Array<string> = definition.body
    var parameters: Array<Parameter> = definition.parameters;
    var result: Array<number> = [];

    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        var matchingFunctions: Array<DictionaryItem>

        if (token[0] == "'") {
            matchingFunctions = dictionary.filter(x => "'" + x.name + "'" == token);

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
            matchingFunctions = dictionary.filter(x => x.name == token);
        }


        if (matchingFunctions.length != 0) {
            var lastFunction = matchingFunctions[matchingFunctions.length - 1];
            if (lastFunction.IDs != null) {
                result.push(Opcodes.call);
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
            result.push(Opcodes.i32Const);
            result.push(parsedInt);
            continue;
        }
        var matchingParameters = parameters.filter(x => x.name == token);
        if (matchingParameters.length != 0) {
            var lastParam = matchingParameters[matchingParameters.length - 1];
            var paramIndex = parameters.indexOf(lastParam);
            result.push(Opcodes.get_local);
            result.push(paramIndex);

            continue;
        }

        throw 'Could not find match for ' + token;


    }


    return result;
}


async function runWasmWithCallback(bytes: Uint8Array, importObject: any, callback: (result: WebAssembly.WebAssemblyInstantiatedSource) => void) {
    const instance = await WebAssembly.instantiate(bytes, importObject).then(callback);
}


