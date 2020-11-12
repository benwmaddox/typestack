// import 'console' 'log' fn emit i:int int = 1 ; 
// import 'function' 'log' fn emit2 i:int int = 1 ; 
import 'function' 'stringLog' fn stringLog start:int length:int = ; 
// import 'function' 'stringLog' fn 'log from {start:int} to {length:int}' =   ; 

// fn '{a:int} is less than {b:int} ?' int = a b < ;
// fn '{a:int} is greater than {b:int} ?' int = a b > ;

// fn 'add two {i:int}' int = 2 i + ;

// testing a comment
// fn 'add one' i:int int = 1 i + ;

// fn double i:int int = 2 i * ;    
// fn subtract a:int b:int int = a b - ;
 
// Trying to log "hi"
export fn 'Write to string log' int =
   0 72 'Op i32Store'
   1 105 'Op i32Store'
   2 0 stringLog 
   // 'log from 0 to 1'
  ;

// 0 105 'Op i32Store' 2 0
   
//  'Store int 71 at 0 / 2'   
//  'Store int 105 at 1 / 2'   

// export fn test int =   
//     '3 is less than 5 ?' 1 == 
//     '5 is less than 5 ?' 0 == 
//     2 double 4 ==          
//     500 350 subtract 150 ==              
//     'Write to string log'
//     && && && &&
//     ;

// export fn test int = 
//    'Write to string log' ;

// fn 'addit' a:int int = 3 a + ;

// export fn blah int = 10101 emit ;
// export fn blah2 int = 5 emit2 ;


// https://developer.mozilla.org/en-US/docs/WebAssembly/Understanding_the_text_format
// https://ariya.io/2019/05/basics-of-memory-access-in-webassembly
// https://rsms.me/wasm-intro#addressing-memory
// https://github.com/WebAssembly/design/blob/master/Semantics.md#alignment