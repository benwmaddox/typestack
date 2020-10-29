import { ASTFunction, ASTImport, ASTModule } from './intermediate-structure';

export class Parser {
    ParseModule(name: string, tokens: Array<string>): ASTModule {
        var module = new ASTModule();

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
        };

        var end = (tokens.lastIndexOf(";", i) + 1) || i;
        var func = this.ParseFunction(tokens.slice(previousFunctionEnd, end));
        module.functions.push(func);

        return module;
    }

    ParseFunction(tokens: Array<string>): ASTFunction {
        var func = new ASTFunction();
        func.words = tokens;


        return func;
    }

}