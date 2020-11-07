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
    // console.log(JSON.stringify(expressions, undefined, "  "));
    var contextBytes = contextEmitter.getBytes(expressions);
    // console.log(JSON.stringify(contextBytes));

    // console.log(JSON.stringify(context["INTERPOLATION"], undefined, "  "));

    // console.log(expressions);
    // console.log(JSON.stringify(expressions, undefined, "  "));    
    // console.log(JSON.stringify(context, undefined, "  "));
    // console.log(expressions);
    // console.log(context);
    // console.log(Object.getPrototypeOf(context));


    // var bytes = runIntoWasm(tokenized);
    fs.writeFileSync('output.wasm', contextBytes);
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
            console.log(e + ": " + (exports[e]()));
        }

    });

});

async function runWasmWithCallback(bytes: Uint8Array, importObject: any, callback: (result: WebAssembly.WebAssemblyInstantiatedSource) => void) {
    const instance = await WebAssembly.instantiate(bytes, importObject).then(callback);
}


