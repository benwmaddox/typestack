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
                console.log(expression.desc);
            }
            if (expression.function) {
                // TODO: maybe op should be separate from value? 
                var functionEndIndex = expressions.findIndex(x => x.op == Opcodes.end);
                var name = expression.function.functionReference?.name || "ERROR STATE";
                var type = expression.function.types ? expression.function.types[0] : {};
                var resultType = type.output?.map(x => this.mapTypeToWasmType(x))[0] || WasmType.f64;
                var typeIndex = wasmStructure.addFunctionType(type.input?.map(x => this.mapTypeToWasmType(x)) || [WasmType.f64], resultType);
                var functionIndex = wasmStructure.addFunction(typeIndex);
                if (false) {
                    wasmStructure.addExport(name, ExportKind.function, functionIndex)
                }

                // wasmStructure.AddExportFunction(name,
                //     type.parameters?.map(x => this.mapTypeToWasmType(x)) || [WasmType.f64],
                //     null,
                //     expressions.slice(i, functionEndIndex)
                // )

            }
            if (expression.op == Opcodes.end) {
                // wasmStructure.addCode()
            }
            else if (expression.op !== undefined) {

            }
            if (expression.reference) {

            }


            i++;
        }
    }
    mapTypeToWasmType(input: string): WasmType {
        if (input == "int") return WasmType.i32;
        if (input == "long") return WasmType.i64;
        if (input == "float") return WasmType.f32;
        if (input == "double") return WasmType.f64;
        throw new Error("Can't convert to wasm type " + input);
    }
}