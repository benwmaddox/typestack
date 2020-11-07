import { ParsedExpression, ContextType } from './context-parser'
import { ASTModule, ASTParameter, ASTResult, ASTAction } from "./intermediate-structure";
import { WasmStructure, WasmType, Opcodes, ExportKind } from "./wasm-structure";

export class ContextEmitter {
    getBytes(expressions: Array<ParsedExpression>) {
        var wasmStructure: WasmStructure = new WasmStructure();
        var i = 0;
        // var currentFunctionId : number | null = null;
        while (i < expressions.length) {
            var expression: ParsedExpression = expressions[i];

            if (expression.desc) {
                // console.log(expression.desc);
            }
            if (expression.desc == 'import') {

                // var importEndIndex = expressions.slice(i).findIndex(x => x.op == Opcodes.end) + i;
                // var importType = expressions.slice(i, importEndIndex).map(x => x.desc).indexOf('fn') != -1 ? "fn" : 'NOT IMPLEMENTED IMPORT';
                // console.log('importing emitter')
                // var type = expression.function.types ? expression.function.types[0] : {};
                // var resultType = type.output?.map(x => this.mapTypeToWasmType(x))[0] || WasmType.f64;

            }
            if (expression.function) {
                var functionEndIndex = expressions.slice(i).findIndex(x => x.op == Opcodes.end) + i;
                var functionReference = expression.function.functionReference;
                if (functionReference == null) {
                    throw Error("There should be a function reference here")
                }
                var name = functionReference.name || "ERROR STATE";
                var type = expression.function.types ? expression.function.types[0] : {};
                var resultType = type.output?.map(x => this.mapTypeToWasmType(x))[0] || WasmType.f64;
                var typeIndex = wasmStructure.addFunctionType(type.input?.map(x => this.mapTypeToWasmType(x)) || [WasmType.f64], resultType);
                functionReference.typeID = typeIndex;
                var functionIndex = wasmStructure.addFunction(typeIndex);
                functionReference.functionID = functionIndex;

                if (i > 0 && expressions[i - 1].desc == 'export') { // TODO: Better way to handle this?
                    var exportIndex = wasmStructure.addExport(name, ExportKind.function, functionIndex);
                    functionReference.exportID = exportIndex;
                }
                if (i > 2 && expressions[i - 3].desc == 'import') { // TODO: Better way to handle this?
                    var importIndex = wasmStructure.addImportFunction(expressions[i - 2].desc || 'UNKNOWN', expressions[i - 1].desc || 'UNKNOWN', name, functionIndex);
                    // functionReference.im = ImportIndex;
                }
                var code: Array<number> = expressions
                    .slice(i, functionEndIndex)
                    .filter(x => x.op != undefined)
                    .map(x => typeof (x.op) == 'function' ? <number>x.op() : <number>x.op);

                var declCount = 0;
                var codeId = wasmStructure.addCode([declCount, ...code, Opcodes.end])

                i = functionEndIndex;

            }
            // TODO: maybe op should be separate from value? 
            // if (expression.op == Opcodes.end) {
            //     // wasmStructure.addCode()
            // }
            // else if (expression.op !== undefined) {

            // }
            // if (expression.reference) {

            // }


            i++;
        }
        return wasmStructure.getBytes();
    }
    mapTypeToWasmType(input: string): WasmType {
        if (input == "int") return WasmType.i32;
        if (input == "long") return WasmType.i64;
        if (input == "float") return WasmType.f32;
        if (input == "double") return WasmType.f64;
        throw new Error("Can't convert to wasm type " + input);
    }
}
