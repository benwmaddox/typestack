import { Opcodes } from './wasm-structure';
import { ASTFunction, ASTImport, ASTModule, FunctionParser, ModuleParser, ASTParameter } from './intermediate-structure';
import { match } from 'assert';

export type ContextItem = {
    newContext?: boolean,
    popContext?: boolean,
    types?: Array<ContextType>
}
export type ContextType = {
    inputTypes?: Array<string>,
    outputTypes?: Array<string>,
    opCodes?: Array<Opcodes>
}

export var BaseContext: { [index: string]: ContextItem } = {
    "export": {},
    "fn": { newContext: true },
    "var": { newContext: true },
    ";": { popContext: true }, // opCodes: [Opcodes.end],
    '+': {
        types: [
            { inputTypes: ['int', 'int'], outputTypes: ['int'], opCodes: [Opcodes.i32add] },
            { inputTypes: ['long', 'long'], outputTypes: ['long'], opCodes: [Opcodes.i64add] },
            { inputTypes: ['float', 'float'], outputTypes: ['float'], opCodes: [Opcodes.f32add] },
            { inputTypes: ['double', 'double'], outputTypes: ['double'], opCodes: [Opcodes.f64add] },
        ]
    },
    '*': { types: [{ inputTypes: ['int', 'int'], outputTypes: ['int'], opCodes: [Opcodes.i32mul] }] },
    '-': { types: [{ inputTypes: ['int', 'int'], outputTypes: ['int'], opCodes: [Opcodes.i32sub] }] },
    '<': { types: [{ inputTypes: ['int', 'int'], outputTypes: ['int'], opCodes: [Opcodes.i32le_s] }] },
    '==': { types: [{ inputTypes: ['int', 'int'], outputTypes: ['bool'], opCodes: [Opcodes.i32eq] }] },
    '==0': { types: [{ inputTypes: ['int'], outputTypes: ['bool'], opCodes: [Opcodes.i32eqz] }] },
    '&&': { types: [{ inputTypes: ['int', 'int'], outputTypes: ['bool'], opCodes: [Opcodes.i32and] }] },

};

export class ContextParser {
    parse(context: any, words: Array<string>): any {
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
                console.log(nextWord);
                console.log(context[nextWord]);
            }
            else {
                // number? 
                console.log(nextWord);
            }
        }
        return this.parse(context, words.slice(1));
    }
}
