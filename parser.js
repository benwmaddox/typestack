"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
var intermediate_structure_1 = require("./intermediate-structure");
var Parser = /** @class */ (function () {
    function Parser() {
    }
    Parser.prototype.ParseModule = function (name, tokens) {
        var module = new intermediate_structure_1.ASTModule();
        module.name = name;
        module.imports = [];
        var i = 0;
        var previousFunctionEnd = 0;
        while (i < tokens.length) {
            if (tokens[i] == "fn" && i > previousFunctionEnd) {
                var end = (tokens.lastIndexOf(";", i) + 1) || i;
                var func = this.ParseFunction(tokens.slice(previousFunctionEnd, end));
                previousFunctionEnd = (tokens.lastIndexOf(";", i) + 1) || i;
                module.functions.push(func);
            }
            i++;
        }
        ;
        var end = (tokens.lastIndexOf(";", i) + 1) || i;
        var func = this.ParseFunction(tokens.slice(previousFunctionEnd, end));
        module.functions.push(func);
        return module;
    };
    Parser.prototype.ParseFunction = function (tokens) {
        var func = new intermediate_structure_1.ASTFunction();
        func.words = tokens;
        return func;
    };
    return Parser;
}());
exports.Parser = Parser;
