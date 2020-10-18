import { WasmStructure, WasmType, Opcodes } from './wasm-structure';
import { Lexer } from './lexer'
import * as fs from 'fs';




// var fs = require('fs');
fs.readFile(__dirname + '/sample2.t', 'utf8', function (err, data: string) {
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
    runWasmWithCallback(bytes, {}, (item) => {
        (<any>item.instance.exports)['testing number prints'];
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
            var functionEndIndex = tokens.indexOf(";", functionEqualIndex);
            if (functionEndIndex < 0) {
                throw 'No ; ending for ' + tokens[index + 1];
            }
            var definition = {
                name: tokens[index + 1],
                types: tokens.slice(index + 2, functionEqualIndex),
                bodyText: tokens.slice(functionEqualIndex + 1, functionEndIndex)
            }
            var regex = new RegExp('{(.+?):(.+?)}');
            // console.log(regex.exec(definition.name));
            // console.log(regex.exec("fn print {i:int} {y:float} {x:blahblah}"));
            // var parameters = definition.name
            var parameters = buildParameterList(definition.name);
            console.log(parameters);
            parameters = buildParameterList("fn print {i:int} {y:float} {x:blahblah}");
            console.log(parameters);

            // console.log(definition);
            // wasmStructure.AddExportFunction(
            //     definition.name,
            //     [],
            //     null,

            // )
            //functionDefinitions.push(definition);
            //checkForUndefinedWords(definition.bodyText);            

            // runWords(definition.bodyText);
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