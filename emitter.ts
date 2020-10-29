import { ASTModule } from "./intermediate-structure";
import { WasmStructure } from "./wasm-structure";

export class Emitter {



    getBytes(module: ASTModule): Uint8Array {
        var result = new Uint8Array();

        var wasmStructure = new WasmStructure();
        // wasmStructure.addFunction()


        return wasmStructure.getBytes();
    }
}