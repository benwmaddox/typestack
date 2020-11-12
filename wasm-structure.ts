
export interface ExportFunctionIds {
    typeId: number,
    functionId: number,
    exportId: number,
    codeId: number
}
export interface FunctionIds {
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
    blockType = 0x40,
    unreachable = 0x00,
    nop = 0x01,
    blockIn = 0x02, // block [blocktype instruction*] end
    blockLoop = 0x03, // loop [blocktype instruction*] end
    blockIf = 0x04, // if [blocktype instruction*] end
    else = 0x05, // blockif [blocktype instruction*] else [instruction*] end
    labelIndex = 0x0C,
    labelIfIndex = 0x0D,
    umm = 0x0E,
    return = 0x0F,
    call = 0x10,
    callIndirect = 0x11, // 0x00 then index

    // Parametric
    drop = 0x1A,
    select = 0x1B,

    // variable
    get_local = 0x20,
    set_local = 0x21,
    tee_local = 0x22,
    get_global = 0x23,
    set_global = 0x24,

    // memory
    i32Load = 0x28,
    i64Load = 0x29,
    f32Load = 0x2A,
    f64Load = 0x2B,
    i32Load8_s = 0x2C,
    i32Load8_u = 0x2D,
    i32Load16_s = 0x2E,
    i32Load16_u = 0x2F,
    i64Load8_s = 0x30,
    i64Load8_u = 0x31,
    i64Load16_s = 0x32,
    i64Load16_u = 0x33,
    i64Load32_s = 0x34,
    i64Load32_u = 0x35,
    i32Store = 0x36,
    i64Store = 0x37,
    f32Store = 0x38,
    f64Store = 0x39,
    i32Store8 = 0x3A,
    i32Store16 = 0x3B,
    i64Store8 = 0x3C,
    i64Store16 = 0x3D,
    i64Store32 = 0x3E,
    memorySize = 0x3F, // with size
    memoryGrow = 0x40,

    // numeric - immediate value following
    i32Const = 0x41,
    i64Const = 0x42,
    f32Const = 0x43,
    f64Const = 0x44,

    // numeric - without immediate values
    i32eqz = 0x45,
    i32eq = 0x46,
    i32ne = 0x47,
    i32lt_s = 0x48,
    i32lt_u = 0x49,
    i32gt_s = 0x4A,
    i32gt_u = 0x4B,
    i32le_s = 0x4C,
    i32le_u = 0x4D,
    i32ge_s = 0x4E,
    i32ge_u = 0x4F,

    i64eqz = 0x50,
    i64eq = 0x51,
    i64ne = 0x52,
    i64lt_s = 0x53,
    i64lt_u = 0x54,
    i64gt_s = 0x55,
    i64gt_u = 0x56,
    i64le_s = 0x57,
    i64le_u = 0x58,
    i64ge_s = 0x59,
    i64ge_u = 0x5A,

    f32eq = 0x5B,
    f32ne = 0x5C,
    f32lt = 0x5D,
    f32gt = 0x5E,
    f32le = 0x5F,
    f32ge = 0x60,

    f64eq = 0x61,
    f64ne = 0x62,
    f64lt = 0x63,
    f64gt = 0x64,
    f64le = 0x65,
    f64ge = 0x66,

    i32clz = 0x67,
    i32ctz = 0x68,
    i32popcnt = 0x69,
    i32add = 0x6A,
    i32sub = 0x6B,
    i32mul = 0x6C,
    i32div_s = 0x6D,
    i32div_u = 0x6E,
    i32rem_s = 0x6F,
    i32rem_u = 0x70,
    i32and = 0x71,
    i32or = 0x72,
    i32xor = 0x73,
    i32shl = 0x74,
    i32shr_s = 0x75,
    i32shr_u = 0x76,
    i32rotl = 0x77,
    i32rotr = 0x78,


    i64clz = 0x79,
    i64ctz = 0x7A,
    i64popcnt = 0x7B,
    i64add = 0x7C,
    i64sub = 0x7D,
    i64mul = 0x7E,
    i64div_s = 0x7F,
    i64div_u = 0x80,
    i64rem_s = 0x81,
    i64rem_u = 0x82,
    i64and = 0x83,
    i64or = 0x84,
    i64xor = 0x85,
    i64shl = 0x86,
    i64shr_s = 0x87,
    i64shr_u = 0x88,
    i64rotl = 0x89,
    i64rotr = 0x8A,

    f32abs = 0x8B,
    f32neg = 0x8C,
    f32ceil = 0x8D,
    f32floor = 0x8E,
    f32trunc = 0x8F,
    f32nearest = 0x90,
    f32sqrt = 0x91,
    f32add = 0x92,
    f32sub = 0x93,
    f32mul = 0x94,
    f32div = 0x95,
    f32min = 0x96,
    f32max = 0x97,
    f32copysign = 0x98,


    f64abs = 0x99,
    f64neg = 0x9A,
    f64ceil = 0x9B,
    f64floor = 0x9C,
    f64trunc = 0x9D,
    f64nearest = 0x9E,
    f64sqrt = 0x9F,
    f64add = 0xA0,
    f64sub = 0xA1,
    f64mul = 0xA2,
    f64div = 0xA3,
    f64min = 0xA4,
    f64max = 0x45,
    f64copysign = 0xA6,

    i32wrap_i64 = 0xA7,
    i32trunc_f32_s = 0xA8,
    i32trunc_f32_u = 0xA9,
    i32trunc_f64_s = 0xAA,
    i32trunc_f64_u = 0xAB,
    i64extend_i32_s = 0xAC,
    i64extend_i32_u = 0xAD,
    i64trunc_f32_s = 0xAE,
    i64trunc_f32_u = 0xAF,
    i64trunc_f64_s = 0xB0,
    i64trunc_f64_u = 0xB1,
    f32convert_i32_s = 0xB2,
    f32convert_i32_u = 0xB3,
    f32convert_i64_s = 0xB4,
    f32convert_i64_u = 0xB5,
    f32demote_f64 = 0xB6,
    f64convert_i32_s = 0xB7,
    f64convert_i32_u = 0xB8,
    f64convert_i64_s = 0xB9,
    f64convert_i64_u = 0xBA,
    f64promote_f32 = 0xBB,
    i32reinterpret_f32 = 0xBC,
    i64reinterpret_f64 = 0xBD,
    f32reinterpret_i32 = 0xBE,
    f64reinterpret_i64 = 0xBF,
    i32extend8_s = 0xC0,
    i32extend16_s = 0xC1,
    i64extend8_s = 0xC2,
    i64extend16_s = 0xC3,
    i64extend32_s = 0xC4,

    // saturation truncation - 1 byte prefix
    i32tunc_sat = 0xFC, /* 
    0 = i32_f32_s
    1 = i32_f32_u
    2 = i32_f64_s
    3 = i32_f64_u
    4 = 64_f32_s
    5 = 64_f32_u
    6 = 64_f64_s
    7 = 64_f64_u    
    */



    end = 0x0b // expression end. function body

};

// export kind (0x00 = functionIndex, 0x01 = tableIndex, 0x02 = memory index, 0x03 = global index)
export enum ExportKind {
    function = 0x00,
    table = 0x01,
    memory = 0x02,
    global = 0x03

}


function toBytesInt32(value: number) {


    return [
        (value & 0xff000000) >> 24,
        (value & 0x00ff0000) >> 16,
        (value & 0x0000ff00) >> 8,
        (value & 0x000000ff)
    ];
}

export function toUnsignedLEB128(value: number): Array<number> {
    // var bytes8 = toBytesInt32(value);
    var bytesLEB = [];

    var currentValue = value;
    while (currentValue > 0 || bytesLEB.length === 0) {
        var tmp = (currentValue & 0x0000007F); // 7 bits at true
        currentValue = currentValue >> 7;
        if (currentValue > 0) {
            tmp = (tmp | 0x00000080);
        }
        bytesLEB.push(tmp);
    }
    return bytesLEB;
}
export function toSignedLEB128(value: number): Array<number> {
    // https://en.wikipedia.org/wiki/LEB128
    value |= 0;
    const result = [];
    while (true) {
        const byte = value & 0x7f;
        value >>= 7;
        if (
            (value === 0 && (byte & 0x40) === 0) ||
            (value === -1 && (byte & 0x40) !== 0)
        ) {
            result.push(byte);
            return result;
        }
        result.push(byte | 0x80);
    }
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
    addMemoryImport(importModule: string, importField: string, pageCount: number) {

        // this.im
        // return this.importId++;

        console.log(`Adding memory import: ${importModule}, ${importField}, ${pageCount}`)
        var declCount = 0;

        var data: Array<number> = [];
        var importModuleUtf8 = this.stringToUTF8(importModule);
        // length of subsequent string
        data.push(importModuleUtf8.length);
        // string bytes from name
        for (var i = 0; i < importModuleUtf8.length; i++) {
            data.push(importModuleUtf8[i]);
        }

        var importFieldUtf8 = this.stringToUTF8(importField);
        // length of subsequent string
        data.push(importFieldUtf8.length);
        // string bytes from name
        for (var i = 0; i < importFieldUtf8.length; i++) {
            data.push(importFieldUtf8[i]);
        }

        data.push(0x02); // memory import kind
        data.push(0x00); // limits: flags
        data.push(...toUnsignedLEB128(pageCount)); // initial size
        // 0000012: 02; string length
        // 0000013: 6a73                                     js; import module name
        // 0000015: 06; string length
        // 0000016: 6d65 6d6f 7279                           memory; import field name
        // 000001c: 02; import kind
        // 000001d: 00; limits: flags
        // 000001e: 01; limits: initial

        for (var i = 0; i < data.length; i++) {
            this.imports.push(data[i]);
        }
        console.log(data.map(x => x.toString(16)));
        // this.importId++
        return this.importId++;
    }

    importId = 0;
    addImportFunction(importModule: string, importField: string, internalName: string, typeId: number): number {

        console.log(`Adding import: ${importModule}, ${importField}, ${internalName}, ${typeId}`)
        var declCount = 0;

        var data: Array<number> = [];
        var importModuleUtf8 = this.stringToUTF8(importModule);
        // length of subsequent string
        data.push(importModuleUtf8.length);
        // string bytes from name
        for (var i = 0; i < importModuleUtf8.length; i++) {
            data.push(importModuleUtf8[i]);
        }

        var importFieldUtf8 = this.stringToUTF8(importField);
        // length of subsequent string
        data.push(importFieldUtf8.length);
        // string bytes from name
        for (var i = 0; i < importFieldUtf8.length; i++) {
            data.push(importFieldUtf8[i]);
        }

        data.push(0x00); // function type - could be something else
        data.push(typeId);


        for (var i = 0; i < data.length; i++) {
            this.imports.push(data[i]);
        }
        this.importId++;
        return this.functionIndex++;
    }

    AddExportFunction(exportName: string, parameters: Array<WasmType>, result: WasmType | undefined, functionBody: Array<number>): ExportFunctionIds {
        var typeId = this.addFunctionType(parameters, result);
        var functionId = this.addFunction(typeId);
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
    // Return ID
    typeId = 0;
    typeCache: any = {};
    addFunctionType(parameters: Array<WasmType>, result: WasmType | undefined): number {
        var data: Array<number> = [0x60,
            parameters.length,
            ...parameters
        ];
        if (result !== undefined) {
            data.push(1);
            data.push(result);
        }
        else {
            data.push(0);
        }

        var typeKey = JSON.stringify(data);
        var cacheMatch = this.typeCache[typeKey];
        if (cacheMatch != undefined) {
            return cacheMatch;
        }

        this.typeCache[typeKey] = this.typeId;

        for (var i = 0; i < data.length; i++) {
            this.types.push(data[i]);
        }

        return this.typeId++;
    }

    functionIndex = 0;
    functionCount = 0;
    addFunction(typeIndex: number): number {
        this.functions.push(typeIndex);
        this.functionCount++;
        return this.functionIndex++;
    }

    stringToUTF8(text: string): Array<number> {
        if (!text) {
            throw new Error('no text');
        }
        var results: Array<number> = [];
        // TODO: I need better handlings of this. 
        for (var i = 0; i < text.length; i++) {
            results.push(text.charCodeAt(i));
        }
        return results;
    }
    UTF8ToString(utf8: Array<number>): string {
        // TODO: fix accuracy and performance
        var result = "";//String.fromCharCode(utf8);
        for (var i = 0; i < utf8.length; i++) {
            result += String.fromCharCode(utf8[i])
        }
        return result;
    }

    exportId = 0;
    addExport(exportName: string, exportKind: ExportKind, index: number): number {
        var nameUtf8 = this.stringToUTF8(exportName);
        // console.log('Converting ' + exportName);
        // console.log(nameUtf8);
        // console.log(nameUtf8.length);
        // console.log(index);
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

    AddFunctionDetails(parameters: Array<WasmType>, result: WasmType | undefined, functionBody: Array<number>): FunctionIds {
        var typeId = this.addFunctionType(parameters, result);
        var functionId = this.addFunction(typeId);
        var declCount = 0;
        var codeId = this.addCode([declCount, ...functionBody, Opcodes.end]);
        return {
            typeId: typeId,
            functionId: functionId,
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


    formatCodeSection() {

    }
    formatSectionForWasmWithSizeAndCount(SectionID: number, count: number, bytes: Array<number>): Array<number> {
        var results = bytes.length > 0 ?
            [SectionID,
                ...toUnsignedLEB128(bytes.length + 1),
                ...toUnsignedLEB128(count),
                ...bytes] : [];

        // if (SectionID == 0x02) {
        //     console.log(results.map(x => x.toString(16)));
        // }
        return results;
    }
    getBytes(): Uint8Array {
        var results = Uint8Array.from(
            [
                ...this.wasmHeader,
                ...this.wasmVersion,

                // TODO Custom

                ...this.formatSectionForWasmWithSizeAndCount(this.section.type, this.typeId, this.types),
                ...this.formatSectionForWasmWithSizeAndCount(this.section.import, this.importId, this.imports),
                ...this.formatSectionForWasmWithSizeAndCount(this.section.function, this.functionCount, this.functions),

                // TODO Table
                // TODO Memory
                // ...this.formatSectionForWasmWithSizeAndCount(this.section.memory,),
                // TODO Global

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