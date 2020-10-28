type ASTNode = ASTModule
    | ASTFunction;
// {
//     outputType: string = ''; // function, constant, parameter, operation, etc?
//     name: string | null = null;
//     children: Array<ASTNode> = [];
// }

export class ASTModule {
    name: string | null = null;
    functions: Array<ASTFunction> = [];
}

export class ASTFunction {
    name: string | null = null;
    words: Array<string> = [];
    // ops: 
}

