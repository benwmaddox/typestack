// import 'console' 'log' fn emit i:int ; 

fn '{a:int} is less than {b:int} ?' int = a b < ;
fn '{a:int} is greater than {b:int} ?' int = a b > ;

fn 'add two {i:int}' int = 2 i + ;

// testing a comment
fn 'add one' i:int int = 1 i + ;

fn double i:int int = 2 i * ;    
fn subtract a:int b:int int = a b - ;
 
export fn test int =   
    '3 is less than 5 ?' 1 == 
    '5 is less than 5 ?' 0 == 
    2 double 4 ==          
    500 350 subtract 150 ==              
    && && &&
    ;

fn 'addit' a:int int = 3 a + ;

export fn blah int = 10101 emit ;

