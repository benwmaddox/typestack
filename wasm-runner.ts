import { WasmStructure, WasmType, Opcodes } from './wasm-structure';
import { Lexer } from './lexer'
import * as fs from 'fs';




// var fs = require('fs');
fs.readFile(__dirname + '/sample3.t', 'utf8', function (err, data: string) {
    // console.log('loaded')
    // console.log(data)
    // console.log(__dirname)
    // wasmStructure.addEmitImport();
    // wasmStructure.addImport("function", "log", "emit", [WasmType.i32], null);
    // wasmStructure.addFunctionType([WasmType.f32, WasmType.f32], WasmType.f32);
    // wasmStructure.addFunction();
    // testAddTwo();


    var lexer = new Lexer();
    var tokenized = lexer.tokenize(data);
    console.log(tokenized);
    var bytes = runIntoWasm(tokenized);
    fs.writeFileSync('output.wasm', bytes);
    runWasmWithCallback(bytes, {
        console: console,
        function: {
            log: console.log
        }
    }, (item) => {
        console.log((<any>item.instance.exports));
        var result = (<any>item.instance.exports)['add two {i:int}'](1);
        console.log(result);
    });
});
function buildParameterList(input: string) {
    var index = 0;
    var regex = new RegExp('{(.+?):(.+?)}');
    var regexResult = regex.exec(input.substr(index));
    var result = [];
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
function runIntoWasm(tokens: Array<string>): Uint8Array {

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
                name: tokens[index + 1].substring(1, tokens[index + 1].length - 1),
                // parameters: tokens.slice(index + 2, functionEqualIndex),
                parameters: buildParameterList(tokens[index + 1].substring(1, tokens[index + 1].length - 1) + " " + tokens.slice(index + 2, functionEqualIndex).join(" ")),
                bodyText: tokens.slice(functionEqualIndex + 1, functionEndIndex),
                result: { name: null, type: tokens[functionEqualIndex - 1] }
            };

            console.log(definition);
            var parameterOps = definition.parameters.map(x => x.type == "int" ? WasmType.i32 : WasmType.f64);
            var bodyOps = [
                Opcodes.i32Const, 2,
                Opcodes.get_local, 0,
                Opcodes.i32Add
            ];
            console.log(parameterOps);
            console.log(bodyOps);
            if (definition.name == 'add two {i:int}') { // todo: Check if it should be exported

                var exportIds = wasmStructure.AddExportFunction(
                    definition.name,
                    parameterOps,
                    WasmType.i32, // TODO
                    bodyOps
                )
            }
            else {
                var functionIds = wasmStructure.AddFunctionDetails(
                    parameterOps,
                    WasmType.i32, // TODO
                    bodyOps
                )
            }

            //functionDefinitions.push(definition);
            //checkForUndefinedWords(definition.bodyText);            

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

function testAddTwo() {
    var wasmStructure = new WasmStructure();
    wasmStructure.AddExportFunction("add Two", [WasmType.i32, WasmType.i32], WasmType.i32, [

        Opcodes.get_local, 0,
        Opcodes.get_local, 1,
        Opcodes.i32Add
    ]);
    var bytes = wasmStructure.getBytes();
    console.log("\n" + bytes.length + " bytes");
    console.log("Bytes: \n" + bytes.join(", ") + "\n");
    // console.log(bytes);
    // var writeCallback = (err: string) => console.log(err);
    fs.writeFileSync('output.wasm', bytes);

    runWasm(bytes);
}

async function runWasmWithCallback(bytes: Uint8Array, importObject: any, callback: (result: WebAssembly.WebAssemblyInstantiatedSource) => void) {
    const instance = await WebAssembly.instantiate(bytes, importObject).then(callback);
}


async function runWasm(bytes: Uint8Array) {
    var importObject = {
        function: {
            log: function (value: number) {
                console.log(value);
            }
        }
    };
    const instance = await WebAssembly.instantiate(bytes, importObject).then(results => {
        console.log(results);
        console.log(results.instance.exports);
        var exports: any = results.instance.exports;
        console.log(exports['add Two'](3, 5));
    })
    // console.log(instance.exports.run());
    // instance.
}