import { WasmStructure, WasmType, Opcodes, ExportFunctionIds, FunctionIds } from './wasm-structure';
import { Lexer } from './lexer'
import * as fs from 'fs';


fs.readFile(__dirname + '/sample3.t', 'utf8', function (err, data: string) {


    var lexer = new Lexer();
    var tokenized = lexer.tokenize(data);
    var bytes = runIntoWasm(tokenized);
    console.log('hitting this code');
    fs.writeFileSync('output.wasm', bytes);
    runWasmWithCallback(bytes, {
        console: console,
        function: {
            log: console.log
        }
    }, (item) => {
        console.log((<any>item.instance.exports));
        // var result = (<any>item.instance.exports)['add two {i:int}'](1);
        console.log((<any>item.instance.exports)['add two'](3));
        console.log((<any>item.instance.exports)['double'](9));
        console.log((<any>item.instance.exports)['test']());
        console.log((<any>item.instance.exports)['add one twice'](3));
        console.log((<any>item.instance.exports)['add'](91, 9));
        console.log((<any>item.instance.exports)['subtract'](10, 3));
    });
});

type Parameter = { parameter: string, type: string };
function buildParameterList(input: string): Array<Parameter> {
    var index = 0;
    var regex = new RegExp('{(.+?):(.+?)}');
    var regexResult = regex.exec(input.substr(index));
    var result: Array<Parameter> = [];
    while (regexResult !== null) {
        result.push({
            parameter: regexResult[1],
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
    results.push({ name: '+', OpsCodes: [Opcodes.i32Add] });
    results.push({ name: '*', OpsCodes: [Opcodes.i32Mul] });
    results.push({ name: '-', OpsCodes: [Opcodes.i32Sub] });

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
                parameters: buildParameterList(tokens[index + 1].substring(1, tokens[index + 1].length - 1) + " " + tokens.slice(index + 2, functionEqualIndex).join(" ")),
                bodyText: tokens.slice(functionEqualIndex + 1, functionEndIndex),
                result: { name: null, type: tokens[functionEqualIndex - 1] }
            };

            console.log(definition);
            var parameterOps = definition.parameters.map(x => x.type == "int" ? WasmType.i32 : WasmType.f64);
            var bodyOps = bodyTokensToOps(definition);

            console.log(bodyOps);


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
function bodyTokensToOps(definition: any): Array<number> {
    var tokens: Array<string> = definition.bodyText
    var parameters: Array<Parameter> = definition.parameters;
    var result: Array<number> = [];

    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        var matchingFunction = token[0] == "'"
            ? dictionary.filter(x => "'" + x.name + "'" == token)
            : dictionary.filter(x => x.name == token);
        if (matchingFunction.length != 0) {
            var lastFunction = matchingFunction[matchingFunction.length - 1];
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
            console.log('int: ' + parsedInt);
            result.push(Opcodes.i32Const);
            result.push(parsedInt);
            continue;
        }
        var matchingParameters = parameters.filter(x => x.parameter == token);
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

