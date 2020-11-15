parse 'Op blockType' = 0x40 ;
parse 'Op unreachable' = 0x00 ;
parse 'Op nop' = 0x01 ;
parse 'Op blockIn' = 0x02 ;
parse 'Op blockLoop' = 0x03 ;
parse 'Op blockIf' = 0x04 ;
parse 'Op else' = 0x05 ;
parse 'Op labelIndex' = 0x0C ;
parse 'Op labelIfIndex' = 0x0D ;
parse 'Op umm' = 0x0E ;
parse 'Op return' = 0x0F ;
parse 'Op call' = 0x10 ;
parse 'Op callIndirect' = 0x11 ;

// Parametric
parse 'Op drop' = 0x1A ;
parse 'Op select' = 0x1B ;

// variable
parse 'Op get_local' = 0x20 ;
parse 'Op set_local' = 0x21 ;
parse 'Op tee_local' = 0x22 ;
parse 'Op get_global' = 0x23 ;
parse 'Op set_global' = 0x24 ;

// memory
parse 'Op i32Load' = 0x28 ;
parse 'Op i64Load' = 0x29 ;
parse 'Op f32Load' = 0x2A ;
parse 'Op f64Load' = 0x2B ;
parse 'Op i32Load8_s' = 0x2C ;
parse 'Op i32Load8_u' = 0x2D ;
parse 'Op i32Load16_s' = 0x2E ;
parse 'Op i32Load16_u' = 0x2F ;
parse 'Op i64Load8_s' = 0x30 ;
parse 'Op i64Load8_u' = 0x31 ;
parse 'Op i64Load16_s' = 0x32 ;
parse 'Op i64Load16_u' = 0x33 ;
parse 'Op i64Load32_s' = 0x34 ;
parse 'Op i64Load32_u' = 0x35 ;
parse 'Op i32Store' = 0x36 ;
parse 'Op i64Store' = 0x37 ;
parse 'Op f32Store' = 0x38 ;
parse 'Op f64Store' = 0x39 ;
parse 'Op i32Store8' = 0x3A ;
parse 'Op i32Store16' = 0x3B ;
parse 'Op i64Store8' = 0x3C ;
parse 'Op i64Store16' = 0x3D ;
parse 'Op i64Store32' = 0x3E ;
parse 'Op memorySize' = 0x3F ;
parse 'Op memoryGrow' = 0x40 ;

// numeric - immediate value following
parse 'Op i32Const' = 0x41 ;
parse 'Op i64Const' = 0x42 ;
parse 'Op f32Const' = 0x43 ;
parse 'Op f64Const' = 0x44 ;

// numeric - without immediate values
parse 'Op i32eqz' = 0x45 ;
parse 'Op i32eq' = 0x46 ;
parse 'Op i32ne' = 0x47 ;
parse 'Op i32lt_s' = 0x48 ;
parse 'Op i32lt_u' = 0x49 ;
parse 'Op i32gt_s' = 0x4A ;
parse 'Op i32gt_u' = 0x4B ;
parse 'Op i32le_s' = 0x4C ;
parse 'Op i32le_u' = 0x4D ;
parse 'Op i32ge_s' = 0x4E ;
parse 'Op i32ge_u' = 0x4F ;
parse 'Op i64eqz' = 0x50 ;
parse 'Op i64eq' = 0x51 ;
parse 'Op i64ne' = 0x52 ;
parse 'Op i64lt_s' = 0x53 ;
parse 'Op i64lt_u' = 0x54 ;
parse 'Op i64gt_s' = 0x55 ;
parse 'Op i64gt_u' = 0x56 ;
parse 'Op i64le_s' = 0x57 ;
parse 'Op i64le_u' = 0x58 ;
parse 'Op i64ge_s' = 0x59 ;
parse 'Op i64ge_u' = 0x5A ;
parse 'Op f32eq' = 0x5B ;
parse 'Op f32ne' = 0x5C ;
parse 'Op f32lt' = 0x5D ;
parse 'Op f32gt' = 0x5E ;
parse 'Op f32le' = 0x5F ;
parse 'Op f32ge' = 0x60 ;
parse 'Op f64eq' = 0x61 ;
parse 'Op f64ne' = 0x62 ;
parse 'Op f64lt' = 0x63 ;
parse 'Op f64gt' = 0x64 ;
parse 'Op f64le' = 0x65 ;
parse 'Op f64ge' = 0x66 ;
parse 'Op i32clz' = 0x67 ;
parse 'Op i32ctz' = 0x68 ;
parse 'Op i32popcnt' = 0x69 ;
parse 'Op i32add' = 0x6A ;
parse 'Op i32sub' = 0x6B ;
parse 'Op i32mul' = 0x6C ;
parse 'Op i32div_s' = 0x6D ;
parse 'Op i32div_u' = 0x6E ;
parse 'Op i32rem_s' = 0x6F ;
parse 'Op i32rem_u' = 0x70 ;
parse 'Op i32and' = 0x71 ;
parse 'Op i32or' = 0x72 ;
parse 'Op i32xor' = 0x73 ;
parse 'Op i32shl' = 0x74 ;
parse 'Op i32shr_s' = 0x75 ;
parse 'Op i32shr_u' = 0x76 ;
parse 'Op i32rotl' = 0x77 ;
parse 'Op i32rotr' = 0x78 ;
parse 'Op i64clz' = 0x79 ;
parse 'Op i64ctz' = 0x7A ;
parse 'Op i64popcnt' = 0x7B ;
parse 'Op i64add' = 0x7C ;
parse 'Op i64sub' = 0x7D ;
parse 'Op i64mul' = 0x7E ;
parse 'Op i64div_s' = 0x7F ;
parse 'Op i64div_u' = 0x80 ;
parse 'Op i64rem_s' = 0x81 ;
parse 'Op i64rem_u' = 0x82 ;
parse 'Op i64and' = 0x83 ;
parse 'Op i64or' = 0x84 ;
parse 'Op i64xor' = 0x85 ;
parse 'Op i64shl' = 0x86 ;
parse 'Op i64shr_s' = 0x87 ;
parse 'Op i64shr_u' = 0x88 ;
parse 'Op i64rotl' = 0x89 ;
parse 'Op i64rotr' = 0x8A ;
parse 'Op f32abs' = 0x8B ;
parse 'Op f32neg' = 0x8C ;
parse 'Op f32ceil' = 0x8D ;
parse 'Op f32floor' = 0x8E ;
parse 'Op f32trunc' = 0x8F ;
parse 'Op f32nearest' = 0x90 ;
parse 'Op f32sqrt' = 0x91 ;
parse 'Op f32add' = 0x92 ;
parse 'Op f32sub' = 0x93 ;
parse 'Op f32mul' = 0x94 ;
parse 'Op f32div' = 0x95 ;
parse 'Op f32min' = 0x96 ;
parse 'Op f32max' = 0x97 ;
parse 'Op f32copysign' = 0x98 ;
parse 'Op f64abs' = 0x99 ;
parse 'Op f64neg' = 0x9A ;
parse 'Op f64ceil' = 0x9B ;
parse 'Op f64floor' = 0x9C ;
parse 'Op f64trunc' = 0x9D ;
parse 'Op f64nearest' = 0x9E ;
parse 'Op f64sqrt' = 0x9F ;
parse 'Op f64add' = 0xA0 ;
parse 'Op f64sub' = 0xA1 ;
parse 'Op f64mul' = 0xA2 ;
parse 'Op f64div' = 0xA3 ;
parse 'Op f64min' = 0xA4 ;
parse 'Op f64max' = 0x45 ;
parse 'Op f64copysign' = 0xA6 ;
parse 'Op i32wrap_i64' = 0xA7 ;
parse 'Op i32trunc_f32_s' = 0xA8 ;
parse 'Op i32trunc_f32_u' = 0xA9 ;
parse 'Op i32trunc_f64_s' = 0xAA ;
parse 'Op i32trunc_f64_u' = 0xAB ;
parse 'Op i64extend_i32_s' = 0xAC ;
parse 'Op i64extend_i32_u' = 0xAD ;
parse 'Op i64trunc_f32_s' = 0xAE ;
parse 'Op i64trunc_f32_u' = 0xAF ;
parse 'Op i64trunc_f64_s' = 0xB0 ;
parse 'Op i64trunc_f64_u' = 0xB1 ;
parse 'Op f32convert_i32_s' = 0xB2 ;
parse 'Op f32convert_i32_u' = 0xB3 ;
parse 'Op f32convert_i64_s' = 0xB4 ;
parse 'Op f32convert_i64_u' = 0xB5 ;
parse 'Op f32demote_f64' = 0xB6 ;
parse 'Op f64convert_i32_s' = 0xB7 ;
parse 'Op f64convert_i32_u' = 0xB8 ;
parse 'Op f64convert_i64_s' = 0xB9 ;
parse 'Op f64convert_i64_u' = 0xBA ;
parse 'Op f64promote_f32' = 0xBB ;
parse 'Op i32reinterpret_f32' = 0xBC ;
parse 'Op i64reinterpret_f64' = 0xBD ;
parse 'Op f32reinterpret_i32' = 0xBE ;
parse 'Op f64reinterpret_i64' = 0xBF ;
parse 'Op i32extend8_s' = 0xC0 ;
parse 'Op i32extend16_s' = 0xC1 ;
parse 'Op i64extend8_s' = 0xC2 ;
parse 'Op i64extend16_s' = 0xC3 ;
parse 'Op i64extend32_s' = 0xC4 ;

// saturation truncation - 1 byte prefix
parse 'Op i32tunc_sat' = 0xFC ;
//    0 = i32_f32_s
//    1 = i32_f32_u
//    2 = i32_f64_s
//    3 = i32_f64_u
//    4 = 64_f32_s
//    5 = 64_f32_u
//    6 = 64_f64_s
//    7 = 64_f64_u    
parse 'Op end' = 0x0b ; // expression end. function body / block end    


export fn compile int = 0 ;



// fn error message:string = message log ;

// Ok, cannot use the same value twice for now


// fn 'Is {target:int} between {start:int} and {end:int} ?' = target end >= target start < && ;

export fn test int = 5 3 > ;
 // 'Is 5 between 0 and 255 ? ' ;

// parse byte i:int =  
//     i 0 > i 255 < && ? 
// i ;

// op i32.Store = 0x36:byte 0x02:byte 0x00:byte ;

// export fn 'Op i32.Store' offset:int int = i32.Store 0x02:byte 0x00:byte ;

// All parsing functions should likely have the signature
// [name] offset:int int
// where that is the starting offset then the ending offset in the lexor list
// Memory access is expected

