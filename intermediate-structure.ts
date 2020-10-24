class ASTNode {
    outputType: string = ''; // function, constant, parameter, operation, etc?
    name: string | null = null;
    children: Array<ASTNode> = [];
}