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
    result: ASTResult | null = null;
    words: Array<string> = [];

    actions: Array<ASTAction> = [];


    shouldExport: boolean = false;
    // ops: 
}

export type ASTParameter = { name: string, type: string };
export type ASTResult = { type: string };
enum ConstantType { "int", "long", "float", "double" }
type FunctionType = { name: string, id: Number }
type OpsType = { name: string } // operation type // TODO: type checking

type ASTAction =
    | [ConstantType, number]
    | [FunctionType]
    | [OpsType];

// type ErrorMessage = { name: string, description: string };
export type FunctionParser = (input: ASTFunction) => ASTFunction;// | ErrorMessage;
export type ModuleParser = (input: ASTFunction) => ASTFunction;// | ErrorMessage;
