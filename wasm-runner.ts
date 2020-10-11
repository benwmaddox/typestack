import { WasmStructure, WasmType } from './wasm-structure';
import * as fs from 'fs';

// var fs = require('fs');
fs.readFile(__dirname + '/sample2.t', 'utf8', function (err, data) {
    // console.log('loaded')
    // console.log(data)
    // console.log(__dirname)
    var wasmStructure = new WasmStructure();
    // wasmStructure.addEmitImport();
    wasmStructure.addImport("function", "log", "emit", [WasmType.i32], null);
    var bytes = wasmStructure.getBytes();
    console.log("\n" + bytes.length + " bytes");
    console.log("Bytes: " + bytes.join(", ") + "\n");
    // var writeCallback = (err: string) => console.log(err);
    fs.writeFileSync('output.wasm', bytes);
    runWasm(bytes);
});


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
    })
    // console.log(instance.exports.run());
    // instance.
}