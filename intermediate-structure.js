"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASTFunction = exports.ASTModule = void 0;
// {
//     outputType: string = ''; // function, constant, parameter, operation, etc?
//     name: string | null = null;
//     children: Array<ASTNode> = [];
// }
var ASTModule = /** @class */ (function () {
    function ASTModule() {
        this.name = null;
        this.functions = [];
    }
    return ASTModule;
}());
exports.ASTModule = ASTModule;
var ASTFunction = /** @class */ (function () {
    function ASTFunction() {
        this.name = null;
        this.words = [];
        // ops: 
    }
    return ASTFunction;
}());
exports.ASTFunction = ASTFunction;
