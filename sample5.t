// fn error message:string = message log ;

// Ok, cannot use the same value twice for now
// fn 'Is {target:int} between {start:int} and {end:int} ?' = target end >= target start < && ;

import 'function' 'stringLog' fn stringLog start:int length:int = ; 
import 'function' 'readFile' fn readFile start:int int = ; 

 export fn test int = 
      0 11   i32.Store // 11 bytes for string
      1 72   i32.Store // H
      2 101  i32.Store // e
      3 108  i32.Store // l
      4 108  i32.Store // l
      5 111  i32.Store // o
      6 32   i32.Store // 
      7 119  i32.Store // w
      8 111  i32.Store // o
      9 114  i32.Store // r
     10 108  i32.Store // l
     11 100  i32.Store // d
      0      stringLog 1 ; 
   
 export fn test2 int = 
     0 11 i32.Store
     1 'Character H' i32.Store 
     2 'Character e' i32.Store 
     3 'Character l' i32.Store 
     4 'Character l' i32.Store 
     5 'Character o' i32.Store 
     6 'Character Space' i32.Store 
     7 'Character w' i32.Store 
     8 'Character o' i32.Store 
     9 'Character r' i32.Store 
     10 'Character l' i32.Store 
     11 'Character d' i32.Store 
     0 stringLog 1 ; 
 export fn test3 int = 
     0 11 i32.Store
     1 "Hello world"
     0 stringLog 1 ;