: show-string int = "This is a test" emit 0 ;


// This is a comment
: run int = show-string ;

run ;

// TODO: have to figure out flow control words like ? : ..
: 'fizz buzz text' int string = dup 15 % ? "Fizz Buzz" emit :
                                dup 5 % ? "Buzz" emit :
                                dup 3 % ? "Fizz" emit : 
                                emit ;
: 'fizz buzz test' int = 0 20 .. 'fizz buzz text' ;

'fizz buzz test' ;
