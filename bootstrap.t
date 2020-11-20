import 'function' 'stringLog' fn stringLog start:int int = 0 ; 
import 'function' 'readFile' fn readFile start:int int = ; 


op 'Op blockType' = 0x40 ;
op 'Op unreachable' = 0x00 ;
op 'Op nop' = 0x01 ;
op 'Op blockIn' = 0x02 ;
op 'Op blockLoop' = 0x03 ;
op 'Op blockIf' = 0x04 ;
op 'Op else' = 0x05 ;
op 'Op labelIndex' = 0x0C ;
op 'Op labelIfIndex' = 0x0D ;
op 'Op umm' = 0x0E ;
op 'Op return' = 0x0F ;
op 'Op call' = 0x10 ;
op 'Op callIndirect' = 0x11 ;

// Parametric
op 'Op drop' = 0x1A ;
op 'Op select' = 0x1B ;

// variable
op 'Op get_local' = 0x20 ;
op 'Op set_local' = 0x21 ;
op 'Op tee_local' = 0x22 ;
op 'Op get_global' = 0x23 ;
op 'Op set_global' = 0x24 ;

// memory
op 'Op i32Load' = 0x28 0x02 0x00 ;
op 'Op i64Load' = 0x29 ;
op 'Op f32Load' = 0x2A ;
op 'Op f64Load' = 0x2B ;
op 'Op i32Load8_s' = 0x2C ;
op 'Op i32Load8_u' = 0x2D ;
op 'Op i32Load16_s' = 0x2E ;
op 'Op i32Load16_u' = 0x2F ;
op 'Op i64Load8_s' = 0x30 ;
op 'Op i64Load8_u' = 0x31 ;
op 'Op i64Load16_s' = 0x32 ;
op 'Op i64Load16_u' = 0x33 ;
op 'Op i64Load32_s' = 0x34 ;
op 'Op i64Load32_u' = 0x35 ;
op 'Op i32Store' = 0x36 0x02 0x00;
op 'Op i64Store' = 0x37 ;
op 'Op f32Store' = 0x38 ;
op 'Op f64Store' = 0x39 ;
op 'Op i32Store8' = 0x3A ;
op 'Op i32Store16' = 0x3B ;
op 'Op i64Store8' = 0x3C ;
op 'Op i64Store16' = 0x3D ;
op 'Op i64Store32' = 0x3E ;
op 'Op memorySize' = 0x3F 0x00 ;
op 'Op memoryGrow' = 0x40  ;

// numeric - immediate value following
op 'Op i32Const' = 0x41 ;
op 'Op i64Const' = 0x42 ;
op 'Op f32Const' = 0x43 ;
op 'Op f64Const' = 0x44 ;

// numeric - without immediate values
op 'Op i32eqz' = 0x45 ;
op 'Op i32eq' = 0x46 ;
op 'Op i32ne' = 0x47 ;
op 'Op i32lt_s' = 0x48 ;
op 'Op i32lt_u' = 0x49 ;
op 'Op i32gt_s' = 0x4A ;
op 'Op i32gt_u' = 0x4B ;
op 'Op i32le_s' = 0x4C ;
op 'Op i32le_u' = 0x4D ;
op 'Op i32ge_s' = 0x4E ;
op 'Op i32ge_u' = 0x4F ;
op 'Op i64eqz' = 0x50 ;
op 'Op i64eq' = 0x51 ;
op 'Op i64ne' = 0x52 ;
op 'Op i64lt_s' = 0x53 ;
op 'Op i64lt_u' = 0x54 ;
op 'Op i64gt_s' = 0x55 ;
op 'Op i64gt_u' = 0x56 ;
op 'Op i64le_s' = 0x57 ;
op 'Op i64le_u' = 0x58 ;
op 'Op i64ge_s' = 0x59 ;
op 'Op i64ge_u' = 0x5A ;
op 'Op f32eq' = 0x5B ;
op 'Op f32ne' = 0x5C ;
op 'Op f32lt' = 0x5D ;
op 'Op f32gt' = 0x5E ;
op 'Op f32le' = 0x5F ;
op 'Op f32ge' = 0x60 ;
op 'Op f64eq' = 0x61 ;
op 'Op f64ne' = 0x62 ;
op 'Op f64lt' = 0x63 ;
op 'Op f64gt' = 0x64 ;
op 'Op f64le' = 0x65 ;
op 'Op f64ge' = 0x66 ;
op 'Op i32clz' = 0x67 ;
op 'Op i32ctz' = 0x68 ;
op 'Op i32popcnt' = 0x69 ;
op 'Op i32add' = 0x6A ;
op 'Op i32sub' = 0x6B ;
op 'Op i32mul' = 0x6C ;
op 'Op i32div_s' = 0x6D ;
op 'Op i32div_u' = 0x6E ;
op 'Op i32rem_s' = 0x6F ;
op 'Op i32rem_u' = 0x70 ;
op 'Op i32and' = 0x71 ;
op 'Op i32or' = 0x72 ;
op 'Op i32xor' = 0x73 ;
op 'Op i32shl' = 0x74 ;
op 'Op i32shr_s' = 0x75 ;
op 'Op i32shr_u' = 0x76 ;
op 'Op i32rotl' = 0x77 ;
op 'Op i32rotr' = 0x78 ;
op 'Op i64clz' = 0x79 ;
op 'Op i64ctz' = 0x7A ;
op 'Op i64popcnt' = 0x7B ;
op 'Op i64add' = 0x7C ;
op 'Op i64sub' = 0x7D ;
op 'Op i64mul' = 0x7E ;
op 'Op i64div_s' = 0x7F ;
op 'Op i64div_u' = 0x80 ;
op 'Op i64rem_s' = 0x81 ;
op 'Op i64rem_u' = 0x82 ;
op 'Op i64and' = 0x83 ;
op 'Op i64or' = 0x84 ;
op 'Op i64xor' = 0x85 ;
op 'Op i64shl' = 0x86 ;
op 'Op i64shr_s' = 0x87 ;
op 'Op i64shr_u' = 0x88 ;
op 'Op i64rotl' = 0x89 ;
op 'Op i64rotr' = 0x8A ;
op 'Op f32abs' = 0x8B ;
op 'Op f32neg' = 0x8C ;
op 'Op f32ceil' = 0x8D ;
op 'Op f32floor' = 0x8E ;
op 'Op f32trunc' = 0x8F ;
op 'Op f32nearest' = 0x90 ;
op 'Op f32sqrt' = 0x91 ;
op 'Op f32add' = 0x92 ;
op 'Op f32sub' = 0x93 ;
op 'Op f32mul' = 0x94 ;
op 'Op f32div' = 0x95 ;
op 'Op f32min' = 0x96 ;
op 'Op f32max' = 0x97 ;
op 'Op f32copysign' = 0x98 ;
op 'Op f64abs' = 0x99 ;
op 'Op f64neg' = 0x9A ;
op 'Op f64ceil' = 0x9B ;
op 'Op f64floor' = 0x9C ;
op 'Op f64trunc' = 0x9D ;
op 'Op f64nearest' = 0x9E ;
op 'Op f64sqrt' = 0x9F ;
op 'Op f64add' = 0xA0 ;
op 'Op f64sub' = 0xA1 ;
op 'Op f64mul' = 0xA2 ;
op 'Op f64div' = 0xA3 ;
op 'Op f64min' = 0xA4 ;
op 'Op f64max' = 0x45 ;
op 'Op f64copysign' = 0xA6 ;
op 'Op i32wrap_i64' = 0xA7 ;
op 'Op i32trunc_f32_s' = 0xA8 ;
op 'Op i32trunc_f32_u' = 0xA9 ;
op 'Op i32trunc_f64_s' = 0xAA ;
op 'Op i32trunc_f64_u' = 0xAB ;
op 'Op i64extend_i32_s' = 0xAC ;
op 'Op i64extend_i32_u' = 0xAD ;
op 'Op i64trunc_f32_s' = 0xAE ;
op 'Op i64trunc_f32_u' = 0xAF ;
op 'Op i64trunc_f64_s' = 0xB0 ;
op 'Op i64trunc_f64_u' = 0xB1 ;
op 'Op f32convert_i32_s' = 0xB2 ;
op 'Op f32convert_i32_u' = 0xB3 ;
op 'Op f32convert_i64_s' = 0xB4 ;
op 'Op f32convert_i64_u' = 0xB5 ;
op 'Op f32demote_f64' = 0xB6 ;
op 'Op f64convert_i32_s' = 0xB7 ;
op 'Op f64convert_i32_u' = 0xB8 ;
op 'Op f64convert_i64_s' = 0xB9 ;
op 'Op f64convert_i64_u' = 0xBA ;
op 'Op f64promote_f32' = 0xBB ;
op 'Op i32reinterpret_f32' = 0xBC ;
op 'Op i64reinterpret_f64' = 0xBD ;
op 'Op f32reinterpret_i32' = 0xBE ;
op 'Op f64reinterpret_i64' = 0xBF ;
op 'Op i32extend8_s' = 0xC0 ;
op 'Op i32extend16_s' = 0xC1 ;
op 'Op i64extend8_s' = 0xC2 ;
op 'Op i64extend16_s' = 0xC3 ;
op 'Op i64extend32_s' = 0xC4 ;

op 'Character Null' = 0x41 0x00 ;
op 'Character Start of Heading' = 0x41 0x01 ;
op 'Character Start of Text' = 0x41 0x02 ;
op 'Character End of Text' = 0x41 0x03 ;
op 'Character End of Transmission' = 0x41 0x04 ;
op 'Character Enquiry' = 0x41 0x05 ;
op 'Character Acknowledgement' = 0x41 0x06 ;
op 'Character Bell' = 0x41 0x07 ;
op 'Character Backspace' = 0x41 0x08 ;
op 'Character Horizontal Tab' = 0x41 0x09 ;
op 'Character Line Feed' = 0x41 0x0A ;
op 'Character Vertical Tab' = 0x41 0x0B ;
op 'Character Form Feed' = 0x41 0x0C ;
op 'Character Carriage Return' = 0x41 0x0D ;
op 'Character Shift Out' = 0x41 0x0E ;
op 'Character Shift In' = 0x41 0x0F ;
op 'Character Data Link Escape' = 0x41 0x10 ;
op 'Character Device Control 1' = 0x41 0x11 ;
op 'Character Device Control 2' = 0x41 0x12 ;
op 'Character Device Control 3' = 0x41 0x13 ;
op 'Character Device Control 4' = 0x41 0x14 ;
op 'Character Negative Acknowledgement' = 0x41 0x15 ;
op 'Character Synchronous Idle' = 0x41 0x16 ;
op 'Character End of Transmission Block' = 0x41 0x17 ;
op 'Character Cancel' = 0x41 0x18 ;
op 'Character End of Medium' = 0x41 0x19 ;
op 'Character Substitute' = 0x41 0x1A ;
op 'Character Escape' = 0x41 0x1B ;
op 'Character File Separator' = 0x41 0x1C ;
op 'Character Group Separator' = 0x41 0x1D ;
op 'Character Record Separator' = 0x41 0x1E ;
op 'Character Unit Separator' = 0x41 0x1F ;
op 'Character Space' = 0x41 0x20 ;
op 'Character !' = 0x41 0x21 ;
op 'Character ' = 0x41 0x22 ; // fix double quote
op 'Character #' = 0x41 0x23 ;
op 'Character $' = 0x41 0x24 ;
op 'Character %' = 0x41 0x25 ;
op 'Character &' = 0x41 0x26 ;
op 'Character  ????????  ' = 0x41 0x27 ; // fix single quote
op 'Character (' = 0x41 0x28 ;
op 'Character )' = 0x41 0x29 ;
op 'Character *' = 0x41 0x2A ;
op 'Character +' = 0x41 0x2B ;
op 'Character ,' = 0x41 0x2c ;
op 'Character -' = 0x41 0x2D ;
op 'Character .' = 0x41 0x2E ;
op 'Character /' = 0x41 0x2F ;
op 'Character 0' = 0x41 0x30 ;
op 'Character 1' = 0x41 0x31 ;
op 'Character 2' = 0x41 0x32 ;
op 'Character 3' = 0x41 0x33 ;
op 'Character 4' = 0x41 0x34 ;
op 'Character 5' = 0x41 0x35 ;
op 'Character 6' = 0x41 0x36 ;
op 'Character 7' = 0x41 0x37 ;
op 'Character 7' = 0x41 0x37 ;
op 'Character 9' = 0x41 0x39 ;
op 'Character :' = 0x41 0x3A ;
op 'Character ;' = 0x41 0x3B ;
op 'Character <' = 0x41 0x3C ;
op 'Character =' = 0x41 0x3D ;
op 'Character >' = 0x41 0x3E ;
op 'Character ?' = 0x41 0x3F ;
op 'Character @' = 0x41 192 0 ;
op 'Character A' = 0x41 193 0 ;
op 'Character B' = 0x41 194 0 ;
op 'Character C' = 0x41 195 0 ;
op 'Character D' = 0x41 196 0 ;
op 'Character E' = 0x41 197 0 ;
op 'Character F' = 0x41 198 0 ;
op 'Character G' = 0x41 199 0 ;
op 'Character H' = 0x41 200 0 ;
op 'Character I' = 0x41 201 0 ;
op 'Character J' = 0x41 202 0 ;
op 'Character K' = 0x41 203 0 ;
op 'Character L' = 0x41 204 0 ;
op 'Character M' = 0x41 205 0 ;
op 'Character N' = 0x41 206 0 ;
op 'Character O' = 0x41 207 0 ;
op 'Character P' = 0x41 208 0 ;
op 'Character Q' = 0x41 209 0 ;
op 'Character R' = 0x41 210 0 ;
op 'Character S' = 0x41 211 0 ;
op 'Character T' = 0x41 212 0 ;
op 'Character U' = 0x41 213 0 ;
op 'Character V' = 0x41 214 0 ;
op 'Character W' = 0x41 215 0 ;
op 'Character X' = 0x41 216 0 ;
op 'Character Y' = 0x41 217 0 ;
op 'Character Z' = 0x41 218 0 ;
op 'Character [' = 0x41 219 0 ;
op 'Character aasdf' = 0x41 220 0 ; // TODO: fix
op 'Character ]' = 0x41 221 0 ;
op 'Character ^' = 0x41 222 0 ;
op 'Character _' = 0x41 223 0 ;
op 'Character `' = 0x41 224 0 ;
op 'Character a' = 0x41 225 0 ;
op 'Character b' = 0x41 226 0 ;
op 'Character c' = 0x41 227 0 ;
op 'Character d' = 0x41 228 0 ;
op 'Character e' = 0x41 229 0 ;
op 'Character f' = 0x41 230 0 ;
op 'Character g' = 0x41 231 0 ;
op 'Character h' = 0x41 232 0 ;
op 'Character i' = 0x41 233 0 ;
op 'Character j' = 0x41 234 0 ;
op 'Character k' = 0x41 235 0 ;
op 'Character l' = 0x41 236 0 ;
op 'Character m' = 0x41 237 0 ;
op 'Character n' = 0x41 238 0 ;
op 'Character o' = 0x41 239 0 ;
op 'Character p' = 0x41 240 0 ;
op 'Character q' = 0x41 241 0 ;
op 'Character r' = 0x41 242 0 ;
op 'Character s' = 0x41 243 0 ;
op 'Character t' = 0x41 244 0 ;
op 'Character u' = 0x41 245 0 ;
op 'Character v' = 0x41 246 0 ;
op 'Character w' = 0x41 247 0 ;
op 'Character x' = 0x41 248 0 ;
op 'Character y' = 0x41 240 0 ;
op 'Character z' = 0x41 251 0 ;
op 'Character {' = 0x41 251 0 ;
op 'Character |' = 0x41 252 0 ;
op 'Character }' = 0x41 253 0 ;
op 'Character ~' = 0x41 254 0 ;
op 'Character Delete' = 0x41 255 0 ;

// saturation truncation - 1 byte prefix
op 'Op i32tunc_sat' = 0xFC ;
//    0 = i32_f32_s
//    1 = i32_f32_u
//    2 = i32_f64_s
//    3 = i32_f64_u
//    4 = 64_f32_s
//    5 = 64_f32_u
//    6 = 64_f64_s
//    7 = 64_f64_u    
op 'Op end' = 0x0b ; // expression end. function body / block end    

// Ok, cannot use the same value twice for now
// fn 'Is {target:int} between {start:int} and {end:int} ?' = target end >= target start < && ;

// fn error message:string = message log ;

export fn 'Current page size' int = 'Op memorySize' ;

op 'top of stack index' = 0x00 ;

fn 'Load file into memory' int =     
    4 readFile 
    // get byte length
    // 'Op i32Load'
    
     ;

fn 'loop over bytes and lex into array of words' fileOffset:int int = 0 ;    
fn 'take each word in lexed array and parse into expression array' lexArrayOFfset:int int = 0 ;
fn 'take each expression and emit into the WASM format' expressionOFfset:int int = 0 ;
fn 'transform expressions' expressionOffset:int int = 0 ;
fn 'save file' emitInstructionOffset:int int = 
    emitInstructionOffset stringLog
     ;

// Eventually a multi-file approach would be nice
export fn compile int =
    'Load file into memory'    
    // 'loop over bytes and lex into array of words'
    // 'take each word in lexed array and parse into expression array'    
    // 'transform expressions'
    // 'take each expression and emit into the WASM format'       
    
    // 'Op drop'
    'save file'
    ;


// All parsing functions should likely have the signature
// [name] offset:int int
// where that is the starting offset then the ending offset in the lexor list
// Memory access is expected

