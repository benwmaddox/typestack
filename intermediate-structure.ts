type ASTNode = ASTModule
    | ASTFunction;


export class ASTModule {
    name: string | null = null;
    functions: Array<ASTFunction> = [];
    imports: Array<ASTImport> = []
}

export class ASTImport {
    module: string | null = null;
    name: string | null = null;
}

export class ASTFunction {
    name: string | null = null;
    parameters: Array<ASTParameter> = [];
    results: Array<number> = [];
    words: Array<string> = [];

    actions: Array<ASTAction> = [];
    // ops: 
}

type ASTParameter = { name: string, type: string };
enum ConstantType { "int", "long", "float", "double" }
type FunctionType = { name: string, id: Number }
type OpsType = { name: string } // operation type // TODO: type checking

type ASTAction =
    | [ConstantType, number]
    | [FunctionType]
    | [OpsType];
