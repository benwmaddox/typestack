import 'function' 'stringLog' fn stringLog start:int length:int = ; 


test export fn 'Addition works' int = 1 1 + 2 == ;
test export fn 'Subtraction works' int = 5 3 - 2 == ;

fn 'Add {a:int} to {b:int}' int = a b + ;
export fn 'Adding numbers with interpolation works' int = 
  'Add 3 to 5' 8 == assert ;

