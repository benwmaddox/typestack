const { PerformanceObserver, performance } = require('perf_hooks');
import { WasmStructure, WasmType, Opcodes, ExportFunctionIds, FunctionIds } from './wasm-structure';
import { Lexer } from './lexer'
import { ContextParser, BaseContext, ParsedExpression } from './context-parser'
import * as fs from 'fs';
import { ContextEmitter } from './context-emitter';
import { TextDecoder } from 'util'

var module = 'bootstrap';

var contextBytes: Uint8Array;
fs.readFile(__dirname + `/${module}.t`, 'utf8', function (err, data: string) {

    var startTime = performance.now();
    var lexer = new Lexer();
    var tokenized = lexer.tokenize(data);
    var tokenizedTime = performance.now();

    // var parser = new Parser();    
    // var astModule = parser.parseModule(module, tokenized);
    // var emmitter = new Emitter();
    // var bytes2 = emmitter.getBytes(astModule);
    // console.log(JSON.stringify(astModule, undefined, "  "));

    var contextParser = new ContextParser();
    var expressions: Array<ParsedExpression> = [];
    var context = Object.create(BaseContext);


    var preParseTime = performance.now();
    var remainingWords = contextParser.parse(context, tokenized, expressions);
    var postParseTime = performance.now();
    // console.log(JSON.stringify(expressions, undefined, "  "));
    // console.log(JSON.stringify(context, undefined, "  "));
    // console.log(JSON.stringify(expressions, undefined, " "));

    var contextEmitter = new ContextEmitter();
    var preEmitTime = performance.now();
    contextBytes = contextEmitter.getBytes(expressions);
    var postEmitTime = performance.now();
    // console.log(JSON.stringify(contextBytes));


    // console.log(expressions);
    // console.log(JSON.stringify(expressions, undefined, "  "));    



    var preFileTime = performance.now();
    fs.writeFileSync('output.wasm', contextBytes);
    var postFileTime = performance.now();


    var preInitWasmTime = performance.now();
    var memory = new WebAssembly.Memory({ initial: 10 });
    runWasmWithCallback(contextBytes, {
        console: console,
        function: {
            log: console.log,
            stringLog: function (startAddress: number) {
                var length = new Uint32Array(memory.buffer, startAddress, 1)[0];
                console.log(length);
                var bytes = new Uint8Array(memory.buffer, startAddress + 4, length);
                var string = new TextDecoder('utf8').decode(bytes);
                console.log(string);
            },
            readFile: function () {
                var startingIndex = 0;
                var i32Wasm = new Uint32Array(memory.buffer);
                i32Wasm[startingIndex] = 1;
            }
        },
        js: {
            memory: memory
        }
    }, (item) => {
        var postInitWasmTime = performance.now();
        // console.log((<any>item.instance.exports));
        var exports = (<any>item.instance.exports);
        console.log(' ');

        var i32 = new Uint32Array(memory.buffer);
        i32[0] = 0x21;

        // Running each exported fn. No parameters in test
        for (var e in exports) {

            // var preFnRunTime = performance.now();
            // var result = exports[e]();
            // var postFnRunTime = performance.now();
            // console.log(`${e}: ${result} (${(postFnRunTime - preFnRunTime).toFixed(4)} ms)`)

            // // var pre2ndFnRunTime = performance.now();
            // // console.log(e + ": " + (exports[e]()));
            // // var post2ndFnRunTime = performance.now();
            // // console.log(`${e} 2nd run time: ${(post2ndFnRunTime - pre2ndFnRunTime).toFixed(2)} ms`)
        }

        var finalTime = performance.now();
        console.log(' ');
        console.log(`File write time: ${(postFileTime - preFileTime).toFixed(2)} ms`)
        console.log(`Tokenize time: ${(tokenizedTime - startTime).toFixed(2)} ms`)
        console.log(`Parse time: ${(postParseTime - preParseTime).toFixed(2)} ms`)
        console.log(`Emit time: ${(postEmitTime - preEmitTime).toFixed(2)} ms`)
        console.log(`Wasm init time: ${(postInitWasmTime - preInitWasmTime).toFixed(2)} ms`)
        console.log(`Full run time: ${(finalTime - startTime).toFixed(2)} ms`)



    });


    console.log('Starting bootstrap');


    var preInitWasmTime = performance.now();
    var memory = new WebAssembly.Memory({ initial: 10 });
    runWasmWithCallback(contextBytes, {
        console: console,
        function: {
            log: console.log,
            stringLog: function (startAddress: number) {
                var length = new Uint32Array(memory.buffer, startAddress, 1)[0];
                console.log(length);
                var bytes = new Uint8Array(memory.buffer, startAddress + 4, length); // TODO: specify length
                var string = new TextDecoder('utf8').decode(bytes);
                console.log(string);
                return 1;
            },
            readFile: function (TODOFilePathFromMemory: number): number {
                var buffer = fs.readFileSync(__dirname + `/${module}.t`);
                var startingIndex = 0

                var i32Wasm = new Uint32Array(memory.buffer);
                console.log("length: " + (buffer.byteLength + 1))
                i32Wasm[startingIndex] = buffer.byteLength + 1;
                // console.log("buffer: " + buffer)
                console.log("length: " + (buffer.byteLength + 1))
                console.log("length: " + i32Wasm[startingIndex])

                var i8Wasm = new Uint8Array(memory.buffer);
                var i8File = new Uint8Array(buffer);
                var dataStartIndex = startingIndex + 4;
                for (var i = 0; i < i8File.byteLength; i++) {
                    i8Wasm[i + dataStartIndex] = i8File[i];
                }

                // console.log(buffer);

                return dataStartIndex + i8File.length;
            }
        },
        js: {
            memory: memory
        }
    }, (item) => {
        var exports = (<any>item.instance.exports);
        console.log(' ');

        var i32 = new Uint32Array(memory.buffer);
        i32[4] = 0x01;

        // Running each exported fn. No parameters in test
        for (var e in exports) {

            var preFnRunTime = performance.now();
            var result = exports[e]();
            var postFnRunTime = performance.now();
            console.log(`${e}: ${result} (${(postFnRunTime - preFnRunTime).toFixed(4)} ms)`)
        }
    })



});

async function runWasmWithCallback(bytes: Uint8Array, importObject: any, callback: (result: WebAssembly.WebAssemblyInstantiatedSource) => void) {

    const instance = await WebAssembly.instantiate(bytes, importObject).then(callback);
}


