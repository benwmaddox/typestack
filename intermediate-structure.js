"use strict";
var ASTNode = /** @class */ (function () {
    function ASTNode() {
        this.outputType = ''; // function, constant, parameter, operation, etc?
        this.name = null;
        this.children = [];
    }
    return ASTNode;
}());
