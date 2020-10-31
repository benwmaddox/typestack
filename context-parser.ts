import { Opcodes } from './wasm-structure';
import { ASTFunction, ASTImport, ASTModule, FunctionParser, ModuleParser, ASTParameter } from './intermediate-structure';
import { match } from 'assert';

export type ContextItem = {
    newContext?: boolean,
    popContext?: boolean,
    types?: Array<ContextType>
}
export type ContextType = {
    input?: Array<string>,
    output?: Array<string>,
    opCodes?: Array<Opcodes>
}

export type ContextDictionary = { [index: string]: ContextItem };
export var BaseContext: ContextDictionary = {
    'export': {},
    'fn': { newContext: true },
    'var': { newContext: true },
    ';': { popContext: true }, // opCodes: [Opcodes.end],
    '+': {
        types: [
            { input: ['int', 'int'], output: ['int'], opCodes: [Opcodes.i32add] },
            { input: ['long', 'long'], output: ['long'], opCodes: [Opcodes.i64add] },
            { input: ['float', 'float'], output: ['float'], opCodes: [Opcodes.f32add] },
            { input: ['double', 'double'], output: ['double'], opCodes: [Opcodes.f64add] },
        ]
    },
    '*': { types: [{ input: ['int', 'int'], output: ['int'], opCodes: [Opcodes.i32mul] }] },
    '-': { types: [{ input: ['int', 'int'], output: ['int'], opCodes: [Opcodes.i32sub] }] },
    '<': { types: [{ input: ['int', 'int'], output: ['int'], opCodes: [Opcodes.i32le_s] }] },
    '==': { types: [{ input: ['int', 'int'], output: ['bool'], opCodes: [Opcodes.i32eq] }] },
    '==0': { types: [{ input: ['int'], output: ['bool'], opCodes: [Opcodes.i32eqz] }] },
    '&&': { types: [{ input: ['int', 'int'], output: ['bool'], opCodes: [Opcodes.i32and] }] },

};

export class ContextParser {
    parse(context: ContextDictionary, words: Array<string>): any {
        if (words.length == 0) return null;

        var nextWord = words[0];
        if (nextWord.startsWith("'")) {
            console.log(nextWord)
        }
        else if (nextWord.startsWith("\"")) {
            console.log(nextWord)
        }
        else {
            // Lookup through context
            if (context[nextWord]) {
                var match = context[nextWord];
                console.log(nextWord);
                if (match.types) {
                    // TODO: find actual matching type                
                    var matchedType: ContextType = match.types![0];
                    console.log(matchedType)
                }
                if (match.newContext === true) {
                    context = Object.create(context);
                }
                if (match.popContext === true) {
                    context = Object.getPrototypeOf(context);
                }
            }
            else {
                // number? 
                console.log(nextWord);
            }
        }
        return this.parse(context, words.slice(1));
    }
}
