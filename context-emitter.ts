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
            if (expression.function) {
                var functionEndIndex = expressions.slice(i).findIndex(x => x.op == Opcodes.end) + i;
                var functionReference = expression.function.functionReference;
                if (functionReference == null) {
                    throw Error("There should be a function reference here")
                }
                var name = functionReference.name || "ERROR STATE";
                var type = expression.function.types ? expression.function.types[0] : {};
                var resultType = type.output?.map(x => this.mapTypeToWasmType(x))[0] || WasmType.f64;
                // TODO: reuse function types if possible
                var typeIndex = wasmStructure.addFunctionType(type.input?.map(x => this.mapTypeToWasmType(x)) || [WasmType.f64], resultType);
                var functionIndex = wasmStructure.addFunction(typeIndex);

                if (true) { // TODO: Figure out best way to do this
                    var exportIndex = wasmStructure.addExport(name, ExportKind.function, functionIndex)
                    functionReference.exportID = exportIndex;
                }
                console.log(`Code for function ${name} goes from ${i} to ${functionEndIndex}`)
                var code: Array<number> = expressions
                    .slice(i, functionEndIndex)
                    .filter(x => x.op != undefined)
                    .map(x => typeof (x.op) == 'function' ? <number>x.op() : <number>x.op)
                var declCount = 0;
                var codeId = wasmStructure.addCode([declCount, ...code, Opcodes.end])

                functionReference.typeID = typeIndex;
                functionReference.functionID = functionIndex;

                if (functionEndIndex > i) {
                    i = functionEndIndex + 1;
                }

                // wasmStructure.AddExportFunction(name,
                //     type.parameters?.map(x => this.mapTypeToWasmType(x)) || [WasmType.f64],
                //     null,
                //     expressions.slice(i, functionEndIndex)
                // )
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
