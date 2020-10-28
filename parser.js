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
        var functionEnd = 0;
        while (i < tokens.length) {
            if (tokens[i] == "fn" && i > functionEnd) {
                var func = this.ParseFunction(tokens.slice(functionEnd, i));
                functionEnd = i;
                module.functions.push(func);
            }
            i++;
        }
        ;
        var func = this.ParseFunction(tokens.slice(functionEnd, i));
        functionEnd = i;
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
