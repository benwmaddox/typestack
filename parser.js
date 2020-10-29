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
        func = extractName(func);
        func = extractParameters(func);
        func = extractResults(func);
        // TODO: collect error messages 
        return func;
    };
    return Parser;
}());
exports.Parser = Parser;
var extractName = function (item) {
    var fnIndex = item.words.indexOf("fn");
    item.name = item.words[fnIndex + 1];
    if (item.name[0] == "'") {
        item.name = item.name.substring(1, item.name.length - 1);
    }
    return item;
};
var extractResults = function (input) {
    var tokens = input.words;
    var index = 0;
    var fnIndex = tokens.indexOf("fn", index);
    var functionEqualIndex = tokens.indexOf("=", index);
    if (functionEqualIndex < 0) {
        throw new Error('No = for function ' + tokens[index + 1]);
    }
    var functionEndIndex = tokens.indexOf(";", functionEqualIndex);
    if (functionEndIndex < 0) {
        throw new Error('No ; ending for ' + tokens[index + 1]);
    }
    var additionalParameters = tokens.slice(fnIndex + 2, functionEqualIndex);
    for (var i = 0; i < additionalParameters.length; i++) {
        var item = additionalParameters[i];
        if (item.indexOf(':') == -1) {
            input.results.push({ type: item });
        }
    }
    return input;
};
var extractParameters = function (input) {
    var tokens = input.words;
    var index = 0;
    var fnIndex = tokens.indexOf("fn", index);
    var functionEqualIndex = tokens.indexOf("=", index);
    if (functionEqualIndex < 0) {
        throw new Error('No = for function ' + tokens[index + 1]);
    }
    var functionEndIndex = tokens.indexOf(";", functionEqualIndex);
    if (functionEndIndex < 0) {
        throw new Error('No ; ending for ' + tokens[index + 1]);
    }
    var parameters = buildParameterList(tokens[fnIndex + 1].substring(1, tokens[fnIndex + 1].length - 1));
    var additionalParameters = tokens.slice(fnIndex + 2, functionEqualIndex - 1);
    for (var i = 0; i < additionalParameters.length; i++) {
        var item = additionalParameters[i];
        if (item.indexOf(':') != -1) {
            parameters.push({
                name: item.split(":")[0],
                type: item.split(":")[1]
            });
        }
    }
    input.parameters = parameters;
    return input;
};
function buildParameterList(input) {
    var index = 0;
    var regex = new RegExp('{(.+?):(.+?)}');
    var regexResult = regex.exec(input.substr(index));
    var result = [];
    while (regexResult !== null) {
        result.push({
            name: regexResult[1],
            type: regexResult[2]
        });
        index += regexResult.index + regexResult[0].length;
        regexResult = regex.exec(input.substr(index));
    }
    return result;
}
