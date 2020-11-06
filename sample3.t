export fn '{a:int} is less than {b:int} ?' int = a b < ;
export fn '{a:int} is greater than {b:int} ?' int = a b > ;


//export fn test int = 
//   '3 is less than 5 ?' 1 ==
//   ;
//   '5 is less than 5 ?' 0 ==
//    && ;
    
    


  fn 'add two {i:int}' int = 2 i + ;
   // fn 'add two' i:int int = 2 i + ;
  // fn 'add {x:int} to {y:int}' int = x y + ;
  // testing a comment
  fn 'add one' i:int int = 1 i + ;
//  fn 'add one twice' i:int int = i 'add one' 'add one' ;
  fn double i:int int = 2 i * ;
// fn 'add a' a:int b:int int = a b + ;

// fn '{a:int} is less' int = 0 ;
     
 fn subtract a:int b:int int = a b - ;
//  fn 'less than' a:int b:int int = a b < ;
//  
//  // export fn '{a:int} is greater than {b:int} ?' int = a b > ;
// //  export fn '{a:int} is less than {b:int} ?' int = a b < ;
//  
  export fn test int =   
    '3 is less than 5 ?' 1 == 
    '5 is less than 5 ?' 0 == 
    2 double 4 ==          
    5 3 subtract 2 ==              
    && && &&
    ;

//   5 double 'add two' 12 == 

// fn add a:int b:int int = a b + ;