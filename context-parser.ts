import { Opcodes } from './wasm-structure';
import { ASTFunction, ASTImport, ASTModule, FunctionParser, ModuleParser, ASTParameter } from './intermediate-structure';
import { match } from 'assert';

export type ContextItem = {
    inputTypes?: Array<string>,
    outputTypes?: Array<string>,
    opCodes?: Array<Opcodes>,
    newContext?: boolean,
    popContext?: boolean
}

export var BaseContext: { [index: string]: ContextItem } = {
    "export": { inputTypes: undefined, outputTypes: undefined, opCodes: undefined },
    "fn": { inputTypes: undefined, outputTypes: undefined, opCodes: undefined, newContext: true },
    "var": { inputTypes: undefined, outputTypes: undefined, opCodes: undefined, newContext: true },
    ";": { inputTypes: undefined, outputTypes: undefined, opCodes: [Opcodes.end], popContext: true },
    '+': { inputTypes: ['int', 'int'], outputTypes: ['int'], opCodes: [Opcodes.i32Add] },
    '*': { inputTypes: ['int', 'int'], outputTypes: ['int'], opCodes: [Opcodes.i32Mul] },
    '-': { inputTypes: ['int', 'int'], outputTypes: ['int'], opCodes: [Opcodes.i32Sub] },
    '<': { inputTypes: ['int', 'int'], outputTypes: ['int'], opCodes: [Opcodes.i32LessThanSigned] },
    '==': { inputTypes: ['int', 'int'], outputTypes: ['bool'], opCodes: [Opcodes.i32Equals] },
    '==0': { inputTypes: ['int'], outputTypes: ['bool'], opCodes: [Opcodes.i32EqualsZero] },
    '&&': { inputTypes: ['int', 'int'], outputTypes: ['bool'], opCodes: [Opcodes.i32And] },

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
