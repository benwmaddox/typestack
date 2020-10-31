import { Opcodes } from './wasm-structure';
import { ASTFunction, ASTImport, ASTModule, FunctionParser, ModuleParser, ASTParameter } from './intermediate-structure';
import { match } from 'assert';

export var BaseContext = {
    "export": { inputTypes: undefined, outputTypes: undefined, OpsCodes: undefined },
    "fn": { inputTypes: undefined, outputTypes: undefined, OpsCodes: undefined, newContext: true },
    ";": { inputTypes: undefined, outputTypes: undefined, OpsCodes: [Opcodes.end], popContext: true },
    '+': { inputTypes: ['int', 'int'], outputTypes: ['int'], OpsCodes: [Opcodes.i32Add] },
    '*': { inputTypes: ['int', 'int'], outputTypes: ['int'], OpsCodes: [Opcodes.i32Mul] },
    '-': { inputTypes: ['int', 'int'], outputTypes: ['int'], OpsCodes: [Opcodes.i32Sub] },
    '<': { inputTypes: ['int', 'int'], outputTypes: ['int'], OpsCodes: [Opcodes.i32LessThanSigned] },
    '==': { inputTypes: ['int', 'int'], outputTypes: ['bool'], OpsCodes: [Opcodes.i32Equals] },
    '==0': { inputTypes: ['int'], outputTypes: ['bool'], OpsCodes: [Opcodes.i32EqualsZero] },
    '&&': { inputTypes: ['int', 'int'], outputTypes: ['bool'], OpsCodes: [Opcodes.i32And] }
};

export class ContextParser {
    parse(context: any, words: Array<string>): any {
        return {};
    }
}
