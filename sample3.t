// fn 'add two {i:int}' int = 2 i + ;

fn 'add two' i:int int = 2 i + ;

// fn 'add {x:int} to {y:int}' int = x y + ;

// testing a comment

fn 'add one' i:int int = 1 i + ;
// fn 'Add one to 1' int = 1 'add one' ;
fn 'add one twice' i:int int = i 'add one' 'add one' ;

fn double i:int int = 2 i * ;



fn 'add' a:int b:int int = a b + ;

fn subtract a:int b:int int = a b - ;

fn 'less than' a:int b:int int = a b < ;

export fn '{a:int} is less than {b:int} ?' int = a b < ;

// fn test int = 10 double ;

 export fn test int = 
     5 double 'add two' 12 == 
     2 double 4 ==
     5 3 subtract 2 ==    
     && && ; 
     
// '3 is less than 5 ?' 1 ==
// '5 is less than 5 ?' 0 ==
// && && 
// ;
 