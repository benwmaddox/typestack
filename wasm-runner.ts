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

});

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