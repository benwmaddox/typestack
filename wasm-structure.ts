
interface ExportFunctionIds {
    typeId: number,
    functionId: number,
    exportId: number,
    codeId: number
}
interface FunctionIds {
    typeId: number,
    functionId: number,
    codeId: number
}
export class WasmSection {

}
export enum WasmType {
    i32 = 0x7F,
    i64 = 0x7E,
    f32 = 0x7D,
    f64 = 0x7C
}
export enum Opcodes {
    //https://webassembly.github.io/spec/core/binary/instructions.html
    call = 0x10,
    get_local = 0x20,
    i32Const = 0x41,
    i64Const = 0x42,
    f32Const = 0x43,
    f64Const = 0x44,
    end = 0x0b,
    i32Add = 0x6a
};

// export kind (0x00 = functionIndex, 0x01 = tableIndex, 0x02 = memory index, 0x03 = global index)
export enum ExportKind {
    function = 0x00,
    table = 0x01,
    memory = 0x02,
    global = 0x03

}
export class WasmStructure {

    wasmHeader: Array<number> = [0x00, 0x61, 0x73, 0x6d];
    wasmVersion: Array<number> = [0x01, 0x00, 0x00, 0x00];
    section = {
        custom: 0x00,
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

    // addEmitImport(): void {
    //     // Not working :( )
    //     var emitTest = [ // TODO
    //         0x08,                                        // string length
    //         0x66, 0x75, 0x6e, 0x63, 0x74, 0x69, 0x6f, 0x6e,                      //function  ; import module name
    //         0x04,                                       // ; string length
    //         0x65, 0x6d, 0x69, 0x74,                                //emit  ; import field name
    //         0x00,                                       // ; import kind
    //         0x00,                                       // ; import signature index
    //         0x11                                       // ; FIXUP section size
    //     ];
    //     for (var i = 0; i < emitTest.length; i++) {
    //         this.imports.push(emitTest[i]);
    //     }
    // }

    importId = 0;
    addImport(importModule: string, importField: string, internalName: string, parameters: Array<WasmType>, result: WasmType | null): number {
        var data: Array<number> = [];

        // TODO: ...

        for (var i = 0; i < data.length; i++) {
            this.imports.push(data[i]);
        }
        return this.importId++;
    }

    // Return ID
    typeId = 0;
    addFunctionType(parameters: Array<WasmType>, result: WasmType | null): number {
        var data: Array<number> = [0x60,
            parameters.length,
            ...parameters
        ];
        if (result != null) {
            data.push(1);
            data.push(result);
        }

        for (var i = 0; i < data.length; i++) {
            this.types.push(data[i]);
        }

        return this.typeId++;
    }

    functionIndex = 0;
    addFunction(): number {
        this.functions.push(this.functionIndex);
        return this.functionIndex++;
    }

    stringToUTF8(text: string): Array<number> {
        var results: Array<number> = [];
        // TODO: I need better handlings of this. 
        for (var i = 0; i < text.length; i++) {
            results.push(text.charCodeAt(i));
        }
        return results;
        // return new TextEncoder().encode(text);
    }
    exportId = 0;
    addExport(exportName: string, exportKind: ExportKind, index: number): number {
        var nameUtf8 = this.stringToUTF8(exportName);

        // length of subsequent string
        this.exports.push(nameUtf8.length);
        // string bytes from name
        for (var i = 0; i < nameUtf8.length; i++) {
            this.exports.push(nameUtf8[i]);
        }
        this.exports.push(exportKind);
        // export index of this export kind
        this.exports.push(index);

        return this.exportId++;
    }

    codeId = 0;
    addCode(values: Array<number>): number {
        this.codeSections.push(values.length); // each item gets the length defined
        for (var i = 0; i < values.length; i++) {
            this.codeSections.push(values[i]);
        }
        return this.codeId++;
    }

    AddFunctionDetails(parameters: Array<WasmType>, result: WasmType | null, functionBody: Array<number>): FunctionIds {
        var typeId = this.addFunctionType(parameters, result);
        var functionId = this.addFunction();
        var declCount = 0;
        var codeId = this.addCode([declCount, ...functionBody, Opcodes.end]);
        return {
            typeId: typeId,
            functionId: functionId,
            codeId: codeId
        }
    }

    AddExportFunction(exportName: string, parameters: Array<WasmType>, result: WasmType | null, functionBody: Array<number>): ExportFunctionIds {
        var typeId = this.addFunctionType(parameters, result);
        var functionId = this.addFunction();
        var exportId = this.addExport(exportName, ExportKind.function, functionId);
        var declCount = 0;
        var codeId = this.addCode([declCount, ...functionBody, Opcodes.end]);
        return {
            typeId: typeId,
            functionId: functionId,
            exportId: exportId,
            codeId: codeId
        }
    }

    customSection: Array<number> = [];
    types: Array<number> = [];
    imports: Array<number> = [];
    functions: Array<number> = [];
    codeSections: Array<number> = [];
    exports: Array<number> = [];
    formatSectionForWasm(SectionID: number, bytes: Array<number>): Array<number> {

        var u32Length = bytes.length + 1;// this.toBytesInt32(bytes.length + 1)

        return bytes.length > 0 ?
            [SectionID,
                u32Length,
                ...bytes] : [];
    }
    // formatSectionForWasmWithCount(SectionID: number, count: number, bytes: Array<number>): Array<number> {
    //     return bytes.length > 0 ?
    //         [SectionID,
    //             count,
    //             ...bytes] : [];
    // }
    toBytesInt32(value: number) {
        // var result = new Uint8Array([
        //     (value & 0xff000000) >> 24,
        //     (value & 0x00ff0000) >> 16,
        //     (value & 0x0000ff00) >> 8,
        //     (value & 0x000000ff)
        // ]);


        // return result.buffer;
        return [
            (value & 0xff000000) >> 24,
            (value & 0x00ff0000) >> 16,
            (value & 0x0000ff00) >> 8,
            (value & 0x000000ff)
        ];
    }
    formatCodeSection() {

    }
    formatSectionForWasmWithSizeAndCount(SectionID: number, count: number, bytes: Array<number>): Array<number> {

        var u32Length = bytes.length + 1;//this.toBytesInt32(bytes.length + 1)
        // var u32Length = new Uint32Array([bytes.length + 1]);
        // var u8Length = Uint8Array.from(u32Length);
        // for (var i = 0; i < u32Length.byteLength; i++) {
        //     // console.log(u32Length.buffer[i])
        // }
        // console.log(u32Length.buffer);
        return bytes.length > 0 ?
            [SectionID,
                u32Length,
                count,
                ...bytes] : [];
    }
    getBytes(): Uint8Array {
        var results = Uint8Array.from(
            [
                ...this.wasmHeader,
                ...this.wasmVersion,

                // TODO Custom

                ...this.formatSectionForWasmWithSizeAndCount(this.section.type, this.typeId, this.types),
                ...this.formatSectionForWasmWithSizeAndCount(this.section.function, this.functionIndex, this.functions),

                // TODO Table
                // TODO Memory
                // TODO Global
                ...this.formatSectionForWasmWithSizeAndCount(this.section.import, this.importId, this.imports),

                ...this.formatSectionForWasmWithSizeAndCount(this.section.export, this.exportId, this.exports),
                // TODO Start
                // TODO Elem
                // TODO Code
                ...this.formatSectionForWasmWithSizeAndCount(this.section.code, this.codeId, this.codeSections),
                // TODO Data

            ]
        );

        return results;
    }
}


// export class WasmStructure {





//     private typeId: number = 0;

//     wasmHeader: Array<number> = [0x00, 0x61, 0x73, 0x6d];
//     wasmVersion: Array<number> = [0x01, 0x00, 0x00, 0x00];
//     opcodes = {
//         call: 0x10,
//         get_local: 0x20,
//         const: 0x43,
//         end: 0x0b
//     };
//     section = {
//         type: 0x01,
//         import: 0x02,
//         function: 0x03,
//         table: 0x04,
//         memory: 0x05,
//         global: 0x06,
//         export: 0x07,
//         start: 0x08,
//         elem: 0x09,
//         code: 0x0A,
//         data: 0x0B
//     }
//     valueType = {
//         i32: 0x7F,
//         i64: 0x7E,
//         f32: 0x7D,
//         f64: 0x7C
//     }

//     encodeRunType() {
//         var numberOfParameters = 1; // any number
//         var nubmerOfResults = 0; // 0 or 1?
//         return [
//             this.typeId++,
//             numberOfParameters,
//             nubmerOfResults
//         ]
//     }


//     tokenize(text: string): Array<string> {
//         var tokens: Array<string> = [];
//         var currentToken = "";
//         var withinSingleQuote = false;
//         var withinDoubleQuote = false;
//         var withinComment = false;
//         for (var i = 0; i < text.length; i++) {
//             if (text[i] == "'") {
//                 currentToken += text[i];
//                 withinSingleQuote = !withinSingleQuote;
//             }
//             else if (text[i] == "\"") {
//                 currentToken += text[i];
//                 withinDoubleQuote = !withinDoubleQuote;
//             }
//             else if (text[i] == "/" && text.length > i + 1 && text[i + 1] == "/") {
//                 withinComment = true;
//             }
//             else if (withinComment && text[i] == "\n") {
//                 withinComment = false;
//             }
//             else if ((text[i] == " " || text[i] == "\n" || text[i] == "\n" || text[i] == "\r")
//                 && !withinSingleQuote && !withinDoubleQuote) {
//                 if (currentToken != "") {
//                     tokens.push(currentToken)
//                     currentToken = "";
//                 }
//             }
//             else if (!withinComment) {
//                 currentToken += text[i];
//             }
//         }
//         if (currentToken != "") {
//             tokens.push(currentToken);
//         }
//         return tokens;
//     }

//     compile(text: string) {
//         var tokens = this.tokenize(text);
//         console.log(tokens);

//         var runType = this.encodeRunType();
//         var types = [
//             // run signature
//             this.section.type,
//             0,
//             1, // number of types, figure this out
//             ...runType,
//         ];
//         types.push(types.length);// Add type FIXUP

//         var importBytes: Array<number> = [ // TODO
//             0x08,                                        // string length
//             0x66, 0x75, 0x6e, 0x63, 0x74, 0x69, 0x6f, 0x6e,                      //function  ; import module name
//             0x04,                                       // ; string length
//             0x65, 0x6d, 0x6974,                                //emit  ; import field name
//             0x00,                                       // ; import kind
//             0x00,                                       // ; import signature index
//             0x11                                       // ; FIXUP section size
//         ];
//         var imports = [
//             this.section.import,
//             0,
//             1, // number of imports
//             importBytes.length,
//             ...importBytes
//         ];
//         var functionBytes: Array<number> = [
//             // run 
//         ];
//         var functions = [
//             this.section.function,
//             functionBytes.length,
//             ...functionBytes
//         ];
//         var codeDefinitions: Array<number> = [

//         ];
//         var runIndex = 1; // find index of run function
//         var startSection = [
//             this.section.start,
//             1, // size of next value...
//             runIndex
//         ]

//         return Uint8Array.from([
//             ...this.wasmHeader,
//             ...this.wasmVersion,
//             // ...types,
//             ...imports,
//             ...functions,
//             ...codeDefinitions,
//             // ...startSection
//         ]);
//     }
// }