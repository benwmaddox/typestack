import { ASTModule, ASTParameter, ASTResult, ASTAction } from "./intermediate-structure";
import { WasmStructure, WasmType } from "./wasm-structure";

export class Emitter {



    getBytes(module: ASTModule): Uint8Array {
        var result = new Uint8Array();

        var wasmStructure = new WasmStructure();


        for (var i = 0; i < module.functions.length; i++) {
            var func = module.functions[i];
            if (func.shouldExport && func.name) {
                if (func.name) {
                    var exportIDs = wasmStructure.AddExportFunction(func.name, this.convertASTParametersToWasm(func.parameters), this.convertASTResultToWasm(func.result) || WasmType.i32,
                        this.buildFunctionBody(func.actions));
                }
                else {
                    throw new Error("Missing function name with export");
                }
            }
            else {
                var functionIDs = wasmStructure.AddFunctionDetails(this.convertASTParametersToWasm(func.parameters), this.convertASTResultToWasm(func.result) || WasmType.i32,
                    this.buildFunctionBody(func.actions));
            }
        }

        return wasmStructure.getBytes();
    }

    buildFunctionBody(actions: Array<ASTAction>): number[] {
        var results: Array<number> = [];

        // TODO ..............................................................................................................

        return results;
    }

    convertASTParametersToWasm(input: Array<ASTParameter>): Array<WasmType> {
        var result: Array<WasmType> = [];

        for (var i = 0; i < input.length; i++) {
            var wasmType = this.convertASTParameterToWasm(input[i]);
            if (wasmType != null) {
                result.push(wasmType);
            }
        }

        return result;
    }

    convertASTParameterToWasm(input: ASTParameter | null): (WasmType | null) {
        var result: WasmType | null = null;
        if (input == null) return null;

        if (input.type == "int") {
            result = WasmType.i32;
        }
        else if (input.type == "long") {
            result = WasmType.i64;
        }
        else if (input.type == "float") {
            result = WasmType.f32;
        }
        else if (input.type == "double") {
            result = WasmType.f64;
        }

        return result;
    }
    convertASTResultToWasm(input: ASTResult | null): (WasmType | null) {
        var result: WasmType | null = null;
        if (input == null) return null;

        if (input.type == "int") {
            result = WasmType.i32;
        }
        else if (input.type == "long") {
            result = WasmType.i64;
        }
        else if (input.type == "float") {
            result = WasmType.f32;
        }
        else if (input.type == "double") {
            result = WasmType.f64;
        }

        return result;
    }
}