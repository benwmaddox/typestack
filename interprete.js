var fs = require('fs');
fs.readFile( __dirname + '/sample.t', 'utf8', function(err, data){
    // console.log('loaded')
    // console.log(data)
    // console.log(__dirname)
    interprete(data);
});


var dataStack = [];
var functionStack = [];
var functionDefinitions = [];
var coreWords = {
    "emit": function(){
        var value = dataStack.pop();
        if (value[0] == "\"" && value[value.length-1] == "\""){
            value = value.substring(1, value.length-1);
        }
        console.log(value);
    },
    "dup": function(){
        var value = dataStack.pop();
        dataStack.push(value);
        dataStack.push(value);
    },
    "%": function(){
        var value2 = dataStack.pop();
        var value1 = dataStack.pop();
        dataStack.push(value1 % value2)
    }
};
function interprete(text) {
    var tokens = tokenize(text);
    runTokens(tokens);
    
    console.log({
        tokens: tokens,
        definitions: functionDefinitions,
        data: dataStack,
        functionStack: functionStack
    });  
}

function runTokens(tokens){
    var index = 0;    
    var definingFunction = false;
    while (index < tokens.length) {
        var token = tokens[index];
        if (token == ":"){
            definingFunction = true;
            var functionEqualIndex = tokens.indexOf("=", index);
            var functionEndIndex = tokens.indexOf(";", functionEqualIndex);
            if (functionEndIndex < 0){
                throw 'No ; ending for ' + tokens[index+1];
            }
            var definition = {
                name: tokens[index+1],
                types: tokens.slice(index+2, functionEqualIndex),
                bodyText: tokens.slice(functionEqualIndex+1, functionEndIndex)
            }
            functionDefinitions.push(definition);
            checkForUndefinedWords(definition.bodyText);            
            
            // runWords(definition.bodyText);
            index = functionEndIndex;
        }
        else if (token == ";"){
            definingFunction = false;
        }
        else {
            runWords([tokens[index]])
        }

        index++;
    }
}
function checkForUndefinedWords(words){
    for (var i = 0; i < words.length; i++){

        if (coreWords[words[i]] !== undefined){       
            continue;
        }
        // string type
        if (words[i][0] == "\""){
            continue;
        }
        if (!isNaN(Number(words[i]))) {
            continue;
        }
        // Existing function
        var foundWord = false;
        for (j = functionDefinitions.length-1; j >= 0; j--){
            if (words[i] == functionDefinitions[j].name){                
                foundWord = true;
                continue;
            }
        }
        if (!foundWord){
            throw 'Unknown word ' + words[i];
        }

        
    }
};
function runWords(words){    
    for (var i = 0; i < words.length; i++){

        if (coreWords[words[i]] !== undefined){
            console.log("Running " + words[i]);
            coreWords[words[i]]();            
            continue;
        }

        // Existing function
        var ranWord = false;
        for (j = functionDefinitions.length-1; j >= 0; j--){
            if (words[i] == functionDefinitions[j].name){
                functionStack.push(functionDefinitions[j]);
                console.log("Running " + functionDefinitions[j].name);
                runWords(functionDefinitions[j].bodyText);
                functionStack.pop();
                ranWord = true;
                continue;
            }
        }
        if (ranWord){
            continue;
        }

        // Value to push onto stack
        // string type
        if (words[i][0] == "\""){
            dataStack.push(words[i]);
        }
        else if (!isNaN(Number(words[i]))) {
            dataStack.push(Number(words[i]));
        }
        else {
            throw 'Unknown word ' + words[i];
        }
        
    }
}

// function runWord(word){

// }

function tokenize(text){
    var tokens = [];
    var currentToken = "";
    var withinSingleQuote = false;
    var withinDoubleQuote = false;
    var withinComment = false;
    for (var i = 0; i < text.length; i++){
        if (text[i] == "'" ){
            currentToken += text[i];
            withinSingleQuote = !withinSingleQuote;
        }
        else if (text[i] == "\"" ){
            currentToken += text[i];
            withinDoubleQuote = !withinDoubleQuote;
        }
        else if (text[i] == "/" && text.length > i+1 && text[i+1] == "/"){
            withinComment = true;
        }
        else if (withinComment && text[i] == "\n"){
            withinComment = false;
        }
        else if ((text[i] == " " || text[i] == "\n" || text[i] == "\n" || text[i] == "\r")
                && !withinSingleQuote && !withinDoubleQuote){
            if (currentToken != ""){
                tokens.push(currentToken)
                currentToken = "";
            }
        }
        else if (!withinComment)  {
            currentToken += text[i];
        }
    }
    if (currentToken != ""){
        tokens.push(currentToken);
    }
    return tokens;
}
