var fs = require('fs');
fs.readFile(__dirname + '/sample2.t', 'utf8', function (err, data) {
    // console.log('loaded')
    // console.log(data)
    // console.log(__dirname)
    var bytes = compile(data);
    console.log(bytes);
    runWasm(bytes);
});


var dataStack = [];
var functionStack = [];
var functionDefinitions = [];

async function runWasm(bytes) {
    var importObject = {
        function: {
            emit: function (value) {
                console.log(value);
            }
        }
    };
    const instance = await WebAssembly.instantiate(bytes, importObject).then(results => {
        console.log(results);
        console.log(results.instance.exports);
    })
    // console.log(instance.exports.run());
    // instance.
}
var coreWords = {
    "emit": function () {
        var value = dataStack.pop();
        if (value[0] == "\"" && value[value.length - 1] == "\"") {
            value = value.substring(1, value.length - 1);
        }
        console.log(value);
    },
    "dup": function () {
        var value = dataStack.pop();
        dataStack.push(value);
        dataStack.push(value);
    },
    "%": function () {
        var value2 = dataStack.pop();
        var value1 = dataStack.pop();
        dataStack.push(value1 % value2)
    }
};

const wasmHeader = [0x00, 0x61, 0x73, 0x6d];
const wasmVersion = [0x01, 0x00, 0x00, 0x00];
const opcodes = {
    call: 0x10,
    get_local: 0x20,
    const: 0x43,
    end: 0x0b
};
//https://medium.com/@CoinExChain/wasm-introduction-part-1-binary-format-57895d851580

//https://webassembly.github.io/wabt/demo/wat2wasm/
/* (module
  (import "function" "emit" (func $log (param i32)))
  (func (export "run") 
    
    ))

    */
const section = {
    type: 0x01,
    import: 0x02,
    function: 0x03,
    table: 0x04,
    memory: 0x05,
    global: 0x06,
    export: 0x07,
    start: 0x08,
    elem: 0x09,
    code: 0x0A,
    data: 0x0B
}
const valueType = {
    i32: 0x7F,
    i64: 0x7E,
    f32: 0x7D,
    f64: 0x7C
}
var typeId = 0;
function encodeRunType() {
    var numberOfParameters = 1; // any number
    var nubmerOfResults = 0; // 0 or 1?
    return [
        typeId++,
        numberOfParameters,
        nubmerOfResults
    ]
}
function compile(text) {
    var tokens = tokenize(text);
    console.log(tokens);

    var runType = encodeRunType();
    var types = [
        // run signature
        section.type,
        0,
        1, // number of types, figure this out
        ...runType,
    ];
    types.push(types.length);// Add type FIXUP

    var importBytes = [ // TODO
        0x08,                                        // string length
        0x66, 0x75, 0x6e, 0x63, 0x74, 0x69, 0x6f, 0x6e,                      //function  ; import module name
        0x04,                                       // ; string length
        0x65, 0x6d, 0x6974,                                //emit  ; import field name
        0x00,                                       // ; import kind
        0x00,                                       // ; import signature index
        0x11                                       // ; FIXUP section size
    ];
    var imports = [
        section.import,
        0,
        1, // number of imports
        importBytes.length,
        ...importBytes
    ];
    var functionBytes = [
        // run 
    ];
    var functions = [
        section.function,
        functionBytes.length,
        ...functionBytes
    ];
    var codeDefinitions = [

    ];
    var runIndex = 1; // find index of run function
    var startSection = [
        section.start,
        1, // size of next value...
        runIndex
    ]

    return Uint8Array.from([
        ...wasmHeader,
        ...wasmVersion,
        // ...types,
        ...imports,
        ...functions,
        ...codeDefinitions,
        // ...startSection
    ]);
}

function runTokens(tokens) {
    var index = 0;
    var definingFunction = false;
    while (index < tokens.length) {
        var token = tokens[index];
        if (token == "fn") {
            definingFunction = true;
            var functionEqualIndex = tokens.indexOf("=", index);
            var functionEndIndex = tokens.indexOf(";", functionEqualIndex);
            if (functionEndIndex < 0) {
                throw 'No ; ending for ' + tokens[index + 1];
            }
            var definition = {
                name: tokens[index + 1],
                types: tokens.slice(index + 2, functionEqualIndex),
                bodyText: tokens.slice(functionEqualIndex + 1, functionEndIndex)
            }
            functionDefinitions.push(definition);
            checkForUndefinedWords(definition.bodyText);

            // runWords(definition.bodyText);
            index = functionEndIndex;
        }
        else if (token == ";") {
            definingFunction = false;
        }
        else {
            runWords([tokens[index]])
        }

        index++;
    }
}

function checkForUndefinedWords(words) {
    for (var i = 0; i < words.length; i++) {

        if (coreWords[words[i]] !== undefined) {
            continue;
        }
        // string type
        if (words[i][0] == "\"") {
            continue;
        }
        if (!isNaN(Number(words[i]))) {
            continue;
        }
        // Existing function
        var foundWord = false;
        for (j = functionDefinitions.length - 1; j >= 0; j--) {
            if (words[i] == functionDefinitions[j].name) {
                foundWord = true;
                continue;
            }
        }
        if (!foundWord) {
            throw 'Unknown word ' + words[i];
        }


    }
};
function runWords(words) {
    for (var i = 0; i < words.length; i++) {

        if (coreWords[words[i]] !== undefined) {
            console.log("Running " + words[i]);
            coreWords[words[i]]();
            continue;
        }

        // Existing function
        var ranWord = false;
        for (j = functionDefinitions.length - 1; j >= 0; j--) {
            if (words[i] == functionDefinitions[j].name) {
                functionStack.push(functionDefinitions[j]);
                console.log("Running " + functionDefinitions[j].name);
                runWords(functionDefinitions[j].bodyText);
                functionStack.pop();
                ranWord = true;
                continue;
            }
        }
        if (ranWord) {
            continue;
        }

        // Value to push onto stack
        // string type
        if (words[i][0] == "\"") {
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


function tokenize(text) {
    var tokens = [];
    var currentToken = "";
    var withinSingleQuote = false;
    var withinDoubleQuote = false;
    var withinComment = false;
    for (var i = 0; i < text.length; i++) {
        if (text[i] == "'") {
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
