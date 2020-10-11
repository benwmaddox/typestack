import { WasmStructure } from './wasm-structure';
import * as fs from 'fs';

// var fs = require('fs');
fs.readFile(__dirname + '/sample2.t', 'utf8', function (err, data) {
    // console.log('loaded')
    // console.log(data)
    // console.log(__dirname)
    var wasmStructure = new WasmStructure();
    var bytes = wasmStructure.compile(data);
    // console.log(bytes);
    runWasm(bytes);
});


var dataStack = [];
var functionStack = [];
var functionDefinitions = [];

async function runWasm(bytes: Uint8Array) {
    var importObject = {
        function: {
            emit: function (value: number) {
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