import { ASTFunction, ASTImport, ASTModule } from './intermediate-structure';

export class Parser {
    ParseModule(name: string, tokens: Array<string>): ASTModule {
        var module = new ASTModule();

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
        };
        var func = this.ParseFunction(tokens.slice(functionEnd, i));
        functionEnd = i;
        module.functions.push(func);

        return module;
    }

    ParseFunction(tokens: Array<string>): ASTFunction {
        var func = new ASTFunction();
        func.words = tokens;


        return func;
    }

}