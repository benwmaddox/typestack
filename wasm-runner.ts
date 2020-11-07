const { PerformanceObserver, performance } = require('perf_hooks');
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

    var startTime = performance.now();
    var lexer = new Lexer();
    var tokenized = lexer.tokenize(data);
    var tokenizedTime = performance.now();
    console.log(`Tokenize time: ${tokenizedTime - startTime}`)
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
    console.log(`Parse time: ${postParseTime - preParseTime}`)

    var contextEmitter = new ContextEmitter();
    // console.log(JSON.stringify(expressions, undefined, "  "));
    var preEmitTime = performance.now();
    var contextBytes = contextEmitter.getBytes(expressions);
    var postEmitTime = performance.now();
    console.log(`Emit time: ${postEmitTime - preEmitTime}`)
    // console.log(JSON.stringify(contextBytes));

    // console.log(JSON.stringify(context["INTERPOLATION"], undefined, "  "));

    // console.log(expressions);
    // console.log(JSON.stringify(expressions, undefined, "  "));    
    // console.log(JSON.stringify(context, undefined, "  "));
    // console.log(expressions);
    // console.log(context);
    // console.log(Object.getPrototypeOf(context));


    // var bytes = runIntoWasm(tokenized);

    var preFileTime = performance.now();
    fs.writeFileSync('output.wasm', contextBytes);
    var postFileTime = performance.now();
    console.log(`File write time: ${postFileTime - preFileTime}`)

    runWasmWithCallback(contextBytes, {
        console: console,
        function: {
            log: console.log
        }
    }, (item) => {
        // console.log((<any>item.instance.exports));
        var exports = (<any>item.instance.exports);

        // Running each exported fn. No parameters in test
        for (var e in exports) {

            var preFnRunTime = performance.now();
            console.log(e + ": " + (exports[e]()));
            var postFnRunTime = performance.now();
            console.log(`{e} run time: ${postFnRunTime - preFnRunTime}`)
        }

        var finalTime = performance.now();

        console.log(`Full run time: ${finalTime - startTime} ms`)
    });

});

async function runWasmWithCallback(bytes: Uint8Array, importObject: any, callback: (result: WebAssembly.WebAssemblyInstantiatedSource) => void) {
    const instance = await WebAssembly.instantiate(bytes, importObject).then(callback);
}


