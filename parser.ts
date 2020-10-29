import { ASTFunction, ASTImport, ASTModule, FunctionParser, ModuleParser, ASTParameter } from './intermediate-structure';
import { match } from 'assert';

export class Parser {
    parseModule(name: string, tokens: Array<string>): ASTModule {
        var module = new ASTModule();

        module.name = name;
        module.imports = [];

        var i = 0;
        var previousFunctionEnd = 0;
        while (i < tokens.length) {
            if (tokens[i] == "fn" && i > previousFunctionEnd) {
                var end = (tokens.lastIndexOf(";", i) + 1) || i;
                var func = this.parseFunction(tokens.slice(previousFunctionEnd, end));
                previousFunctionEnd = (tokens.lastIndexOf(";", i) + 1) || i;
                module.functions.push(func);
            }
            i++;
        };

        var end = (tokens.lastIndexOf(";", i) + 1) || i;
        var func = this.parseFunction(tokens.slice(previousFunctionEnd, end));
        module.functions.push(func);

        return module;
    }

    parseFunction(tokens: Array<string>): ASTFunction {
        var func = new ASTFunction();
        func.words = tokens;

        func = extractName(func);
        func = extractParameters(func);
        func = extractResults(func);

        // Change words:

        // start with first, try to find matching scoped value, then user defined function, then user macro, then compiler action matching that word
        // After each iteration, return Actions and unparsed words. Those will be picked up by next iteration


        // TODO: collect error messages 

        return func;
    }

}

var extractName: FunctionParser = (item: ASTFunction) => {
    var fnIndex = item.words.indexOf("fn");
    item.name = item.words[fnIndex + 1];
    if (item.name[0] == "'") {
        item.name = item.name.substring(1, item.name.length - 1)
    }
    return item;
}

var extractResults: FunctionParser = (input: ASTFunction) => {
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
}


var extractParameters: FunctionParser = (input: ASTFunction) => {
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
}



type Parameter = { name: string, type: string };
function buildParameterList(input: string): Array<ASTParameter> {
    var index = 0;
    var regex = new RegExp('{(.+?):(.+?)}');
    var regexResult = regex.exec(input.substr(index));
    var result: Array<Parameter> = [];
    while (regexResult !== null) {
        result.push({
            name: regexResult[1],
            type: regexResult[2]
        })

        index += regexResult.index + regexResult[0].length;
        regexResult = regex.exec(input.substr(index));

    }
    return result;
}