import { WasmStructure, WasmType, Opcodes } from './wasm-structure';
import * as fs from 'fs';

function byteDifferences(a: Uint8Array, b: Uint8Array) {

}

// Test - Add Two
// {
//     var wasmStructure = new WasmStructure();
//     wasmStructure.AddExportFunction("addTwo", [WasmType.i32, WasmType.i32], WasmType.i32, [
//         0, // Declcount
//         Opcodes.get_local, 0,
//         Opcodes.get_local, 1,
//         Opcodes.i32Add,
//         Opcodes.end
//     ]);
//     // Expected bytes as geneted by tool
//     var expectedBytes = [0x00, 0x61, 0x73, 0x6D, 0x01, 0x00, 0x00, 0x00, 0x01, 0x07, 0x01, 0x60, 0x02, 0x7F, 0x7F, 0x01,
//         0x7F, 0x03, 0x02, 0x01, 0x00, 0x07, 0x0A, 0x01, 0x06, 0x61, 0x64, 0x64, 0x54, 0x77, 0x6F, 0x00,
//         0x00, 0x0A, 0x09, 0x01, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6A, 0x0B, 0x00, 0x0E, 0x04, 0x6E,
//         0x61, 0x6D, 0x65, 0x02, 0x07, 0x01, 0x00, 0x02, 0x00, 0x00, 0x01, 0x00];
//     var actual = wasmStructure.getBytes();//.map((item, index) => item.toString().padStart(3, ' '));
//     // var expectedBytes = expectedString.map((item, index) =>  )
//     var minSize = expectedBytes.length < actual.byteLength ? expectedBytes.length : actual.byteLength;
//     var differences = [];
//     for (var i = 0; i < minSize; i++) {
//         differences.push(expectedBytes[i] == actual[i] ? " " : "^");
//     }
//     console.log(expectedBytes.join(', ') + '\n');
//     console.log(actual.join(', ') + '\n');
//     console.log(differences.join(', '));
// }



// var fs = require('fs');
fs.readFile(__dirname + '/sample2.t', 'utf8', function (err, data) {
    // console.log('loaded')
    // console.log(data)
    // console.log(__dirname)
    var wasmStructure = new WasmStructure();
    // wasmStructure.addEmitImport();
    // wasmStructure.addImport("function", "log", "emit", [WasmType.i32], null);
    // wasmStructure.addFunctionType([WasmType.f32, WasmType.f32], WasmType.f32);
    // wasmStructure.addFunction();
    wasmStructure.AddExportFunction("addTwo", [WasmType.i32, WasmType.i32], WasmType.i32, [
        0, // Declcount
        Opcodes.get_local, 0,
        Opcodes.get_local, 1,
        Opcodes.i32Add,
        Opcodes.end
    ]);
    var bytes = wasmStructure.getBytes();
    console.log("\n" + bytes.length + " bytes");
    console.log("Bytes: \n" + bytes.join(", ") + "\n");
    // console.log(bytes);
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
        var exports: any = results.instance.exports;
        console.log(exports.addTwo(3, 5));
    })
    // console.log(instance.exports.run());
    // instance.
}