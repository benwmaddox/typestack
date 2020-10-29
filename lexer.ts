export class Lexer {
    tokenize(text: string): Array<string> {
        var tokens: Array<string> = [];
        var currentToken = "";
        var withinSingleQuote = false;
        var withinDoubleQuote = false;
        var withinComment = false;
        for (var i = 0; i < text.length; i++) {
            if (text[i] == "'" && !withinComment) {
                currentToken += text[i];
                withinSingleQuote = !withinSingleQuote;
            }
            else if (text[i] == "\"") {
                currentToken += text[i];
                withinDoubleQuote = !withinDoubleQuote;
            }
            else if (text[i] == "/" && text.length > i + 1 && text[i + 1] == "/") {
                withinComment = true;
            }
            else if (withinComment && text[i] == "\n") {
                withinComment = false;
            }
            else if ((text[i] == " " || text[i] == "\n" || text[i] == "\n" || text[i] == "\r")
                && !withinSingleQuote && !withinDoubleQuote) {
                if (currentToken != "") {
                    tokens.push(currentToken)
                    currentToken = "";
                }
            }
            else if (!withinComment) {
                currentToken += text[i];
            }
        }
        if (currentToken != "") {
            tokens.push(currentToken);
        }
        return tokens;
    }
}