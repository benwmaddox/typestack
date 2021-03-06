"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = exports.ASTFunction = exports.ASTImport = exports.ASTModule = void 0;
var ASTModule = /** @class */ (function () {
    function ASTModule() {
        this.name = null;
        this.functions = [];
        this.imports = [];
    }
    return ASTModule;
}());
exports.ASTModule = ASTModule;
var ASTImport = /** @class */ (function () {
    function ASTImport() {
        this.module = null;
        this.name = null;
    }
    return ASTImport;
}());
exports.ASTImport = ASTImport;
var ASTFunction = /** @class */ (function () {
    function ASTFunction() {
        this.name = null;
        this.parameters = [];
        this.result = null;
        this.words = [];
        this.actions = [];
        this.shouldExport = false;
        // ops: 
    }
    return ASTFunction;
}());
exports.ASTFunction = ASTFunction;
var ConstantType;
(function (ConstantType) {
    ConstantType[ConstantType["int"] = 0] = "int";
    ConstantType[ConstantType["long"] = 1] = "long";
    ConstantType[ConstantType["float"] = 2] = "float";
    ConstantType[ConstantType["double"] = 3] = "double";
})(ConstantType || (ConstantType = {}));
var Context = /** @class */ (function () {
    function Context() {
        this.children = [];
        this.unparsedWords = [];
        this.ops = undefined;
    }
    return Context;
}());
exports.Context = Context;
